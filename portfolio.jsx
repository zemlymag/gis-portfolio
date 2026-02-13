import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { scrollY } = useScroll();
  const gridOpacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);

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
              {['Главная', 'О себе', 'Услуги', 'Проекты', 'Навыки', 'Контакты'].map((item, i) => {
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
            <div className="text-sm font-mono text-cyan-400 mb-4 tracking-wider">
              &lt;ПРОСТРАНСТВЕННЫЙ_ИНТЕЛЛЕКТ /&gt;
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                Евгений Яровой
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light">
              ГИС Аналитика | Землеустройство | Градостроительство
            </p>
            
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Превращаю пространственные данные в практические решения. Специализируюсь на кадастровом анализе, 
              обработке выписок ЕГРН в формате XML и разработке градостроительных стратегий на основе геопространственных данных.
            </p>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 bg-green-500 text-slate-900 rounded-2xl font-semibold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/30"
              >
                Связаться
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-400/10 transition-colors"
              >
                Посмотреть проекты
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
              <span>О себе</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  ГИС-специалист с обширным опытом в пространственном анализе, земельном консалтинге 
                  и градостроительном проектировании. Владею навыками обработки сложных кадастровых наборов данных, 
                  автоматизации анализа выписок ЕГРН в формате XML и предоставления аналитики для проверки 
                  соответствия зонированию и генеральным планам.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Мой подход сочетает техническую точность со стратегическим мышлением, позволяя клиентам принимать 
                  обоснованные решения по землепользованию, целесообразности застройки и соответствию нормативным требованиям. 
                  Специализируюсь на преобразовании необработанных геопространственных данных в четкую, практическую аналитику.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: '🗺️', title: 'Эксперт QGIS', desc: 'Продвинутый пространственный анализ и картография' },
                  { icon: '📊', title: 'Аналитика данных', desc: 'Статистическое моделирование и визуализация' },
                  { icon: '📋', title: 'Кадастровая обработка', desc: 'Автоматизация ЕГРН XML' },
                  { icon: '🏗️', title: 'Градостроительство', desc: 'Зонирование и проверка генпланов' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
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
              <span>Услуги</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'ГИС Картографирование и анализ',
                  desc: 'Индивидуальные картографические решения, пространственные запросы и многослойный анализ для земельных проектов.',
                },
                {
                  title: 'Обработка кадастровых данных',
                  desc: 'Автоматизированный парсинг ЕГРН XML, извлечение границ участков и структурирование данных о правообладателях.',
                },
                {
                  title: 'Планирование землепользования',
                  desc: 'Проверка соответствия зонированию, анализ пригодности земель и картирование нормативных ограничений.',
                },
                {
                  title: 'Экономика застройки',
                  desc: 'Анализ участков, выявление ограничений и исследования вместимости для жилых и коммерческих проектов.',
                },
                {
                  title: 'Геопространственная автоматизация',
                  desc: 'Python-скриптинг для пакетной обработки, валидации данных и оптимизации рабочих процессов в QGIS.',
                },
              ].map((service, i) => (
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
              <span>Проекты</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Анализ регионального генплана',
                  desc: 'Комплексная ГИС-оценка 50+ участков для многофункциональной застройки на соответствие местным правилам зонирования.',
                  tags: ['QGIS', 'Зонирование', 'Python'],
                },
                {
                  title: 'Автоматизация кадастровой БД',
                  desc: 'Автоматизированный конвейер для обработки файлов ЕГРН XML, извлечения геометрии участков и данных о правообладателях в масштабе.',
                  tags: ['Python', 'XML', 'PostGIS'],
                },
                {
                  title: 'Картирование городских островов тепла',
                  desc: 'Мультивременной анализ спутниковых снимков для выявления зон уязвимости к перегреву для градостроительных интервенций.',
                  tags: ['ДЗЗ', 'QGIS', 'Анализ'],
                },
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.6)' }}
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
              <span>Технические навыки</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full mb-12" />

            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl overflow-hidden">
              <div className="bg-slate-900/50 px-6 py-4 border-b border-green-500/20 font-mono text-sm text-green-400">
                attribute_table.shp
              </div>
              
              <div className="p-6 space-y-6">
                {[
                  { skill: 'QGIS и ArcGIS', level: 95 },
                  { skill: 'Python (PyQGIS, GeoPandas)', level: 90 },
                  { skill: 'PostGIS и Spatial SQL', level: 85 },
                  { skill: 'Обработка кадастровых данных', level: 92 },
                  { skill: 'Дистанционное зондирование', level: 80 },
                  { skill: 'Градостроительство и зонирование', level: 88 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium">{item.skill}</span>
                      <span className="text-cyan-400 font-mono text-sm">{item.level}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
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
              <span>Связаться со мной</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-12" />

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Заинтересованы в сотрудничестве по ГИС-проекту или нужна экспертиза в области пространственного анализа? 
                  Давайте обсудим, как геопространственные данные могут продвинуть ваш следующий проект.
                </p>

                <div className="space-y-4">
                  <motion.a
                    href="mailto:gis@example.com"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-green-400 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">zemlymag@gmail.com</div>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://t.me/username"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Telegram</div>
                      <div className="font-medium">@kakDelaEvgen</div>
                    </div>
                  </motion.a>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Имя"
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
                    placeholder="Сообщение"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/20 rounded-xl focus:outline-none focus:border-green-400 transition-colors text-gray-100 placeholder-gray-500 resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 rounded-xl font-semibold hover:from-green-400 hover:to-cyan-400 transition-all shadow-lg shadow-green-500/30"
                >
                  Отправить сообщение
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-green-500/20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 ГИС Портфолио. Пространственный интеллект для современной застройки.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
