import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  X, 
  Globe, 
  Database, 
  User, 
  Phone, 
  Mail,
  Map as MapIcon,
  Rainbow,
  Ghost
} from 'lucide-react';

/**
 * КОМПОНЕНТ: ExperienceMapModal
 * Интерактивная карта на базе Leaflet.js
 */
const ExperienceMapModal = ({ onClose, language, t }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  const experienceData = [
    {
      id: 'kazan',
      name: 'Казань',
      region: 'Республика Татарстан',
      photo: '/kazan.jpg',
      workPlace: 'Текущая локация',
      position: 'Эксперт по землеустройству',
      activity: 'Проживание и готовность к новым вызовам. Специализация: правовой анализ участков, ГИС-аналитика.',
      year: '2026',
      coords: [55.7887, 49.1221]
    },
    {
      id: 'nizhnekamsk',
      name: 'Нижнекамск',
      region: 'Республика Татарстан',
      photo: '/nizhnekamsk.jpg',
      workPlace: 'СИБУР, Группа компаний',
      position: 'Эксперт',
      activity: 'Сопровождение строительства этиленопровода (265 км). Анализ 1000+ участков, работа в QGIS и ФГИС ЛК.',
      year: '2023 — 2025',
      coords: [55.6333, 51.8167]
    },
    {
      id: 'tobolsk',
      name: 'Тобольск',
      region: 'Тюменская область',
      photo: '/tobolsk.jpg',
      workPlace: 'СИБУР (ЗапСибНефтехим)',
      position: 'Главный специалист',
      activity: 'Создание единой GIS-базы в QGIS. Анализ инвест-проектов на территории РФ.',
      year: '2021 — 2022',
      coords: [58.1975, 68.2544]
    },
    {
      id: 'nefteyugansk',
      name: 'Нефтеюганск / Пыть-Ях',
      region: 'ХМАО-Югра',
      photo: '/nefteyugansk.jpeg',
      workPlace: 'РН-Юганскнефтегаз, ООО',
      position: 'Ведущий специалист',
      activity: 'Оформление земель под объекты нефтедобычи. Работа в MapInfo и Технокад.',
      year: '2018 — 2022',
      coords: [61.0997, 72.6031]
    },
    {
      id: 'surgut',
      name: 'Сургут',
      region: 'ХМАО-Югра',
      photo: '/surgut.jpg',
      workPlace: 'ПАО Сургутнефтегаз',
      position: 'Маркшейдер 1 категории',
      activity: 'Кадастровое сопровождение капстроительства. Учет добычи ОПИ по 12 карьерам.',
      year: '2012 — 2018',
      coords: [61.25, 73.4167]
    },
    {
      id: 'vyborg',
      name: 'Выборг',
      region: 'Ленинградская область',
      photo: '/vyborg.jpg',
      workPlace: 'ПО «Возрождение»',
      position: 'Геодезист',
      activity: 'Геодезическое сопровождение добычи минерального сырья на карьерах.',
      year: '2018',
      coords: [60.7092, 28.7442]
    },
    {
      id: 'magadan',
      name: 'Магадан',
      region: 'Магаданская область',
      photo: '/magadan.jpg',
      workPlace: 'Мэрия города Магадана',
      position: 'Главный специалист',
      activity: 'Градостроительный отдел. Отвод земельных участков под строительство.',
      year: '2012',
      coords: [59.5667, 150.8]
    }
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateMobileState = (event) => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updateMobileState);
    else mediaQuery.addListener(updateMobileState);
    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updateMobileState);
      else mediaQuery.removeListener(updateMobileState);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      return;
    }
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletReady(true);
      document.head.appendChild(script);
    } else {
      setLeafletReady(true);
    }
    setSelectedPoint(experienceData[0]);
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    if (!leafletReady || !mapRef.current || mapInstance.current) return;
    const L = window.L;
    mapInstance.current = L.map(mapRef.current, { center: [62, 95], zoom: 3, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    experienceData.forEach(point => {
      const marker = L.circleMarker(point.coords, { 
        radius: 8, fillColor: "#10b981", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 
      }).addTo(mapInstance.current);
      marker.on('click', () => setSelectedPoint(point));
      markersRef.current[point.id] = marker;
    });
  }, [leafletReady, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    if (!mapInstance.current || !selectedPoint || !window.L) return;
    mapInstance.current.flyTo(selectedPoint.coords, 6, { duration: 1.5 });
    Object.keys(markersRef.current).forEach(key => {
      const m = markersRef.current[key];
      if (key === selectedPoint.id) m.setStyle({ fillColor: "#22d3ee", radius: 10 });
      else m.setStyle({ fillColor: "#10b981", radius: 8 });
    });
  }, [selectedPoint, isMobile]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden">
      <div className="bg-slate-900 border-b border-green-500/20 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter uppercase underline decoration-green-500 underline-offset-4">ГИС.ГЕОГРАФИЯ</span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.3em]">{language === 'ru' ? 'Карта опыта' : 'Experience Map'}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700">
          <X size={24} />
        </button>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {isMobile ? (
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-950">
            {experienceData.map((point) => (
              <article key={point.id} className="rounded-2xl border border-green-500/15 bg-slate-900/80 p-4">
                <div className="mb-3 h-36 overflow-hidden rounded-xl">
                  <img src={point.photo} alt={point.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight">{point.name}</h3>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-1">{point.region}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-black text-amber-300">
                    {point.year}
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {language === 'ru' ? 'Место работы' : 'Workplace'}
                    </p>
                    <p className="mt-1 text-sm font-bold text-white leading-tight">{point.workPlace}</p>
                    <p className="mt-1 text-[10px] font-bold text-green-400 uppercase tracking-wider">{point.position}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {language === 'ru' ? 'Деятельность' : 'Activity'}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{point.activity}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <>
        <div className="w-full lg:w-[450px] bg-slate-900 border-r border-green-500/10 overflow-y-auto flex flex-col shrink-0">
          <div className="p-6 bg-slate-950/50 border-b border-white/5">
             <h4 className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest mb-3">
               <User size={14} /> {language === 'ru' ? 'Обо мне' : 'About me'}
             </h4>
             <p className="text-xs text-slate-400 leading-relaxed">
               {t.hero.description}
             </p>
          </div>

          {selectedPoint && (
            <motion.div key={selectedPoint.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
              <div className="relative h-56 shrink-0 overflow-hidden">
                <img src={selectedPoint.photo} alt={selectedPoint.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-black text-white tracking-tight">{selectedPoint.name}</h3>
                  <div className="flex items-center gap-2 text-cyan-400 text-[10px] mt-1 font-bold uppercase tracking-wider">
                    <MapPin size={12} /> {selectedPoint.region}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-grow">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-2.5 bg-green-500/10 text-green-400 rounded-xl h-fit border border-green-500/20 shadow-lg">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{language === 'ru' ? 'Место работы' : 'Workplace'}</h4>
                      <p className="text-white font-bold text-sm leading-tight">{selectedPoint.workPlace}</p>
                      <p className="text-cyan-400 text-[10px] font-bold mt-1 uppercase">{selectedPoint.position}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl h-fit border border-cyan-500/20 shadow-lg">
                      <MapIcon size={18} />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{language === 'ru' ? 'Деятельность' : 'Activity'}</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">{selectedPoint.activity}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl h-fit border border-amber-500/20 shadow-lg">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{language === 'ru' ? 'Период' : 'Period'}</h4>
                      <p className="text-white font-bold text-sm tracking-wider">{selectedPoint.year}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex-grow bg-slate-950 relative">
          <div ref={mapRef} className="w-full h-full z-0" />
          <div className="absolute top-6 right-6 z-10 pointer-events-none hidden md:block">
            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-green-500/20 shadow-2xl w-48">
              <div className="flex items-center gap-2 mb-3 text-white">
                <Database size={14} className="text-green-400" />
                <span className="text-[9px] font-black uppercase tracking-widest">{language === 'ru' ? 'Слои ГИС' : 'GIS Layers'}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{language === 'ru' ? 'Активный объект' : 'Active object'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{language === 'ru' ? 'Архив опыта' : 'Experience archive'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const SECTION_IDS = ['home', 'about', 'projects', 'services', 'skills', 'contact'];
const INDUSTRIAL_PARKS_PAGE = './industrial-parks.html';
const SKILL_LEVELS = [95, 90, 92, 88];
const PROJECTS_DATA = {
  ru: [
    {
      title: 'Контроль объекта от замысла до ЕГРН',
      desc: 'Как сопровождение стройки от выбора площадки до ввода в эксплуатацию и регистрации права помогает убрать риски еще до появления объекта на кадастровом учете.',
      tags: ['ГрК РФ', 'Техплан', 'Ввод в эксплуатацию'],
      fullDescription: `Мы все понимаем, каким должен быть итог работ по строительству объекта: регистрация права в соответствии с Федеральным законом № 218-ФЗ, при этом получение разрешения на ввод согласно ст. 55 ГрК РФ является ключевым промежуточным этапом. Но чтобы всё оформить правильно и в срок, нужно активно проверять и контролировать весь процесс. Может возникнуть вопрос: а точно ли это задача кадастрового инженера или эксперта по имуществу? Мой опыт подтверждает, что да. Важно вести контроль за «рождением» объекта с самой первой мысли.

Мы упустим идею в голове инвестора, но на этапе выбора места строительства приходится подключаться. Часто коллеги-проектировщики смотрят на оформление земли как на что-то второстепенное. Однако сейчас всё чаще возникают риски, которые можно исключить простой проверкой территории через сервисы НСПД или ФГИС ТП, градостроительной проработкой и определением параметров участка согласно ЗК РФ. На этом этапе мы определяем необходимость изменения категории земель или внесения изменений в правила землепользования и застройки (ПЗЗ) в соответствии со ст. 33 ГрК РФ.

Следующий этап — работа с проектировщиками и определение технико-экономических показателей (ТЭПов). Тут главное — определить вид объекта и прописать характеристики: длину для линейных сооружений, площадь застройки и общую площадь зданий со всеми уровнями. Нужно руководствоваться требованиями к подготовке технического плана, установленными Приказом Росреестра от 15.03.2022 № П/0082. Также необходимо грамотно отсеять вспомогательные сооружения, опираясь на критерии Постановления Правительства РФ № 703, чтобы они не перегружали разрешение на строительство.

Это критически важно, так как строители часто хотят включать в документы либо всё сразу, либо ничего. На этапе ввода у заказчика появляется желание оптимизировать налоговую базу, и начинаются изменения разрешения на строительство. Согласно ст. 51 ГрК РФ, технический план должен строго соответствовать проектной документации и разрешению на строительство, иначе получение акта ввода станет невозможным.

На этапе стройки нужно следить, чтобы объект возводился строго в границах, отраженных в ГПЗУ или документации по планировке территории (ДПТ), требования к которым закреплены в главе 5 ГрК РФ. В ходе СМР получение исполнительной съёмки дает контроль характеристик и сокращает время подготовки техплана. В идеале к моменту получения заключения о соответствии (ЗОС) технический план уже готов, так как именно он, согласно ч. 10.1 ст. 55 ГрК РФ, является обязательным приложением для получения разрешения на ввод.

После получения разрешения на ввод в электронном виде осуществляется присвоение адреса в соответствии с Постановлением Правительства РФ № 1221. Финальным шагом становится подача документов на регистрацию собственности. Объект уже прошел кадастровый учет в рамках межведомственного взаимодействия, номер присвоен, и мы получаем выписку из ЕГРН как подтверждение успешного завершения всего цикла работ.`,
      client: 'Сопровождение капитального строительства',
      year: '2026',
      image: '/stroika 3.1.png'
    },
    {
      title: 'Ограничения и риски: как не потерять контроль над земельным участком',
      desc: 'Как НСПД, ГПЗУ, ППТ и GIS-анализ помогают заранее увидеть ЗОУИТ, публичные сервитуты, резервирование и риск изъятия участка.',
      tags: ['НСПД', 'ЗОУИТ', 'Градостроительный анализ'],
      fullDescription: `Продолжая тему обременений, важно отметить: и застройщик, и частный собственник могут получить значительный объем информации о зонах с особыми условиями использования территорий (ЗОУИТ) на портале НСПД. Достаточно ввести кадастровый номер участка или объекта капитального строительства, чтобы увидеть зоны, сведения о которых уже внесены в ЕГРН в соответствии со ст. 105 ЗК РФ.

1. «Невидимые» угрозы: резервирование и изъятие
Помимо существующих зон, существуют и «скрытые» ограничения. Речь идет о землях, планируемых под размещение федеральных или региональных объектов: мостов, железных дорог, газопроводов.

Согласно ст. 56.1 ЗК РФ, права собственников могут быть ограничены в связи с резервированием земель для государственных или муниципальных нужд. Если уже утвержден проект планировки территории по ст. 45 ГрК РФ, появляется риск последующего изъятия участка. В таком случае закон допускает принудительное отчуждение имущества, но строго с возмещением рыночной стоимости и убытков по ст. 49 ЗК РФ и ст. 279 ГК РФ.

2. Публичный сервитут: временные неудобства vs выгода
Снизить риски можно только через регулярный мониторинг и привлечение профильного специалиста. При этом важно различать степень влияния ограничений на ваши планы.

Если на участок сельхозназначения накладывается публичный сервитут для строительства линейного объекта, например ЛЭП или линии связи, по ст. 39.45 ЗК РФ такой сервитут может устанавливаться на срок от 10 до 49 лет. При этом фактическое занятие участка для строительно-монтажных работ не может превышать 1 год в силу ст. 39.50 ЗК РФ. Собственник имеет право на плату за сервитут и на возмещение убытков, если в период строительства участок нельзя использовать в обычном режиме.

3. Изъятие под дороги: когда компромисс невозможен
Совсем иная ситуация возникает при строительстве или расширении автодорог. Здесь участок может быть изъят полностью или частично, а собственнику выплачивается выкупная цена, которая включает рыночную стоимость земли, объектов недвижимости и убытки, связанные с досрочным прекращением обязательств перед третьими лицами по ст. 56.8 ЗК РФ. Для ИЖС и СНТ это нередко означает фактическую потерю объекта недвижимости.

Как защитить свои интересы?
ГПЗУ остается главным юридическим «щитом». НСПД отлично подходит для визуальной первичной проверки, но именно градостроительный план земельного участка по ст. 57.3 ГрК РФ фиксирует ограничения, пятно застройки и минимальные отступы. Если спорная зона не отражена в ГПЗУ, шансы на защиту позиции в суде становятся значительно выше.

Есть и экономический аспект. Наличие серьезных ограничений, включая ЗОУИТ и сервитуты, снижает рыночную привлекательность участка. Это может служить основанием для оспаривания кадастровой стоимости и, как следствие, для снижения земельного налога.

Отдельно важно отслеживать проекты планировки территории и публичные обсуждения. Дороги и иные линейные объекты редко появляются внезапно: ППТ проходят стадию общественных обсуждений, а значит, у собственника есть шанс заранее подать возражения и повлиять на границы зоны до начала работ.

Почему здесь важна GIS-аналитика? Потому что ограничения часто накладываются друг на друга. Край участка может попадать в водоохранную зону, а центральная часть - в зону охраны объектов культурного наследия. Профессиональный GIS-анализ позволяет совместить слои разных ведомств, выявить конфликт зон и увидеть ограничения, которые еще не дошли до публичных реестров, но уже закреплены в ведомственных актах.

Вывод простой: универсальный способ избежать «сюрпризов» - регулярный мониторинг, проверка ГПЗУ и работа с актуальными пространственными данными.`,
      client: 'Правовой и GIS-анализ земельных ограничений',
      year: '2026',
      image: '/zouit.png'
    },
    {
      title: 'Градостроительный анализ участка: когда графика важнее опубликованных слоев',
      desc: 'Как совмещаю НСПД, ФГИС ТП, сайты администраций и привязку PDF/GeoTIFF в QGIS для поиска ограничений и проектных рисков.',
      tags: ['QGIS', 'ПЗЗ', 'Градостроительный анализ'],
      fullDescription: `Сейчас всё чаще появляется запрос на градостроительный анализ участка - поиск ограничений и сведений, которые могут в будущем эти ограничения накладывать. Это может быть будущий публичный сервитут, изъятие участка для строительства дороги, газопровода, железной дороги или иного объекта недвижимости.

Чаще всего такой анализ начинается с открытых источников: НСПД, ФГИС ТП и сайтов администраций, где публикуются документы по публичным сервитутам, изъятиям, КРТ, генеральным планам и ПЗЗ. Проблема в том, что значительная часть материалов доступна только в отсканированном виде, а опубликованные слои на государственных ресурсах обновляются не всегда оперативно.

На практике территориальные зоны и зоны ПЗЗ в первую очередь отражаются в самих градостроительных документах - на картах градостроительного зонирования. Те же сведения должны отображаться в НСПД в слое «Территориальные зоны», но в большинстве случаев актуальность там бывает частичной. Если опираться только на опубликованные данные, это создаёт риск неверных выводов.

Поэтому в работе я дополнительно анализирую схемы и чертежи. Актуальные материалы загружаю в QGIS: это может быть PDF-карта из ФГИС ТП или с сайта администрации, либо GeoTIFF. Затем привязываю документ по границам муниципального образования или населённого пункта и сопоставляю его с кадастровыми и градостроительными слоями.

Дальше проверяю, насколько корректно в НСПД отражены зоны, и обязательно сверяю территорию с фактическим документом. При этом текстовая часть ПЗЗ нередко важнее графики: в карте могут быть опечатки, а в регламентах часто указаны нюансы, которые реально действуют на текущий момент. Если доступны проектные документы, их тоже подключаю к анализу, хотя искать такие материалы на сайтах администраций обычно непросто.

В итоге градостроительный анализ участка - это не только работа с государственными сервисами, но и внимательная проверка исходных документов в растровом виде. Когда есть уверенный опыт работы в ГИС, такие «картинки» превращаются в рабочий аналитический материал. При необходимости их можно оцифровать и получить актуальные границы зон для дальнейшей работы, но это уже отдельная ресурсоёмкая задача.`,
      client: 'Градостроительный и правовой анализ территорий',
      year: '2026',
      image: '/PZZ.png'
    },
    {
      title: 'Создание гипсометрической карты Татарстана',
      desc: 'Физико-административная карта Республики Татарстан с визуализацией рельефа и административной сеткой.',
      tags: ['QGIS', 'DEM', 'Картография'],
      details: {
        intro: 'Завершил работу над физико-административной картой Республики Татарстан. Основной задачей было совместить наглядную визуализацию рельефа с точной административной сеткой, сохранив при этом высокую читаемость карты.',
        workflow: 'Краткий разбор воркфлоу и источников данных, которые легли в основу проекта.',
        sections: [
          {
            title: '1. Сбор и подготовка данных',
            text: 'Качество карты напрямую зависит от исходников. В этом проекте я использовал гибридный подход к сбору данных:',
            bullets: [
              'Административное деление и населенные пункты: за основу взял данные Фонда пространственных данных РТ (портал fpd-tatar.nextgis.com). Это позволило получить наиболее актуальную и точную информацию по границам районов и локации городов, что выгодно отличает карту от версий на базе только глобальных данных.',
              'Природные объекты: границы лесных массивов, гидрографию (реки и водохранилища) выгружал и обрабатывал через OpenStreetMap (OSM). Данные прошли постобработку и генерализацию контуров для корректного отображения в выбранном масштабе.'
            ]
          },
          {
            title: '2. Работа с рельефом (DEM и визуализация)',
            text: 'Для создания объема использовал классическую связку в QGIS:',
            bullets: [
              'Гипсометрия: наложил цветовую шкалу (Color Ramp) от темно-зеленого для низин к коричневому для возвышенностей.',
              'Отмывка (Hillshade): сгенерировал теневой рельеф на основе DEM. Использовал режим смешивания Multiply, чтобы сохранить насыщенность цветов и подчеркнуть пластику ландшафта.'
            ]
          },
          {
            title: '3. Картографический дизайн',
            bullets: [
              'Дорожная сеть: иерархия дорог настроена через Symbol Levels (уровни знака), чтобы избежать визуальных разрывов на перекрестках.',
              'Условные знаки: разработал кастомную легенду для классификации населенных пунктов по численности.',
              'Оформление: применил буферизацию (Halo) для текстовых меток для повышения контраста.'
            ]
          }
        ],
        postscript: 'P.S. Есть еще куда стремиться ↗️'
      },
      client: 'Личный проект',
      year: '2024',
      image: '/project-map-rt.png'
    },
    {
      title: 'GIS — это не про карты. GIS — это про контроль и командные решения',
      desc: 'Кейс о том, как GIS и Excel помогли команде обработать 450 соглашений по публичному сервитуту за 3 месяца и снизить проектные риски.',
      tags: ['QGIS', 'Excel', 'Управление рисками'],
      fullDescription: `Когда я только начинал работать с GIS, думал: «Ну всё просто — внес данные, нарисовал карту — и готово».
Но очень быстро понял: карты сами по себе ничего не решают.

В одном из проектов наша команда работала над 450 соглашениями об установлении публичного сервитута за… три месяца. Да, вы не ослышались — три месяца на такой масштабный федеральный объект.
Сначала казалось: «Это нереально».
Но мы использовали GIS и Excel так, что проект реально начал «оживать»:
в Excel мы отслеживали статус каждого участка, фиксировали прогресс, планировали, где можно начинать строительство;
QGIS показывал, где уже оформлены участки, а где риски могут нас подстерегать;
коллеги видели актуальные данные сразу на карте и могли принимать решения на месте — без лишней бюрократии.

💡 Помню один случай: пересекающий участок, о котором никто даже не подумал, мог остановить всю стройку. GIS подсветил это вовремя. Мы скорректировали план — и работа продолжилась. В тот момент я понял: GIS — это не просто карты, это суперсила для инженера и менеджера одновременно.

💯Результат?
- сроки проекта сократились вдвое;
- меньше конфликтов с командой и заказчиком;
- быстро реагировали на изменения и подсвечивали риски ещё до того, как они становились проблемой.

Сейчас мне интересно:
✔️проектировать GIS-системы, которые реально решают задачи людей;
✔️управлять этапами и сроками, чтобы команда работала слаженно;
✔️превращать запросы заказчика в понятную архитектуру данных;
✔️автоматизировать процессы и использовать AI, чтобы GIS помогал не только с картами, но и с документами и прогнозами рисков.

Моя цель проста: GIS должен отвечать на главный вопрос любого проекта — где нас ждут риски и как их вовремя увидеть.

GIS — это не про карты. GIS — это про понимание, контроль и возможность принимать решения быстрее, чем проблемы успевают появиться. И вот за это я люблю свою работу.`,
      client: 'Федеральный инфраструктурный проект',
      year: '2025',
      image: '/parki_rt.png'
    },
    {
      title: 'Использование API',
      desc: 'Интеграция 2GIS API и Python для получения точек объектов и последующего пространственного анализа в QGIS.',
      tags: ['QGIS', 'Python', '2GIS API'],
      fullDescription: `В какой-то момент понял, что мне нужно научиться привязывать в QGIS точки различных объектов, которые затем можно накладывать на карту, анализировать и сопоставлять с земельными участками и другими пространственными данными.

В качестве эксперимента решил использовать API 2GIS. Задача была прикладная: получить точки объектов в заданном районе - например, в радиусе 30 км от заданной точки.

Вся логика запросов была написана на Python. Для ускорения работы и проверки решений использовал различные AI Cloud инструменты - как помощников при формировании запросов и обработке данных.

В результате получил набор точек с координатами, которые сразу корректно легли в QGIS и стали частью общей рабочей карты.

Дальше стало возможным проводить пространственный анализ: смотреть, как объекты соотносятся с земельными участками, где есть застройка, а где ее нет, какие зоны требуют дополнительного внимания.

Ключевая ценность подхода - в объединении данных из разных источников в одном проекте и возможности анализировать их совместно, а не по отдельности.

Потенциал у такого решения большой: анализ данных, предварительная оценка при формировании охранных зон, применение в градостроительном мониторинге и других аналитических задачах.

Чем дальше погружаешься, тем яснее становится: GIS сегодня - это уже не только карты, а связка данных, кода и аналитики.`,
      client: 'Личный проект',
      year: '2025',
      image: '/API.png'
    },
    {
      slug: 'industrial-parks-tatarstan',
      title: 'Индустриальные парки Татарстана: интерактивная GIS-карта',
      desc: 'Веб-карта индустриальных парков с анализом ПЗЗ, слоями участков и поиском площадок в одном интерфейсе.',
      tags: ['React', 'Leaflet', 'ПЗЗ'],
      fullDescription: `Друзья, хочу поделиться свежим кейсом о том, как современные инструменты меняют привычную работу градостроителя. Сейчас я занимаюсь проектом карты индустриальных парков в Татарстане — эта территория мне ближе и понятнее. Чтобы не тратить время на рутину, я решил выжать максимум из связки QGIS, Python и нейросетей.

Основная сложность была с данными НСПД. Чтобы получить точные границы участков, нужно либо долго «копать» портал, либо писать запросы. Я протестировал разные модели — ChatGPT, Gemini, Claude, но в итоге сделал основной упор на DeepSeek.

Почему именно он? Всё просто:

- Доступность: стабильно работает в России без лишних «костылей» и ***.
- Качество кода: на удивление чётко справился с библиотеками PyQGIS. Там, где другие модели путались в синтаксисе старых версий, DeepSeek выдал чистый рабочий каркас.

В итоге нейросеть написала мне скрипт, который я лишь допилил под себя в консоли QGIS. Теперь границы участков подтягиваются почти автоматически по запросу расположения точки — система сама определяет кадастровый контур парка.

Транспортную инфраструктуру я вытащил из открытых данных через QuickOSM. Раньше на чистку и сортировку дорог уходил целый вечер, а сейчас короткий Python-скрипт, тоже родом из AI, разложил всё по слоям за пару минут.

Для меня AI здесь — не замена специалисту, а мощный ускоритель. Он берёт на себя рутинную писанину кода и поиск синтаксических ошибок, оставляя самое интересное: анализ территории и принятие проектных решений. Все данные я связал с проектом в QGIS — теперь любые правки в слоях, например добавление нового парка или ЗОУИТ, мгновенно отображаются на сайте без изменения кода.`,
      client: 'Личный GIS-проект',
      year: '2026',
      image: '/parki_rt.png'
    }
  ],
  en: [
    {
      title: 'Controlling a Capital Asset from Concept to EGRN Registration',
      desc: 'How early-stage control of land, design parameters, construction, and commissioning reduces registration risks long before the asset reaches the cadastral stage.',
      tags: ['Urban Planning Code', 'Technical Plan', 'Commissioning'],
      fullDescription: `We all understand what the final result of a construction project should be: registration of ownership under Federal Law No. 218-FZ. At the same time, obtaining the commissioning permit under Article 55 of the Urban Planning Code is the key intermediate milestone. To reach that outcome correctly and on time, the entire process must be checked and controlled proactively. A fair question may arise: is this really the responsibility of a cadastral engineer or property expert? My experience shows that it is. The asset has to be monitored from the earliest practical stage of its creation.

We may leave aside the investor's initial idea, but once the site selection stage begins, this expertise must already be involved. Designers often treat land formalization as secondary. In reality, many risks can be removed through a simple review of the territory via NSPD or FGIS TP services, urban planning analysis, and land parameter assessment under the Land Code. At this stage, we determine whether a land category change or amendments to land use and development rules are needed under Article 33 of the Urban Planning Code.

The next stage is coordination with designers and definition of technical and economic indicators. The main task here is to classify the object correctly and define its characteristics: length for linear structures, building footprint, and total floor area across all levels for buildings. This should be done in accordance with the technical plan preparation requirements established by Rosreestr Order No. P/0082 dated March 15, 2022. It is also essential to separate auxiliary facilities using the criteria of Government Resolution No. 703 so that they do not overload the construction permit package.

This point is critical because construction teams often want to include either everything or nothing in the documentation. At the commissioning stage, the client may also try to optimize the future tax base, which often leads to amendments in the construction permit. Under Article 51 of the Urban Planning Code, the technical plan must strictly correspond to both the design documentation and the permit itself; otherwise, obtaining the commissioning act becomes impossible.

During construction, the object must be monitored to ensure it is built strictly within the limits reflected in the GPZU or territory planning documentation, as regulated by Chapter 5 of the Urban Planning Code. As-built surveying during construction provides control over actual characteristics and shortens the technical plan preparation timeline. Ideally, by the time the compliance statement is issued, the technical plan is already complete, because under Part 10.1 of Article 55 of the Urban Planning Code it is a mandatory attachment for obtaining the commissioning permit.

After the commissioning permit is issued electronically, the asset is assigned an address under Government Resolution No. 1221. The final step is filing for ownership registration. By that stage, the cadastral registration has already been completed through interagency interaction, the cadastral number has been assigned, and the result is an EGRN extract confirming successful completion of the entire workflow.`,
      client: 'Capital construction support',
      year: '2026',
      image: '/stroika 3.1.png'
    },
    {
      title: 'Restrictions and Risks: How Not to Lose Control Over a Land Plot',
      desc: 'How NSPD, GPZU, planning documentation, and GIS analysis help identify special-use zones, public easements, reservation, and expropriation risks in advance.',
      tags: ['NSPD', 'Special-Use Zones', 'Urban Planning'],
      fullDescription: `Continuing the topic of encumbrances, it is important to note that both developers and private owners can obtain a substantial amount of information on special-use territorial zones through the NSPD portal. By entering the cadastral number of a land plot or capital construction object, it is possible to see zones already recorded in the EGRN under Article 105 of the Land Code of the Russian Federation.

1. Invisible threats: reservation and expropriation
In addition to existing zones, there are also hidden restrictions. These are lands planned for federal or regional infrastructure such as bridges, railways, and pipelines.

Under Article 56.1 of the Land Code, owners' rights may be limited due to land reservation for state or municipal needs. If a territory planning project has already been approved under Article 45 of the Urban Planning Code, the risk of future withdrawal of the land plot becomes real. In such cases, compulsory acquisition is allowed only with compensation for market value and related losses under Article 49 of the Land Code and Article 279 of the Civil Code.

2. Public easement: temporary inconvenience versus practical benefit
These risks can only be reduced through regular monitoring and specialist review. It is essential to distinguish how strongly a restriction affects the actual development or use scenario.

If an agricultural land plot is affected by a public easement for a linear infrastructure project such as a power line or communication line, Article 39.45 of the Land Code allows such an easement to be established for 10 to 49 years. At the same time, the actual occupation of the land for construction works cannot exceed one year under Article 39.50. The owner is entitled to easement payments and compensation for losses caused by the temporary inability to use the land normally during construction.

3. Road projects: when compromise is impossible
The situation is different when roads are expanded or newly built. In that case, the plot may be acquired fully or partially, and the owner is paid a redemption price that includes the market value of the land, buildings, and losses related to the early termination of obligations to third parties under Article 56.8 of the Land Code. For individual housing and garden plots, this often means losing the property itself.

How can owners protect their interests?
The GPZU remains the main legal shield. NSPD is an excellent visual tool for the initial review, but the urban planning plan of a land plot is the document with direct practical legal value for development decisions. Under Article 57.3 of the Urban Planning Code, it records restrictions, building envelopes, and setback requirements. If a disputed zone is absent from the GPZU, the chances of defending a position in court are much stronger.

There is also an economic dimension. Serious restrictions, including special-use zones and easements, reduce a plot's market attractiveness. This may become a valid basis for challenging cadastral value and, as a result, reducing land tax.

It is equally important to monitor territory planning projects and public hearings. Roads and other linear objects rarely appear overnight. Planning documentation usually goes through public discussion stages, which gives owners a chance to submit objections before the project physically reaches the site.

This is where GIS analytics becomes especially valuable. Restrictions often overlap: one edge of a plot may fall into a water protection zone while the center intersects a cultural heritage protection area. Professional GIS analysis makes it possible to overlay data from different authorities, detect conflicts between zones, and identify restrictions that may not yet appear in public registries but already exist in official departmental acts.

The main conclusion is simple: the best way to avoid unpleasant surprises is regular monitoring, GPZU verification, and work with up-to-date spatial data.`,
      client: 'Legal and GIS analysis of land constraints',
      year: '2026',
      image: '/zouit.png'
    },
    {
      title: 'Urban Planning Site Analysis Beyond Published Layers',
      desc: 'How I combine NSPD, FGIS TP, municipal sources, and georeferenced PDF or GeoTIFF materials in QGIS to detect constraints and future risks.',
      tags: ['QGIS', 'Zoning', 'Urban Planning'],
      fullDescription: `Requests for urban planning site analysis are becoming more frequent. The goal is to identify both existing constraints and signals that may lead to future restrictions, such as a planned public easement or land withdrawal for a road, gas pipeline, railway, or other capital project.

The workflow usually starts with public data sources: NSPD, FGIS TP, and municipal websites that publish materials on public easements, land withdrawal, integrated territory development, master plans, and zoning regulations. The issue is that a large share of these materials is available only as scanned documents, while official web layers are often updated slowly.

In practice, zoning boundaries are first reflected in the urban planning source documents themselves, especially on zoning maps. These boundaries are also expected to appear in NSPD under the territorial zones layer, but in many cases the published version is incomplete or outdated. Relying only on published layers can therefore introduce analytical risk.

That is why I also work directly with schemes and drawings. In QGIS I load PDF maps from FGIS TP or municipal portals, as well as GeoTIFF files when available. Then I georeference them by municipal or settlement boundaries and compare them with cadastral and planning layers.

The next step is to verify how accurately NSPD reflects the actual zoning and to check the territory against the source document itself. The text part of zoning regulations is often even more important than the map, because the graphics may contain typos while the written regulations describe the valid nuances in force. If draft planning documents are available, I include them too, although finding them on municipal websites often takes extra effort.

As a result, urban planning site analysis is not limited to government portals. It also depends on careful interpretation of raster source materials. With strong GIS skills, these image-based documents become a practical analytical layer. If needed, they can be digitized into up-to-date zone boundaries, though that is a separate task that requires significant time and effort.`,
      client: 'Urban planning and legal land analysis',
      year: '2026',
      image: '/PZZ.png'
    },
    {
      title: 'Hypsometric Map of Tatarstan',
      desc: 'A physical-administrative map of the Republic of Tatarstan with terrain visualization and administrative layers.',
      tags: ['QGIS', 'DEM', 'Cartography'],
      details: {
        intro: 'I completed a physical-administrative map of the Republic of Tatarstan. The core task was to combine a clear terrain visualization with an accurate administrative layer while preserving high readability.',
        workflow: 'A short overview of the workflow and source data used in the project.',
        sections: [
          {
            title: '1. Data Collection and Preparation',
            text: 'Map quality depends directly on source data. In this project, I used a hybrid approach:',
            bullets: [
              'Administrative boundaries and settlements: I used data from the spatial data foundation of Tatarstan (fpd-tatar.nextgis.com). This provided up-to-date and accurate district boundaries and city locations.',
              'Natural features: forest boundaries and hydrography (rivers, reservoirs) were extracted from OpenStreetMap (OSM), then post-processed and generalized for the target map scale.'
            ]
          },
          {
            title: '2. Relief Processing (DEM and Visualization)',
            text: 'To add depth, I used a classic QGIS setup:',
            bullets: [
              'Hypsometry: color ramp from dark green lowlands to brown highlands.',
              'Hillshade: generated from DEM and blended with Multiply mode to preserve color saturation and improve terrain plasticity.'
            ]
          },
          {
            title: '3. Cartographic Design',
            bullets: [
              'Road network: hierarchy configured via Symbol Levels to avoid visual gaps at intersections.',
              'Map symbols: custom legend designed to classify settlements by population.',
              'Labeling: halo buffering applied to increase text contrast and readability.'
            ]
          }
        ],
        postscript: 'P.S. There is still room to improve ↗️'
      },
      client: 'Personal project',
      year: '2024',
      image: '/project-map-rt.png'
    },
    {
      title: 'GIS Is Not About Maps. It Is About Control and Team Decisions',
      desc: 'A case on how GIS and Excel helped process 450 public easement agreements in 3 months and reduce project risks.',
      tags: ['QGIS', 'Excel', 'Risk Management'],
      fullDescription: `Early in my GIS career, I thought maps were the end goal. Very quickly, I realized maps alone do not solve problems.

On one project, our team had to process 450 public easement agreements in just three months for a large federal infrastructure initiative.

We used Excel to track each parcel status and execution progress, while QGIS visualized completed areas and risk zones in real time. The team could make decisions faster with a shared spatial view.

In one critical case, GIS revealed an intersecting parcel that could have blocked construction. We adjusted the plan in time and avoided a major delay.

Results:
- project timeline reduced nearly by half;
- fewer conflicts across team and stakeholders;
- faster response to changes with early risk visibility.

Today I focus on building GIS systems that solve real operational tasks, improve team coordination, and integrate automation and AI into day-to-day decision workflows.`,
      client: 'Federal infrastructure project',
      year: '2025',
      image: '/gis.jpeg'
    },
    {
      title: 'Using API in GIS Workflows',
      desc: 'Integration of 2GIS API and Python to obtain POI coordinates for further spatial analysis in QGIS.',
      tags: ['QGIS', 'Python', '2GIS API'],
      fullDescription: `At one stage I needed a repeatable way to import object points into QGIS and analyze them together with land parcels and other spatial layers.

As an experiment, I integrated the 2GIS API. The practical task was to fetch object points within a defined area, for example within a 30 km radius from a reference point.

All request logic was implemented in Python. I also used AI cloud tools to speed up query drafting and data processing checks.

The output was a clean coordinate dataset that was loaded into QGIS and became part of the project workspace.

This made it possible to run spatial analysis across multiple layers: object-to-parcel relations, built-up vs. empty zones, and areas requiring additional attention.

The key value is combining data from different sources into one analytical workflow instead of processing each source separately.`,
      client: 'Personal project',
      year: '2025',
      image: '/API.png'
    },
    {
      slug: 'industrial-parks-tatarstan',
      title: 'Industrial Parks of Tatarstan: interactive GIS map',
      desc: 'A web map of industrial parks with zoning analysis, land plot layers, and site screening in one interface.',
      tags: ['React', 'Leaflet', 'Zoning'],
      fullDescription: `An interactive GIS project that combines industrial parks of Tatarstan with municipal boundaries, land plots, zoning layers, roads, and rail infrastructure.

The map supports layer toggles, object cards, and polygon-based zoning analysis, turning the project into a practical site assessment workspace rather than a static showcase.`,
      client: 'Personal GIS project',
      year: '2026',
      image: '/gis.jpeg'
    }
  ]
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('ru'); 
  const [showExperienceMap, setShowExperienceMap] = useState(false);
  const { scrollY } = useScroll();
  const gridOpacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);
  
  const translations = {
    ru: {
      nav: ['Главная', 'О себе', 'Проекты', 'Услуги', 'Навыки', 'Контакты'],
      hero: {
        subtitle: 'Управление земельными активами | ГИС-аналитика | Кадастровый инженер',
        description: 'Ведущий эксперт по управлению земельными активами и GIS-аналитике. Объединяю компетенции кадастрового инженера и градостроительного аналитика. Активно применяю ИИ-технологии для глубокого анализа нормативно-правовой базы и автоматизации обработки геоданных, что позволяет сокращать сроки подготовки заключений и снижать риски.',
        contact: 'Связаться',
        resume: 'Скачать резюме',
        projects: 'Посмотреть проекты',
        mapCta: 'Карта опыта',
        petProject: 'Мой pet-проект'
      },
      about: {
        title: 'О себе',
        p1: 'Ведущий эксперт с уникальной комбинацией компетенций: кадастровый инженер, специалист по ГИС-анализу и градостроительному проектированию. Обладаю глубоким пониманием земельного законодательства и практическим опытом работы с геопространственными данными на всех этапах жизненного цикла земельных активов.',
        p2: 'Внедряю передовые ИИ-технологии для анализа нормативно-правовой базы и автоматизации обработки кадастровых данных. Это позволяет существенно сокращать сроки подготовки заключений, минимизировать юридические риски и принимать взвешенные решения по управлению земельными активами. Специализируюсь на комплексном анализе выписок ЕГРН, оценке градостроительного потенциала территорий и подготовке аналитических отчетов.',
        resumeBtn: 'Скачать полное резюме (PDF)',
        cards: [
          { title: 'ГИС-эксперт', desc: 'QGIS, пространственный анализ' },
          { title: 'Кадастровый инженер', desc: 'Межевание, ЕГРН, земельный кадастр' },
          { title: 'ИИ для НПА', desc: 'Автоматизация анализа законодательства' },
          { title: 'Градостроительство', desc: 'Зонирование, генпланы, ПЗЗ' }
        ]
      },
      services: {
        title: 'Услуги',
        items: [
          { title: 'ГИС Картографирование и анализ', desc: 'Индивидуальные картографические решения, пространственные запросы и многослойный анализ для земельных проектов.' },
          { title: 'Обработка кадастровых данных', desc: 'Автоматизированный парсинг ЕГРН XML, извлечение границ участков и структурирование данных о правообладателях.' },
          { title: 'Планирование землепользования', desc: 'Проверка соответствия зонированию, анализ пригодности земель и картирование нормативных ограничений.' },
          { title: 'Работа с НСПД, ГИС ОГД и ФГИС ТП.', desc: 'Анализ кадастровых и градостроительных данных, выявление ограничений и подготовка картографических материалов.' },
          { title: 'Геопространственная автоматизация', desc: 'Python-скриптинг для пакетной обработки, валидации данных и оптимизации рабочих процессов в QGIS.' }
        ]
      },
      projects: {
        title: 'Проекты',
        client: 'Клиент',
        year: 'Год',
        close: 'Закрыть',
        open: 'Открыть проект',
        visitPage: 'Перейти на страницу проекта',
        items: PROJECTS_DATA.ru
      },
      skills: {
        title: 'Технические навыки',
        items: [
          'QGIS',
          'Python (GeoPandas)',
          'Обработка кадастровых данных',
          'Градостроительство и зонирование'
        ]
      },
      contact: {
        title: 'Связаться со мной',
        intro: 'Заинтересованы в сотрудничестве по ГИС-проекту или нужна экспертиза в области пространственного анализа? Свяжитесь со мной удобным способом — готов обсудить ваш проект и предложить профессиональные решения.',
        summary: 'Готов к реализации сложных ГИС-проектов, анализу градостроительного потенциала и автоматизации процессов землепользования.',
        email: 'Email',
        phone: '+7 (932) 438-31-90',
        emailAddr: 'zemlymag@gmail.com',
        telegram: 'Telegram',
        name: 'Имя',
        message: 'Сообщение',
        send: 'Отправить сообщение'
      },
      footer: 'Евгений Яровой. Эксперт по земельным активам и ГИС-аналитике.'
    },
    en: {
      nav: ['Home', 'About', 'Projects', 'Services', 'Skills', 'Contact'],
      hero: {
        subtitle: 'Land Asset Management | GIS Analytics | Cadastral Engineer',
        description: 'Leading expert in land asset management and GIS analytics. I combine the competencies of a cadastral engineer and urban planning analyst. Actively applying AI technologies for in-depth analysis of regulatory framework and automation of geodata processing, which reduces the time for preparing conclusions and minimizes risks.',
        contact: 'Get in Touch',
        resume: 'Download Resume',
        projects: 'View Projects',
        mapCta: 'Experience Map',
        petProject: 'My pet project'
      },
      about: {
        title: 'About',
        p1: 'Leading expert with a unique combination of competencies: cadastral engineer, GIS analysis specialist, and urban planning professional. I possess deep understanding of land legislation and practical experience working with geospatial data at all stages of the land asset lifecycle.',
        p2: 'I implement cutting-edge AI technologies for regulatory framework analysis and automation of cadastral data processing. This significantly reduces the time for preparing conclusions, minimizes legal risks, and enables informed decisions in land asset management. I specialize in comprehensive analysis of cadastral extracts, assessment of urban development potential, and preparation of analytical reports.',
        resumeBtn: 'Download Full Resume (PDF)',
        cards: [
          { title: 'GIS Expert', desc: 'QGIS, spatial analysis' },
          { title: 'Cadastral Engineer', desc: 'Land surveying, cadastre, EGRN' },
          { title: 'AI for Legal Analysis', desc: 'Automation of regulatory analysis' },
          { title: 'Urban Planning', desc: 'Urban planning' }
        ]
      },
      services: {
        title: 'Services',
        items: [
          { title: 'GIS Mapping & Analysis', desc: 'Custom cartographic solutions, spatial queries, and multi-layer analysis for land development projects.' },
          { title: 'Cadastral Data Processing', desc: 'Automated EGRN XML parsing, parcel boundary extraction, and ownership data structuring.' },
          { title: 'Land Use Planning', desc: 'Zoning compliance review, land suitability analysis, and regulatory constraint mapping.' },
          { title: 'NSPD, GIS OGD and FGIS TP', desc: 'Analysis of cadastral and urban planning data, identification of constraints, and preparation of cartographic materials.' },
          { title: 'Geospatial Automation', desc: 'Python scripting for batch processing, data validation, and workflow optimization in QGIS.' }
        ]
      },
      projects: {
        title: 'Projects',
        client: 'Client',
        year: 'Year',
        close: 'Close',
        open: 'Open Project',
        visitPage: 'Open project page',
        items: PROJECTS_DATA.en
      },
      skills: {
        title: 'Technical Skills',
        items: [
          'QGIS',
          'Python (GeoPandas)',
          'Cadastral Data Processing',
          'Urban Planning & Zoning'
        ]
      },
      contact: {
        title: 'Get in Touch',
        intro: 'Interested in collaborating on a GIS project or need spatial analysis expertise? Contact me in any convenient way — ready to discuss your project and offer professional solutions.',
        summary: 'Ready to deliver complex GIS projects, assess urban development potential, and automate land-use workflows.',
        email: 'Email',
        phone: '+7 (932) 438-31-90',
        emailAddr: 'zemlymag@gmail.com',
        telegram: 'Telegram',
        name: 'Name',
        message: 'Message',
        send: 'Send Message'
      },
      footer: 'Evgeniy Yarovoy. Expert in Land Assets and GIS Analytics.'
    }
  };

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const current = SECTION_IDS.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) setActiveSection(current);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedProject && !showExperienceMap) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedProject, showExperienceMap]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openProject = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
      <motion.div className="fixed inset-0 pointer-events-none" style={{ opacity: gridOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-bold tracking-tight">
              <span className="text-green-400">GIS</span><span className="text-cyan-400">_</span><span className="text-gray-100">Portfolio</span>
            </motion.div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-8">
                {t.nav.map((item, i) => (
                  <motion.button key={item} onClick={() => scrollToSection(SECTION_IDS[i])} className={`text-sm font-medium transition-colors relative group ${activeSection === SECTION_IDS[i] ? 'text-green-400' : 'text-gray-400 hover:text-cyan-400'}`}>
                    {item}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-400 transition-all ${activeSection === SECTION_IDS[i] ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-4 border-l border-green-500/20 pl-4">
                <button onClick={() => setLanguage('ru')} className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${language === 'ru' ? 'bg-green-500 text-slate-900' : 'text-gray-400 hover:text-green-400'}`}>RU</button>
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${language === 'en' ? 'bg-cyan-400 text-slate-900' : 'text-gray-400 hover:text-cyan-400'}`}>EN</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="min-h-screen md:min-h-[82vh] flex items-center justify-center relative px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur-xl opacity-30"></div>
                <img src="/profile-photo.jpg" alt="Евгений Яровой" className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-green-400/30 shadow-2xl" />
              </div>
            </motion.div>
            <div className="text-sm font-mono text-cyan-400 mb-4 tracking-wider">&lt;ПРОСТРАНСТВЕННЫЙ_ИНТЕЛЛЕКТ /&gt;</div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Евгений Яровой</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light">{t.hero.subtitle}</p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">{t.hero.description}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button onClick={() => scrollToSection('contact')} whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-green-500 text-slate-900 rounded-2xl font-semibold uppercase text-xs tracking-widest">{t.hero.contact}</motion.button>
              <motion.button onClick={() => setShowExperienceMap(true)} whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-slate-800 border border-green-500/20 text-white rounded-2xl font-semibold flex items-center gap-2 uppercase text-xs tracking-widest shadow-xl">
                <MapPin size={16} className="text-cyan-400" /> {t.hero.mapCta}
              </motion.button>
              <motion.a href={INDUSTRIAL_PARKS_PAGE} whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-slate-800 border border-cyan-400/20 text-white rounded-2xl font-semibold flex items-center gap-2 uppercase text-xs tracking-widest shadow-xl">
                <Globe size={16} className="text-green-400" /> {t.hero.petProject}
              </motion.a>
              <motion.a href="/resume.pdf" download whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-semibold flex items-center gap-2 uppercase text-xs tracking-widest">{t.hero.resume}</motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3"><span className="text-green-400">//</span>{t.about.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">{t.about.p1}</p>
              <p className="text-gray-300 leading-relaxed">{t.about.p2}</p>
              <motion.a href="/resume.pdf" download className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 rounded-xl font-bold uppercase text-xs tracking-widest">{t.about.resumeBtn}</motion.a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.about.cards.map((item, i) => (
                <div key={i} className="bg-slate-800/50 border border-green-500/20 rounded-2xl p-6">
                  <div className="text-3xl mb-3">{['🗺️', '📐', '🤖', '🏗️'][i]}</div>
                  <h3 className="text-green-400 font-bold mb-2 uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3"><span className="text-green-400">//</span>{t.projects.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.projects.items.map((proj, i) => (
              <button
                key={i}
                onClick={() => openProject(proj)}
                className="bg-slate-800/50 border-2 border-green-500/20 rounded-2xl overflow-hidden hover:border-green-400 transition-all group flex flex-col text-left text-white min-h-full"
              >
                <div className="h-52 bg-slate-700 relative flex items-center justify-center overflow-hidden">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                    <span className="rounded-full border border-cyan-400/30 bg-slate-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-300">
                      {proj.year}
                    </span>
                    <span className="rounded-full border border-green-500/30 bg-slate-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-300">
                      {t.projects.open}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                    <Globe size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 uppercase tracking-tighter group-hover:text-green-400 transition-colors leading-tight">
                    {proj.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{proj.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] rounded-full border border-green-500/20 uppercase font-black">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-5 border-t border-white/5">
                    <span className="text-[11px] font-medium text-slate-400 leading-snug">{proj.client}</span>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                      {t.projects.open}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-24 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3"><span className="text-cyan-400">//</span>{t.services.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.services.items.map((service, i) => (
              <div key={i} className="bg-slate-800/50 border-2 border-green-500/20 rounded-2xl p-8 hover:border-green-400 transition-all cursor-default group">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform"><Globe size={24} className="text-green-400" /></div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tighter">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="py-24 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3"><span className="text-cyan-400">//</span>{t.skills.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full mb-12" />
          <div className="bg-slate-800 border border-green-500/20 rounded-3xl p-8">
            {t.skills.items.map((skill, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex justify-between mb-2 uppercase text-[10px] font-black tracking-widest"><span>{skill}</span><span className="text-cyan-400">{SKILL_LEVELS[i]}%</span></div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${SKILL_LEVELS[i]}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-green-500 to-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 uppercase">{t.contact.title}</h2>
          <div className="grid md:grid-cols-2 gap-12 text-left text-white">
            <div className="space-y-8">
              <p className="text-gray-400 leading-relaxed">{t.contact.intro}</p>
              <div className="space-y-4">
                <a href={`tel:${t.contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-4 text-gray-300 hover:text-green-400 font-bold">
                  <Phone size={20}/>{t.contact.phone}
                </a>
                <a href={`mailto:${t.contact.emailAddr}`} className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 font-bold">
                  <Mail size={20}/>{t.contact.emailAddr}
                </a>
                <a href="https://t.me/myGIStrip" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 font-bold">
                  <Ghost size={20}/>Telegram
                </a>
              </div>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 flex flex-col justify-center">
               <Rainbow className="text-green-400 mb-6" size={32} />
               <p className="text-sm text-gray-400 font-medium leading-relaxed">
                 {t.contact.summary}
               </p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[110] p-3 sm:p-6 flex items-center justify-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-slate-900 border border-green-500/20 rounded-[2rem] sm:rounded-[3rem] max-w-4xl w-full max-h-[92vh] overflow-y-auto">
              <div className="p-5 sm:p-8 lg:p-12">
                <div className="flex justify-between items-start gap-4 mb-6 sm:mb-10 text-white">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-green-400 tracking-tighter leading-tight">{selectedProject.title}</h3>
                  <button onClick={() => setSelectedProject(null)} className="shrink-0 rounded-xl border border-white/10 bg-slate-800 p-2 text-slate-400 hover:text-red-400"><X size={24}/></button>
                </div>
                <div className="mb-8 rounded-2xl overflow-hidden border border-green-500/20">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-auto max-h-[40vh] object-cover" />
                </div>
                {selectedProject.details ? (
                  <div className="max-w-none text-gray-300 leading-relaxed mb-8 sm:mb-10 border-l-2 border-green-500/30 pl-4 sm:pl-8 font-medium space-y-6 text-sm sm:text-base">
                    <p>{selectedProject.details.intro}</p>
                    <p className="text-cyan-300">{selectedProject.details.workflow}</p>
                    {selectedProject.details.sections.map((section) => (
                      <div key={section.title} className="space-y-3">
                        <h4 className="text-white font-bold">{section.title}</h4>
                        {section.text ? <p>{section.text}</p> : null}
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                          {section.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p className="text-emerald-300">{selectedProject.details.postscript}</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-400 whitespace-pre-line leading-relaxed mb-8 sm:mb-10 border-l-2 border-green-500/30 pl-4 sm:pl-8 font-medium">
                    {selectedProject.fullDescription}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedProject.slug === 'industrial-parks-tatarstan' && (
                    <a href={INDUSTRIAL_PARKS_PAGE} className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-cyan-400 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest text-center">
                      {t.projects.visitPage}
                    </a>
                  )}
                  {selectedProject.slug !== 'industrial-parks-tatarstan' && (
                    <button onClick={() => setSelectedProject(null)} className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-green-500 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest">{t.projects.close}</button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExperienceMap && <ExperienceMapModal onClose={() => setShowExperienceMap(false)} language={language} t={t} />}
      </AnimatePresence>

      <footer className="py-12 px-6 border-t border-green-500/10 bg-slate-950 text-center uppercase text-[8px] font-black tracking-[0.5em] text-gray-700">
        © 2026 {t.footer}
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        html { scroll-behavior: smooth; }
        .leaflet-container { background: #020617 !important; outline: 0; }
        .leaflet-marker-icon { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default App;
