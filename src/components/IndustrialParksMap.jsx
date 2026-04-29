import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS = {
  "Активный": "#f97316",
  "Развитие":  "#fb923c",
  "Доступен":  "#fdba74",
};

const DEFAULT_PARK_IMAGE = "/park-photos/parki_RT_z.png";

const PARK_MEDIA = {
  1: {
    image: "/park-photos/kip-master.jpg",
    source: "https://www.kipmaster.ru/",
    sourceLabel: "Официальный сайт КИП «Мастер»",
  },
  2: {
    image: "/park-photos/m7.jpg",
    source: "https://m7development.ru/m7",
    sourceLabel: "Официальный сайт парка «М-7»",
  },
  8: {
    image: "/park-photos/razvitie.jpg",
    source: "http://prompark16.ru/",
    sourceLabel: "Официальный сайт парка «Развитие»",
  },
  11: {
    image: "/park-photos/saba.jpg",
    source: "https://saba-industrial.ru/ru/",
    sourceLabel: "Официальный сайт парка «Саба»",
  },
  13: {
    image: "/park-photos/himgrad.jpg",
    source: "https://www.himgrad.ru",
    sourceLabel: "Официальный сайт Технополиса «Химград»",
  },
  20: {
    image: "/park-photos/agroprompark-kazan.jpg",
    source: "https://agroprompark-kazan.ru/",
    sourceLabel: "Официальный сайт Агропромпарка «Казань»",
  },
  21: {
    image: "/park-photos/kamskie-polyany.jpg",
    source: "https://www.kamapark.ru",
    sourceLabel: "Официальный сайт парка «Камские Поляны»",
  },
};

const dataUrl = (fileName) => `${import.meta.env.BASE_URL}${fileName}`;

const LAYERS_CONFIG = [
  { id: "parks",    label: "Индустриальные парки", color: "#f97316" },
  { id: "boundary", label: "Граница РТ",           color: "#f97316" },
  { id: "landPlots", label: "Земельные участки",   color: "#dc2626" },
  { id: "roads",    label: "Федеральные трассы",   color: "#d97706" },
  { id: "railways", label: "Железные дороги",      color: "#374151" },
];

const projectCoordsToLatLng = ([x, y]) => L.Projection.SphericalMercator.unproject(L.point(x, y));

const projectCoordsToLngLat = ([x, y]) => {
  const latLng = projectCoordsToLatLng([x, y]);
  return [latLng.lng, latLng.lat];
};

const transformGeometryCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates)) return coordinates;
  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    return projectCoordsToLngLat(coordinates);
  }
  return coordinates.map(transformGeometryCoordinates);
};

const normalizeFeatureToLngLat = (feature) => ({
  ...feature,
  geometry: {
    ...feature.geometry,
    coordinates: transformGeometryCoordinates(feature.geometry.coordinates),
  },
});

const normalizeMatchValue = (value = "") => String(value).trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");

const getZoneSettlement = (properties = {}) => properties["н.п."] || properties.city || "";

const getZoneCode = (properties = {}) => properties.zone || "";

const getBaseZoneCode = (value = "") => {
  const normalized = String(value).trim();
  const match = normalized.match(/\(([^)]+)\)/);
  return normalizeMatchValue(match?.[1] || normalized);
};

const getZoneMatchKey = (properties = {}) => {
  const settlement = normalizeMatchValue(getZoneSettlement(properties));
  const zoneCode = normalizeMatchValue(getZoneCode(properties));
  return `${settlement}::${zoneCode}`;
};

const REGULATION_FIELD_LABELS = {
  land_area: "Площадь з.у.",
  frontage: "Ширина передней границы",
  coverage: "Процент застройки",
  floors: "Количество этажей",
  height: "Высота зданий",
  hazard_class: "Класс опасности ОКС",
  setbacks: "Отступы ОКС",
};

const REGULATION_COLUMNS = [
  { key: "code", label: "Код", sublabel: "" },
  { key: "name", label: "Наименование", sublabel: "" },
  { key: "land_area", label: "Площадь з.у. (кв.м)", sublabel: "мин./макс" },
  { key: "frontage", label: "Ширина передней границы з.у. (м)", sublabel: "мин." },
  { key: "coverage", label: "Процент застройки в границах з.у. (%)", sublabel: "макс." },
  { key: "floors", label: "Количество этажей (эт.)", sublabel: "макс." },
  { key: "height", label: "Высота зданий, строений, сооружений (м)", sublabel: "макс." },
  { key: "hazard_class", label: "Класс опасности ОКС", sublabel: "" },
  { key: "setbacks", label: "Отступы ОКС от передней/иных границ з.у. (м)", sublabel: "мин." },
];

const getRegulationCellValue = (item = {}, key) => item[key] || "—";

const getZoneRegulation = (catalog = {}, properties = {}) => {
  const cityKey = normalizeMatchValue(getZoneSettlement(properties));
  const zoneKey = getBaseZoneCode(getZoneCode(properties));
  const cityCatalog = catalog[cityKey];
  if (!cityCatalog?.zones) return null;

  return Object.entries(cityCatalog.zones).find(([code]) => normalizeMatchValue(code) === zoneKey)?.[1] || null;
};

const buildPzzCatalog = () => Object.values(pzzModules).reduce((catalog, moduleValue) => {
  const pzzData = moduleValue?.default ?? moduleValue;
  const cityKey = normalizeMatchValue(pzzData?.city);
  if (!cityKey || !pzzData?.zones) return catalog;

  catalog[cityKey] = pzzData;
  return catalog;
}, {});

const renderRegulationTable = (regulation) => (
  <>
    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
      Отчет по ПЗЗ
    </div>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", lineHeight: 1.5 }}>
      {regulation.zone_name} ({regulation.zone_code})
    </div>
    {Object.entries(regulation.sections)
      .filter(([, items]) => items.length)
      .map(([sectionName, items]) => (
        <details key={sectionName} style={{ marginTop: 10 }} open={sectionName === "ОСНОВНЫЕ"}>
          <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#4b5563" }}>
            {sectionName} ({items.length})
          </summary>
          <div style={{ marginTop: 8, overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr>
                  {REGULATION_COLUMNS.map((column) => (
                    <th key={`${sectionName}-${column.key}-label`} style={{ padding: "8px 8px 4px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc", textAlign: "left", verticalAlign: "bottom" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", lineHeight: 1.4 }}>{column.label}</div>
                    </th>
                  ))}
                </tr>
                <tr>
                  {REGULATION_COLUMNS.map((column) => (
                    <th key={`${sectionName}-${column.key}-sub`} style={{ padding: "0 8px 8px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc", textAlign: "left" }}>
                      <div style={{ fontSize: 10, fontWeight: 500, color: "#64748b", lineHeight: 1.3 }}>{column.sublabel || " "}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, itemIndex) => (
                  <tr key={`${sectionName}-${item.code}-${item.name}-${itemIndex}`}>
                    {REGULATION_COLUMNS.map((column) => (
                      <td key={`${sectionName}-${item.code}-${column.key}-${itemIndex}`} style={{ padding: "8px", borderBottom: itemIndex === items.length - 1 ? "none" : "1px solid #f1f5f9", verticalAlign: "top" }}>
                        <div style={{ fontSize: 10, color: column.key === "code" ? "#111827" : "#334155", fontWeight: column.key === "code" ? 700 : 500, lineHeight: 1.45, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {getRegulationCellValue(item, column.key)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
  </>
);

const getLayerFeatureTitle = (layerId, properties = {}) => {
  if (layerId === "landPlots") return properties.descr || properties.name_by_doc || "Земельный участок";
  return properties.name || "Объект";
};

const getLayerFeatureSubtitle = (layerId, properties = {}) => {
  if (layerId === "landPlots") return properties.type_zone || "Слой земельных участков";
  return properties.district || "";
};

const getLayerBadge = (layerId) => {
  if (layerId === "landPlots") return { label: "Земельный участок", color: "#dc2626", bg: "#fee2e2" };
  return { label: "Индустриальный парк", color: "#f97316", bg: "#ffedd5" };
};

const getFeatureRows = (selectedItem) => {
  if (!selectedItem) return [];

  if (selectedItem.kind === "analysis") {
    return [
      { label: "Площадь пересечений", val: `${selectedItem.matches.length}` },
      { label: "Статус анализа", val: selectedItem.matches.length ? "Найдены пересечения" : "Совпадений не найдено" },
    ];
  }

  if (selectedItem.kind === "park") {
    return [
      { label: "Район", val: selectedItem.properties.district },
      { label: "Адрес", val: selectedItem.properties.address },
      { label: "Площадь (га)", val: selectedItem.properties.area_ha },
      { label: "Свободная площадь (га)", val: selectedItem.properties.free_ha },
      { label: "Год основания", val: selectedItem.properties.year },
      { label: "Профиль", val: selectedItem.properties.profile },
      { label: "Ж/д доступ", val: selectedItem.properties.rail_access },
      { label: "Мощность (МВт)", val: selectedItem.properties.mw },
      { label: "Веб-сайт", val: selectedItem.properties.site },
    ];
  }

  return Object.entries(selectedItem.properties)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({ label: key, val: String(value) }));
};

const formatFieldLabel = (key) => ({
  type_zone: "Тип зоны",
  name_by_doc: "Наименование",
  descr: "Код / описание",
  zone: "Номер зоны",
  "н.п.": "Населенный пункт",
}[key] || key);

const isHttpUrl = (value = "") => /^https?:\/\//i.test(String(value).trim());

const getParkMedia = (properties = {}) => PARK_MEDIA[properties.id] || null;

const getAnalysisResultTitle = (feature) => feature.properties?.descr || feature.properties?.name_by_doc || "Зона ПЗЗ";

const getAnalysisResultSubtitle = (feature) => {
  const properties = feature.properties || {};
  const settlement = getZoneSettlement(properties);
  const zoneCode = getZoneCode(properties);
  const details = [settlement, zoneCode].filter(Boolean).join(" · ");

  return details || properties.type_zone || "Территориальная зона";
};

const ensureZonePattern = (svg) => {
  if (!svg || svg.querySelector("#zone-grid-pattern")) return;

  const svgNs = "http://www.w3.org/2000/svg";
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(svgNs, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const pattern = document.createElementNS(svgNs, "pattern");
  pattern.setAttribute("id", "zone-grid-pattern");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("width", "10");
  pattern.setAttribute("height", "10");

  const bg = document.createElementNS(svgNs, "rect");
  bg.setAttribute("width", "10");
  bg.setAttribute("height", "10");
  bg.setAttribute("fill", "#fef3c7");
  bg.setAttribute("opacity", "0.45");

  const hatch = document.createElementNS(svgNs, "path");
  hatch.setAttribute("d", "M-2 2 L2 -2 M0 10 L10 0 M8 12 L12 8");
  hatch.setAttribute("stroke", "#eab308");
  hatch.setAttribute("stroke-width", "1.2");
  hatch.setAttribute("opacity", "0.95");

  pattern.appendChild(bg);
  pattern.appendChild(hatch);
  defs.appendChild(pattern);
};

const applyZonePatternToLayer = (layer, active = true) => {
  const paint = (targetLayer) => {
    const element = targetLayer.getElement?.();
    if (!element) return;
    element.setAttribute("stroke", active ? "#65a30d" : "#d1d5db");
    element.setAttribute("fill", active ? "url(#zone-grid-pattern)" : "#e5e7eb");
    element.setAttribute("fill-opacity", active ? "0.95" : "0.35");
  };

  if (layer?.eachLayer) {
    layer.eachLayer(paint);
    return;
  }

  paint(layer);
};

const queueZonePatternPaint = (layer, active = true) => {
  requestAnimationFrame(() => {
    applyZonePatternToLayer(layer, active);
    requestAnimationFrame(() => applyZonePatternToLayer(layer, active));
  });
};

export default function IndustrialParksMap() {
  const mapRef     = useRef(null);
  const mapObj     = useRef(null);
  const markersRef = useRef([]);
  const layersRef  = useRef({ boundary: null, munOblasts: null, landPlots: null, roads: null, railways: null });
  const selectedGeoLayerRef = useRef(null);

  const [selectedPark, setSelectedPark] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rightOpen,    setRightOpen]    = useState(false);
  const [leftOpen,     setLeftOpen]     = useState(true);
  const [hoveredPark,  setHoveredPark]  = useState(null);
  const [searchQ,      setSearchQ]      = useState("");
  const [searchRes,    setSearchRes]    = useState([]);
  const [parks,        setParks]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeLayers, setActiveLayers] = useState({
    parks: true, boundary: true, landPlots: true, roads: false, railways: false,
  });

  // ── Load Leaflet + geodata ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const [boundaryData, landPlotsData, roadsData, railData, parksData, munData] = await Promise.all([
          fetch(dataUrl("boundary.geojson")).then(r => r.json()),
          fetch(dataUrl("zem_uchastki.geojson")).then(r => r.json()),
          fetch(dataUrl("roads.geojson")).then(r => r.json()),
          fetch(dataUrl("rail.geojson")).then(r => r.json()),
          fetch(dataUrl("parks.geojson")).then(r => r.json()),
          fetch(dataUrl("mun_obraz.geojson")).then(r => r.json()),
        ]);

        if (cancelled) return;

        setParks(parksData.features);
        setLoading(false);

        if (!mapRef.current || mapObj.current) return;

        const map = L.map(mapRef.current, {
          center: [55.8, 49.4], zoom: 7,
          zoomControl: false, attributionControl: true,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: "© OpenStreetMap © CARTO", maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);
        mapObj.current = map;

        const resetSelectedGeoLayerStyle = () => {
          if (!selectedGeoLayerRef.current) return;
          const { layerType, layer } = selectedGeoLayerRef.current;
          if (layerType === "landPlots") {
            layer.setStyle({ color: "#dc2626", weight: 2, opacity: 0.95, fillColor: "#ef4444", fillOpacity: 0.12 });
          }
          selectedGeoLayerRef.current = null;
        };

        const selectGeoFeature = (layerType, featureLayer, feature) => {
          resetSelectedGeoLayerStyle();
          selectedGeoLayerRef.current = { layerType, layer: featureLayer };
          featureLayer.setStyle({
            weight: 3,
            opacity: 1,
            fillOpacity: 0.22,
          });
          if (featureLayer.bringToFront) featureLayer.bringToFront();

          setSelectedPark(null);
          setSelectedItem({
            kind: "layer-feature",
            layerId: layerType,
            properties: feature.properties || {},
            title: getLayerFeatureTitle(layerType, feature.properties),
            subtitle: getLayerFeatureSubtitle(layerType, feature.properties),
            documents: [],
          });
          setRightOpen(true);

          const bounds = featureLayer.getBounds?.();
          if (bounds?.isValid?.()) {
            map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
          }
        };

        // Граница РТ
        layersRef.current.boundary = L.geoJSON(boundaryData, {
          style: { color: "#f97316", weight: 2.5, opacity: 0.85, fillColor: "#fff7ed", fillOpacity: 0.10 },
          interactive: false,
        }).addTo(map);

        // Муниципальные образования
        layersRef.current.munOblasts = L.geoJSON(munData, {
          coordsToLatLng: projectCoordsToLatLng,
          style: { color: "#94a3b8", weight: 1, opacity: 0.55, fill: false },
          interactive: false,
        }).addTo(map);

        // Земельные участки
        layersRef.current.landPlots = L.geoJSON(landPlotsData, {
          coordsToLatLng: projectCoordsToLatLng,
          style: { color: "#dc2626", weight: 2, opacity: 0.95, fillColor: "#ef4444", fillOpacity: 0.12 },
          onEachFeature: (feature, layer) => {
            layer.on("click", () => selectGeoFeature("landPlots", layer, feature));
            layer.bindTooltip(getLayerFeatureTitle("landPlots", feature.properties), {
              sticky: true, direction: "top", className: "ip-tooltip",
            });
          },
        }).addTo(map);

        // Дороги
        layersRef.current.roads = L.geoJSON(roadsData, {
          style: { color: "#b45309", weight: 2, opacity: 0.7 },
          interactive: false,
        });

        // Ж/д
        layersRef.current.railways = L.geoJSON(railData, {
          style: { color: "#1f2937", weight: 1.5, opacity: 0.55, dashArray: "6 3" },
          interactive: false,
        });

        // Маркеры парков
        parksData.features.forEach(f => {
          const [lng, lat] = f.geometry.coordinates;
          const p = f.properties;
          p.status = p.status || "Доступен";
          const col = STATUS_COLORS[p.status] || "#f97316";
          const icon = L.divIcon({
            className: "",
            html: `<div style="width:20px;height:20px;border-radius:50%;background:${col};border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer"></div>`,
            iconSize: [20, 20], iconAnchor: [10, 10],
          });
          const m = L.marker([lat, lng], { icon });
          m.on("click",     () => {
            resetSelectedGeoLayerStyle();
            setSelectedPark(p);
            setSelectedItem({
              kind: "park",
              layerId: "parks",
              properties: p,
              title: p.name,
              subtitle: p.district,
              documents: [],
            });
            setRightOpen(true);
          });
          m.on("mouseover", () => setHoveredPark(p));
          m.on("mouseout",  () => setHoveredPark(null));
          m.bindTooltip(`<b>${p.name}</b><br>${p.district} · ${p.status}`, {
            direction: "top", offset: [0, -12], className: "ip-tooltip",
          });
          m.addTo(map);
          markersRef.current.push(m);
        });
      } catch (error) {
        console.error("Failed to initialize map", error);
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      Object.values(layersRef.current).forEach(layer => layer?.remove());
      layersRef.current = { boundary: null, munOblasts: null, landPlots: null, roads: null, railways: null };
      mapObj.current?.remove();
      mapObj.current = null;
    };
  }, []);

  // ── Toggle layers ───────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapObj.current;
    const lrs = layersRef.current;
    if (!map) return;
    const toggle = (layer, active) => {
      if (!layer) return;
      if (active  && !map.hasLayer(layer)) layer.addTo(map);
      if (!active &&  map.hasLayer(layer)) map.removeLayer(layer);
    };
    toggle(lrs.boundary, activeLayers.boundary);
    toggle(lrs.landPlots, activeLayers.landPlots);
    toggle(lrs.roads,    activeLayers.roads);
    toggle(lrs.railways, activeLayers.railways);
    markersRef.current.forEach(m => {
      if ( activeLayers.parks && !map.hasLayer(m)) m.addTo(map);
      if (!activeLayers.parks &&  map.hasLayer(m)) map.removeLayer(m);
    });
  }, [activeLayers]);

  // ── Search ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQ.trim()) { setSearchRes([]); return; }
    const q = searchQ.toLowerCase();
    setSearchRes(parks.filter(f =>
      f.properties.name.toLowerCase().includes(q) ||
      f.properties.district.toLowerCase().includes(q)
    ));
  }, [searchQ, parks]);

  const flyTo = (f) => {
    const [lng, lat] = f.geometry.coordinates;
    mapObj.current?.flyTo([lat, lng], 11, { duration: 1.2 });
    setSelectedPark(f.properties);
    setSelectedItem({
      kind: "park",
      layerId: "parks",
      properties: f.properties,
      title: f.properties.name,
      subtitle: f.properties.district,
      documents: [],
    });
    setRightOpen(true);
    setSearchQ("");
    setSearchRes([]);
  };

  const selectedBadge = selectedItem ? getLayerBadge(selectedItem.layerId) : null;
  const selectedRows = getFeatureRows(selectedItem);
  const selectedParkMedia = selectedItem?.kind === "park" ? getParkMedia(selectedItem.properties) : null;

  const stats = {
    total:  parks.length,
    active: parks.filter(f => f.properties.status === "Активный").length,
    dev:    parks.filter(f => f.properties.status === "Развитие").length,
    avail:  parks.filter(f => f.properties.status === "Доступен").length,
  };

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", fontFamily: "'IBM Plex Sans',system-ui,sans-serif", overflow: "hidden", background: "#f1f5f9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .ip-tooltip { background: #1f2937 !important; color: #fff !important; border: none !important; border-radius: 6px !important; font-size: 12px !important; padding: 6px 10px !important; }
        .ip-tooltip::before { border-top-color: #1f2937 !important; }
        .park-row:hover { background: #fff7ed !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ height: 56, background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0, zIndex: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>IP</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.1 }}>ГИС Платформа</div>
            <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: "0.05em" }}>РЕСПУБЛИКА ТАТАРСТАН</div>
          </div>
        </div>

        <button onClick={() => setLeftOpen(v => !v)} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #e5e7eb", background: leftOpen ? "#fff7ed" : "#f9fafb", cursor: "pointer", fontSize: 16, color: "#f97316", flexShrink: 0 }}>☰</button>

        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="🔍 Поиск парка или города..."
            style={{ width: "100%", height: 34, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 12px", fontSize: 13, outline: "none", background: "#f9fafb" }}
          />
          {searchRes.length > 0 && (
            <div style={{ position: "absolute", top: 38, left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.1)", zIndex: 2000, overflow: "hidden" }}>
              {searchRes.map(f => (
                <div key={f.properties.id} onMouseDown={() => flyTo(f)}
                  style={{ padding: "9px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLORS[f.properties.status] || "#f97316", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{f.properties.name}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{f.properties.district}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {[
            { label: "Активных", val: stats.active, col: "#16a34a", bg: "#f0fdf4" },
            { label: "Развитие",  val: stats.dev,    col: "#d97706", bg: "#fffbeb" },
            { label: "Доступно",  val: stats.avail,  col: "#0ea5e9", bg: "#f0f9ff" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, background: s.bg, border: `1px solid ${s.col}30`, borderRadius: 20, padding: "3px 10px" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.col }} />
              <span style={{ fontSize: 11, color: s.col, fontWeight: 600 }}>{s.val}</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside style={{ width: leftOpen ? 264 : 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden", transition: "width .25s ease", flexShrink: 0 }}>
          <div style={{ width: 264, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Слои карты</div>
              {LAYERS_CONFIG.map(lyr => {
                const on = activeLayers[lyr.id];
                return (
                  <label key={lyr.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: on ? "#fff7ed" : "transparent" }}>
                    <div onClick={() => setActiveLayers(p => ({ ...p, [lyr.id]: !p[lyr.id] }))}
                      style={{ position: "relative", width: 36, height: 20, borderRadius: 10, background: on ? "#f97316" : "#d1d5db", transition: "background .2s", flexShrink: 0, cursor: "pointer" }}>
                      <div style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                    </div>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: on ? 500 : 400 }}>{lyr.label}</span>
                    <div style={{ marginLeft: "auto", width: 10, height: 10, borderRadius: "50%", background: on ? lyr.color : "#e5e7eb" }} />
                  </label>
                );
              })}
            </div>

            <div style={{ padding: "12px 16px 8px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase" }}>Объекты ({stats.total})</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
              {loading ? (
                <div style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Загрузка...</div>
              ) : parks.map(f => {
                const p = f.properties;
                const col = STATUS_COLORS[p.status] || "#f97316";
                const isSelected = selectedPark?.id === p.id;
                return (
                  <div key={p.id} className="park-row" onClick={() => flyTo(f)}
                    style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 4, cursor: "pointer", background: isSelected ? "#fff7ed" : "transparent", border: `1px solid ${isSelected ? "#fed7aa" : "transparent"}`, transition: "all .15s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: col, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,.2)", marginTop: 3, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{p.district}</div>
                        <div style={{ marginTop: 4, display: "inline-block", fontSize: 10, padding: "1px 7px", borderRadius: 10, background: col + "20", color: col, fontWeight: 600 }}>{p.status}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: 12, borderTop: "1px solid #f3f4f6", textAlign: "center", fontSize: 10, color: "#d1d5db", letterSpacing: "0.05em" }}>
              INDUSTRIAL PARKS GIS · РТ 2025
            </div>
          </div>
        </aside>

        {/* ── MAP ── */}
        <div style={{ flex: 1, position: "relative" }}>
          <div ref={mapRef} style={{ position: "absolute", inset: 0 }} />

          {hoveredPark && (
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: "#1f2937", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 12, zIndex: 800, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,.25)", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 600 }}>{hoveredPark.name}</span>
              <span style={{ color: "#9ca3af", margin: "0 6px" }}>·</span>
              <span style={{ color: "#d1d5db" }}>{hoveredPark.district}</span>
              <span style={{ marginLeft: 10, padding: "2px 7px", borderRadius: 4, background: (STATUS_COLORS[hoveredPark.status] || "#f97316") + "40", fontSize: 11 }}>{hoveredPark.status}</span>
            </div>
          )}

          <div style={{ position: "absolute", bottom: 44, left: 12, zIndex: 800, background: "rgba(255,255,255,.95)", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Легенда</div>
            {[
              { type: "circle", color: "#f97316", label: "Активный парк" },
              { type: "circle", color: "#fb923c", label: "В развитии" },
              { type: "circle", color: "#fdba74", label: "Доступен" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: l.color, border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#374151" }}>{l.label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "#f3f4f6", margin: "7px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 20, height: 3, background: "#f97316", borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#374151" }}>Граница РТ</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 20, height: 10, border: `2px solid ${activeLayers.landPlots ? "#dc2626" : "#d1d5db"}`, background: activeLayers.landPlots ? "rgba(239,68,68,0.12)" : "transparent", borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: activeLayers.landPlots ? "#374151" : "#9ca3af" }}>Земельные участки</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 20, height: 3, background: activeLayers.roads ? "#b45309" : "#d1d5db", borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: activeLayers.roads ? "#374151" : "#9ca3af" }}>Федеральные трассы</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 20, height: 2, flexShrink: 0, background: `repeating-linear-gradient(90deg,${activeLayers.railways ? "#1f2937" : "#d1d5db"} 0,${activeLayers.railways ? "#1f2937" : "#d1d5db"} 5px,transparent 5px,transparent 8px)` }} />
              <span style={{ fontSize: 11, color: activeLayers.railways ? "#374151" : "#9ca3af" }}>Железные дороги</span>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 800, background: "rgba(255,255,255,.9)", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#6b7280", fontFamily: "'IBM Plex Mono',monospace" }}>
            55.800°N · 49.400°E · Республика Татарстан
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <aside style={{ width: rightOpen ? 300 : 0, background: "#fff", borderLeft: "1px solid #e5e7eb", overflow: "hidden", transition: "width .25s ease", flexShrink: 0 }}>
          {selectedItem && (
            <div style={{ width: 300, height: "100%", overflowY: "auto" }}>
              {selectedItem.kind === "park" && (
                <div style={{ padding: 16, paddingBottom: 0 }}>
                  <div style={{ overflow: "hidden", borderRadius: 14, border: "1px solid #e5e7eb", background: "#f8fafc" }}>
                    <img
                      src={selectedParkMedia?.image || DEFAULT_PARK_IMAGE}
                      alt={selectedItem.title}
                      style={{
                        width: "100%",
                        height: 168,
                        objectFit: selectedParkMedia?.image ? "cover" : "contain",
                        objectPosition: "center",
                        display: "block",
                        background: "#e5e7eb",
                      }}
                    />
                  </div>
                  {selectedParkMedia?.source && (
                    <a
                      href={selectedParkMedia.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: 8, fontSize: 11, color: "#ea580c", textDecoration: "none", fontWeight: 600 }}
                    >
                      {selectedParkMedia.sourceLabel || "Источник фото"}
                    </a>
                  )}
                </div>
              )}

              <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1, paddingRight: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>{selectedItem.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{selectedItem.subtitle || "Выбранный объект"}</div>
                </div>
                <button onClick={() => setRightOpen(false)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 14, color: "#6b7280" }}>✕</button>
              </div>

              <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6" }}>
                {selectedBadge && (
                  <span style={{ padding: "4px 12px", borderRadius: 20, background: selectedBadge.bg, color: selectedBadge.color, fontSize: 12, fontWeight: 600 }}>
                    {selectedItem.kind === "park" ? (selectedItem.properties.status || selectedBadge.label) : selectedBadge.label}
                  </span>
                )}
              </div>

              <div style={{ padding: "12px 16px" }}>
                {selectedRows.map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{selectedItem.kind === "layer-feature" ? formatFieldLabel(row.label) : row.label}</span>
                    {row.label === "Веб-сайт" && isHttpUrl(row.val) ? (
                      <a
                        href={row.val}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 12, fontWeight: 600, color: "#ea580c", textAlign: "right", maxWidth: 160, textDecoration: "none", wordBreak: "break-word" }}
                      >
                        {row.val}
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#111827", textAlign: "right", maxWidth: 160, wordBreak: "break-word" }}>{row.val ?? "—"}</span>
                    )}
                  </div>
                ))}
              </div>

              {selectedItem.kind === "layer-feature" && (
                <div style={{ margin: "0 16px 16px", padding: 12, background: "#f9fafb", borderRadius: 8, fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                    Семантика
                  </div>
                  <div>По выбранному контуру отображаются атрибуты объекта из GeoJSON. В этой версии страницы для интерактивного просмотра доступны индустриальные парки и земельные участки.</div>
                </div>
              )}

              {selectedItem.kind === "park" && selectedItem.properties.description && (
                <div style={{ margin: "0 16px 16px", padding: 12, background: "#f9fafb", borderRadius: 8, fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>
                  {selectedItem.properties.description}
                </div>
              )}

              <div style={{ margin: "0 16px 16px", padding: 12, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Связанные данные и документы
                </div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
                  {selectedItem.kind === "park"
                    ? "Для индустриального парка отображаются данные карточки объекта. Сюда можно подключить документы по идентификатору парка."
                    : "Для выбранного контура уже отображаются атрибуты из GeoJSON. В этот блок можно добавить связанные документы, кадастровые выписки и иные данные по ключам descr / name_by_doc."}
                </div>
              </div>

              <div style={{ padding: "0 16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                <button style={{ height: 36, borderRadius: 8, background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Подробная информация
                </button>
                <button style={{ height: 36, borderRadius: 8, background: "#f9fafb", color: "#374151", border: "1px solid #e5e7eb", fontSize: 13, cursor: "pointer" }}>
                  Экспорт данных
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

    </div>
  );
}
