import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('ru'); // 'ru' или 'en'
  const { scrollY } = useScroll();
  const gridOpacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);

  // Переводы
  const translations = {
    ru: {
      nav: ['Главная', 'О себе', 'Услуги', 'Проекты', 'Навыки', 'Контакты'],
      hero: {
        subtitle: 'Управление земельными активами | ГИС-аналитика | Кадастровый инженер',
        description: 'Ведущий эксперт по управлению земельными активами и GIS-аналитике. Объединяю компетенции кадастрового инженера и градостроительного аналитика. Активно применяю ИИ-технологии для глубокого анализа нормативно-правовой базы и автоматизации обработки геоданных, что позволяет сокращать сроки подготовки заключений и снижать риски.',
        contact: 'Связаться',
        resume: 'Скачать резюме',
        projects: 'Посмотреть проекты'
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
          { title: 'Экономика застройки', desc: 'Анализ участков, выявление ограничений и исследования вместимости для жилых и коммерческих проектов.' },
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
        email: 'Email',
        phone: 'Телефон',
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
        projects: 'View Projects'
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
          { title: 'Urban Planning', desc: 'Zoning, master plans, regulations' }
        ]
      },
      services: {
        title: 'Services',
        items: [
          { title: 'GIS Mapping & Analysis', desc: 'Custom cartographic solutions, spatial queries, and multi-layer analysis for land development projects.' },
          { title: 'Cadastral Data Processing', desc: 'Automated EGRN XML parsing, parcel boundary extraction, and ownership data structuring.' },
          { title: 'Land Use Planning', desc: 'Zoning compliance review, land suitability analysis, and regulatory constraint mapping.' },
          { title: 'Development Feasibility', desc: 'Site analysis, constraint identification, and capacity studies for residential and commercial projects.' },
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
        email: 'Email',
        phone: 'Phone',
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
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
      {/* Animated Grid Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: gridOpacity }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold tracking-tight"
            >
              <span className="text-green-400">GIS</span>
              <span className="text-cyan-400">_</span>
              <span className="text-gray-100">Portfolio</span>
            </motion.div>
            
            <div className="flex gap-8">
              {t.nav.map((item, i) => {
                const sectionIds = ['home', 'about', 'services', 'projects', 'skills', 'contact'];
                return (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(sectionIds[i])}
                    className={`text-sm font-medium transition-colors relative group ${
                      activeSection === sectionIds[i]
                        ? 'text-green-400' 
                        : 'text-gray-400 hover:text-cyan-400'
                    }`}
                  >
                    {item}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-400 transition-all ${
                      activeSection === sectionIds[i] ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </motion.button>
                );
              })}
              
              {/* Language Switcher */}
              <div className="flex items-center gap-2 ml-4 border-l border-green-500/20 pl-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    language === 'ru' 
                      ? 'bg-green-500 text-slate-900' 
                      : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  RU
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    language === 'en' 
                      ? 'bg-cyan-400 text-slate-900' 
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
                  }`}
                >
                  EN
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative px-6">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`,
              backgroundSize: '200% 200%',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur-xl opacity-30"></div>
                <img 
                  src="/profile-photo.jpg" 
                  alt="Евгений Яровой"
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-green-400/30 shadow-2xl shadow-green-500/20"
                />
              </div>
            </motion.div>

            <div className="text-sm font-mono text-cyan-400 mb-4 tracking-wider">
              &lt;ПРОСТРАНСТВЕННЫЙ_ИНТЕЛЛЕКТ /&gt;
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                Евгений Яровой
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light">
              {t.hero.subtitle}
            </p>
            
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.description}
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 bg-green-500 text-slate-900 rounded-2xl font-semibold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/30"
              >
                {t.hero.contact}
              </motion.button>
              <motion.a
                href="/resume.pdf"
                download="Яровой_Евгений_Резюме.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors shadow-lg shadow-cyan-500/30 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.hero.resume}
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-400/10 transition-colors"
              >
                {t.hero.projects}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-green-400/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <span className="text-green-400">//</span>
              <span>{t.about.title}</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  {t.about.p1}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {t.about.p2}
                </p>
                
                <motion.a
                  href="/resume.pdf"
                  download="Яровой_Евгений_Резюме.pdf"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 rounded-xl font-semibold hover:from-green-400 hover:to-cyan-400 transition-all shadow-lg shadow-green-500/30"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.about.resumeBtn}
                </motion.a>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {t.about.cards.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="text-3xl mb-3">{['🗺️', '📐', '🤖', '🏗️'][i]}</div>
                    <h3 className="text-green-400 font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <span className="text-cyan-400">//</span>
              <span>{t.services.title}</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.services.items.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(249, 115, 22, 0.5)' }}
                  className="bg-slate-800/50 backdrop-blur-sm border-2 border-green-500/20 rounded-2xl p-8 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:from-orange-500/20 group-hover:to-orange-500/30 transition-colors">
                      <div className="w-6 h-6 border-2 border-green-400 rounded group-hover:border-orange-400 transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-100 group-hover:text-green-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <span className="text-green-400">//</span>
              <span>{t.projects.title}</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-1 gap-8 max-w-3xl mx-auto">
              {[
                {
                  title: 'Создание гипсометрической карты Татарстана',
                  desc: 'Работа с рельефом и верификация данных в QGIS. Физико-административная карта Республики Татарстан с визуализацией рельефа и административной сеткой.',
                  tags: ['QGIS', 'DEM', 'Картография'],
                  fullDescription: `
                    Завершил работу над физико-административной картой Республики Татарстан. Основной задачей было совместить наглядную визуализацию рельефа с точной административной сеткой, сохранив при этом высокую читаемость карты.
                    
                    Краткий разбор воркфлоу и источников данных, которые легли в основу проекта.
                    
                    1️⃣ Сбор и подготовка данных
                    
                    Качество карты напрямую зависит от исходников. В этом проекте я использовал гибридный подход к сбору данных:
                    
                    • Административное деление и населенные пункты: За основу взял данные Фонда пространственных данных РТ (портал fpd-tatar.nextgis.com). Это позволило получить наиболее актуальную и точную информацию по границам районов и локации городов, что выгодно отличает карту от версий на базе только глобальных данных.
                    
                    • Природные объекты: Границы лесных массивов, гидрографию (реки и водохранилища) выгружал и обрабатывал через OpenStreetMap (OSM). Данные прошли постобработку и генерализацию контуров для корректного отображения в выбранном масштабе.
                    
                    2️⃣ Работа с рельефом (DEM и визуализация)
                    
                    Для создания «объема» использовал классическую связку в QGIS:
                    
                    • Гипсометрия: Наложил цветовую шкалу (Color Ramp) от темно-зеленого для низин к коричневому для возвышенностей.
                    
                    • Отмывка (Hillshade): Сгенерировал теневой рельеф на основе DEM. Использовал режим смешивания «Умножение» (Multiply), чтобы сохранить насыщенность цветов и подчеркнуть пластику ландшафта.
                    
                    3️⃣ Картографический дизайн
                    
                    • Дорожная сеть: Иерархия дорог настроена через Symbol Levels (уровни знака), чтобы избежать визуальных разрывов на перекрестках.
                    
                    • Условные знаки: Разработал кастомную легенду для классификации населенных пунктов по численности.
                    
                    • Оформление: Применил буферизацию (Halo) для текстовых меток для повышения контраста.
                    
                    P.S. есть еще куда стремиться ↗️
                  `,
                  client: 'Личный проект',
                  year: '2024',
                  link: '#',
                  image: '/project-map-rt.png'
                },
                // Закомментированные проекты - можно раскомментировать позже
                /*
                {
                  title: 'Анализ регионального генплана',
                  desc: 'Комплексная ГИС-оценка 50+ участков для многофункциональной застройки на соответствие местным правилам зонирования.',
                  tags: ['QGIS', 'Зонирование', 'Python'],
                  fullDescription: `
                    Проведен полный геопространственный анализ территории площадью более 150 га для проекта многофункциональной застройки.
                    
                    Задачи проекта:
                    • Анализ соответствия 50+ земельных участков правилам зонирования
                    • Проверка ограничений по санитарно-защитным зонам
                    • Оценка транспортной доступности
                    • Анализ обеспеченности инженерной инфраструктурой
                    
                    Результаты:
                    • Создана интерактивная карта с зонами ограничений
                    • Подготовлен отчет с рекомендациями по 15 приоритетным участкам
                    • Сэкономлено 3 месяца на предпроектных исследованиях
                    
                    Технологии: QGIS 3.28, Python (GeoPandas, Shapely)
                  `,
                  client: 'Девелоперская компания',
                  year: '2024',
                  link: '#'
                },
                {
                  title: 'Автоматизация кадастровой БД',
                  desc: 'Автоматизированный конвейер для обработки файлов ЕГРН XML, извлечения геометрии участков и данных о правообладателях в масштабе.',
                  tags: ['Python', 'XML', 'База данных'],
                  fullDescription: `
                    Разработана система автоматической обработки выписок из ЕГРН для земельного банка компании.
                    
                    Задачи проекта:
                    • Автоматический парсинг XML-файлов ЕГРН
                    • Извлечение координат границ участков
                    • Структурирование данных о правообладателях
                    • Интеграция с корпоративной ГИС
                    
                    Результаты:
                    • Обработка 500+ выписок ЕГРН в день (было: 10-15 вручную)
                    • Сокращение времени обработки с 30 минут до 2 секунд на файл
                    • База данных 5000+ участков с актуальной информацией
                    • Снижение ошибок ввода данных до нуля
                    
                    Технологии: Python, lxml, PostgreSQL, QGIS API
                  `,
                  client: 'Земельная компания',
                  year: '2023',
                  link: '#'
                },
                {
                  title: 'Картирование городских островов тепла',
                  desc: 'Мультивременной анализ спутниковых снимков для выявления зон уязвимости к перегреву для градостроительных интервенций.',
                  tags: ['ДЗЗ', 'QGIS', 'Анализ'],
                  fullDescription: `
                    Исследование температурных аномалий в городской среде для разработки стратегии адаптации к изменению климата.
                    
                    Задачи проекта:
                    • Анализ тепловых снимков Landsat 8 за 5 лет
                    • Выявление устойчивых островов тепла
                    • Корреляция с плотностью застройки и озеленением
                    • Разработка рекомендаций по снижению температуры
                    
                    Результаты:
                    • Идентифицировано 12 критических зон перегрева
                    • Установлена связь с плотностью застройки (R² = 0.87)
                    • Предложены зоны приоритетного озеленения
                    • Подготовлены рекомендации для генплана города
                    
                    Технологии: QGIS, GDAL, Python (rasterio, numpy), Landsat 8
                  `,
                  client: 'Администрация города',
                  year: '2024',
                  link: '#'
                },
                */
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.6)' }}
                  onClick={() => setSelectedProject(project)}
                  className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 transition-all group cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`proj-grid-${i}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#proj-grid-${i})`} />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-20 border-4 border-green-400/30 border-t-green-400 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-green-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <span className="text-cyan-400">//</span>
              <span>{t.skills.title}</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full mb-12" />

            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl overflow-hidden">
              <div className="bg-slate-900/50 px-6 py-4 border-b border-green-500/20 font-mono text-sm text-green-400">
                attribute_table.shp
              </div>
              
              <div className="p-6 space-y-6">
                {t.skills.items.map((skillName, i) => {
                  const levels = [95, 90, 92, 88];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">{skillName}</span>
                        <span className="text-cyan-400 font-mono text-sm">{levels[i]}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${levels[i]}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <span className="text-green-400">//</span>
              <span>{t.contact.title}</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  {t.contact.intro}
                </p>

                <div className="space-y-4">
                  <motion.a
                    href="mailto:zemlymag@gmail.com"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-green-400 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.contact.email}</div>
                      <div className="font-medium">zemlymag@gmail.com</div>
                    </div>
                  </motion.a>

                  <motion.a
                    href="tel:+79324383190"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-green-400 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.contact.phone}</div>
                      <div className="font-medium">+7 932 438-31-90</div>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://t.me/kakDelaEvgen"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t.contact.telegram}</div>
                      <div className="font-medium">Мой GIS путь</div>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://www.linkedin.com/in/%D0%B5%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9-%D1%8F%D1%80%D0%BE%D0%B2%D0%BE%D0%B9-28365645/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-blue-400 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6C1.1 6 0 4.88 0 3.5C0 2.12 1.12 1 2.5 1C3.88 1 4.98 2.12 4.98 3.5ZM0.22 8.98H4.74V24H0.22V8.98ZM8.98 8.98H13.18V11.02H13.26C13.98 9.56 15.98 8.98 18.26 8.98C23.02 8.98 24 11.96 24 16.34V24H19.48V17.58C19.48 15.62 19.44 12.98 16.66 12.98C13.86 12.98 13.46 15.28 13.46 17.38V24H8.94V8.98H8.98Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">LinkedIn</div>
                      <div className="font-medium">Евгений Яровой</div>
                    </div>
                  </motion.a>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={t.contact.name}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/20 rounded-xl focus:outline-none focus:border-green-400 transition-colors text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/20 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    rows="5"
                    placeholder={t.contact.message}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/20 rounded-xl focus:outline-none focus:border-green-400 transition-colors text-gray-100 placeholder-gray-500 resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 rounded-xl font-semibold hover:from-green-400 hover:to-cyan-400 transition-all shadow-lg shadow-green-500/30"
                >
                  {t.contact.send}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 border-2 border-green-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-green-500/20 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold text-green-400 mb-2">
                  {selectedProject.title}
                </h3>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{t.projects.client}: {selectedProject.client}</span>
                  <span>•</span>
                  <span>{t.projects.year}: {selectedProject.year}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="px-4 py-2 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project Image Placeholder */}
              {selectedProject.image ? (
                <div className="mb-6">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-auto rounded-xl shadow-2xl border border-green-500/20"
                  />
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="modal-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#modal-grid)" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🗺️</div>
                      <div className="text-gray-400 text-sm">Место для изображения проекта</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedProject.fullDescription}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedProject(null)}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 rounded-xl font-semibold hover:from-green-400 hover:to-cyan-400 transition-all shadow-lg shadow-green-500/30"
                >
                  {t.projects.close}
                </motion.button>
                {selectedProject.link && selectedProject.link !== '#' && (
                  <motion.a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 rounded-xl font-semibold hover:bg-cyan-400/10 transition-colors"
                  >
                    {t.projects.open} →
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-green-500/20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 {t.footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
