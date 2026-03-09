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

const SECTION_IDS = ['home', 'about', 'services', 'projects', 'skills', 'contact'];
const SKILL_LEVELS = [95, 90, 92, 88];

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('ru'); 
  const [showExperienceMap, setShowExperienceMap] = useState(false);
  const { scrollY } = useScroll();
  const gridOpacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);
  
  const translations = {
    ru: {
      nav: ['Главная', 'О себе', 'Услуги', 'Проекты', 'Навыки', 'Контакты'],
      hero: {
        subtitle: 'Управление земельными активами | ГИС-аналитика | Кадастровый инженер',
        description: 'Ведущий эксперт по управлению земельными активами и GIS-аналитике. Объединяю компетенции кадастрового инженера и градостроительного аналитика. Активно применяю ИИ-технологии для глубокого анализа нормативно-правовой базы и автоматизации обработки геоданных, что позволяет сокращать сроки подготовки заключений и снижать риски.',
        contact: 'Связаться',
        resume: 'Скачать резюме',
        projects: 'Посмотреть проекты',
        mapCta: 'Карта опыта'
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
        open: 'Открыть проект'
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
      nav: ['Home', 'About', 'Services', 'Projects', 'Skills', 'Contact'],
      hero: {
        subtitle: 'Land Asset Management | GIS Analytics | Cadastral Engineer',
        description: 'Leading expert in land asset management and GIS analytics. I combine the competencies of a cadastral engineer and urban planning analyst. Actively applying AI technologies for in-depth analysis of regulatory framework and automation of geodata processing, which reduces the time for preparing conclusions and minimizes risks.',
        contact: 'Get in Touch',
        resume: 'Download Resume',
        projects: 'View Projects',
        mapCta: 'Experience Map'
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
        open: 'Open Project'
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

      <section id="home" className="min-h-screen flex items-center justify-center relative px-6">
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

      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3"><span className="text-green-400">//</span>{t.projects.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />
          <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory">
            {[
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
                client: 'Личный проект', year: '2024', image: '/project-map-rt.png'
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
                client: 'Федеральный инфраструктурный проект', year: '2025', image: '/gis.jpeg'
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
                client: 'Личный проект', year: '2025', image: '/API.png'
              }
            ].map((proj, i) => (
              <button key={i} onClick={() => setSelectedProject(proj)} className="min-w-[320px] md:min-w-[460px] max-w-[460px] snap-start shrink-0 text-left bg-slate-800/50 border border-cyan-500/20 rounded-[2rem] overflow-hidden hover:border-green-400 transition-all group flex flex-col text-white">
                <div className="h-48 bg-slate-700 relative flex items-center justify-center overflow-hidden">
                   <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 uppercase tracking-tighter group-hover:text-green-400 transition-colors">{proj.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{proj.desc}</p>
                  <div className="flex gap-2">{proj.tags.map(t => <span key={t} className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] rounded-full border border-green-500/20 uppercase font-black">{t}</span>)}</div>
                </div>
              </button>
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
                <a href="https://t.me/kakDelaEvgen" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 font-bold">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[110] p-6 flex items-center justify-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-slate-900 border border-green-500/20 rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-12">
                <div className="flex justify-between items-start mb-10 text-white">
                  <h3 className="text-3xl font-black uppercase text-green-400 tracking-tighter">{selectedProject.title}</h3>
                  <button onClick={() => setSelectedProject(null)} className="text-slate-500 hover:text-red-400"><X size={32}/></button>
                </div>
                <div className="mb-8 rounded-2xl overflow-hidden border border-green-500/20">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-auto object-cover" />
                </div>
                {selectedProject.details ? (
                  <div className="max-w-none text-gray-300 leading-relaxed mb-10 border-l-2 border-green-500/30 pl-8 font-medium space-y-6">
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
                  <div className="prose prose-invert max-w-none text-gray-400 whitespace-pre-line leading-relaxed mb-10 border-l-2 border-green-500/30 pl-8 font-medium">
                    {selectedProject.fullDescription}
                  </div>
                )}
                <button onClick={() => setSelectedProject(null)} className="px-10 py-4 bg-green-500 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest">{t.projects.close}</button>
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
