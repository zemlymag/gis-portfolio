import { ArrowLeft } from "lucide-react";
import IndustrialParksMap from "./IndustrialParksMap";

const CONTENT = {
  ru: {
    back: "Вернуться на главную",
    eyebrow: "GIS / ВЕБ-ПРОЕКТ",
    title: "Индустриальные парки Татарстана",
    subtitle: "Интерактивная веб-карта с индустриальными парками, муниципальными границами, земельными участками и транспортной инфраструктурой.",
    lead: "Друзья, хочу поделиться свежим кейсом о том, как современные инструменты меняют привычную работу градостроителя. Сейчас я занимаюсь проектом карты индустриальных парков в Татарстане, и чтобы не тратить время на рутину, решил выжать максимум из связки QGIS, Python и нейросетей.",
    featureA: "Карточки парков с атрибутами и статусами",
    featureB: "Слои участков, границ, дорог и железных дорог",
    featureC: "Быстрый просмотр площадок и их базовых характеристик",
    mapLabel: "Рабочая карта проекта",
    articleTitle: "Текст проекта",
    article: [
      "Основная сложность была с данными НСПД. Чтобы получить точные границы участков, обычно приходится либо долго разбирать портал вручную, либо писать запросы и проверять результаты по частям.",
      "Я протестировал разные модели, включая ChatGPT, Gemini и Claude, но основной упор в этом кейсе сделал на DeepSeek. Причина практическая: сервис стабильно работает в России без лишних обходных решений, а по PyQGIS выдал неожиданно чистый и рабочий каркас там, где другие модели путались в старом синтаксисе.",
      "В итоге нейросеть написала основу скрипта, который я уже допилил под себя в консоли QGIS. Теперь границы участков подтягиваются почти автоматически по запросу расположения точки, и система сама определяет кадастровый контур парка.",
      "Транспортную инфраструктуру я забрал из открытых данных через QuickOSM. Раньше на чистку и сортировку дорог мог уйти целый вечер, а сейчас короткий Python-скрипт, тоже собранный с помощью AI, раскладывает все по слоям за несколько минут.",
      "Для меня AI здесь не замена специалисту, а сильный ускоритель. Он берет на себя рутинную подготовку кода и поиск синтаксических ошибок, а мне оставляет главное: анализ территории и принятие проектных решений.",
      "Все данные я связал с проектом в QGIS, поэтому любые правки в слоях, например добавление нового парка или обновление контуров участков, можно быстро отразить на сайте без ручной переработки всей логики интерфейса.",
    ],
    bulletTitle: "Почему этот подход сработал",
    bullets: [
      "НСПД и кадастровые границы перестали быть узким местом в сборе данных.",
      "Связка QGIS, Python и AI заметно сократила ручную рутину.",
      "Сайт превратился в живую GIS-витрину, а не в статичную публикацию.",
    ],
  },
  en: {
    back: "Back to portfolio",
    eyebrow: "GIS / WEB PROJECT",
    title: "Industrial Parks of Tatarstan",
    subtitle: "Interactive web map with industrial parks, municipal boundaries, land plots, and transport infrastructure.",
    lead: "This project is built as a unified GIS workspace for preliminary industrial site assessment. The map combines park profiles and thematic layers in one interface.",
    featureA: "Park cards with attributes and status metadata",
    featureB: "Land plots, boundaries, roads, and railway layers",
    featureC: "Fast screening of sites and their core attributes",
    mapLabel: "Interactive project map",
    articleTitle: "Project note",
    article: [
      "This page presents the working map and the underlying GIS workflow used to assemble the project.",
      "The main production environment combines QGIS, Python, and AI-assisted scripting to speed up data collection, cleanup, and integration.",
      "Parcel boundaries and transport infrastructure are prepared in GIS and then connected to the web interface so updates can be reflected with minimal manual rework.",
    ],
    bulletTitle: "Why this matters",
    bullets: [
      "Faster preparation of source spatial data.",
      "Less routine scripting and fewer syntax-level errors.",
      "A website that stays tied to the living GIS project.",
    ],
  },
};

export default function IndustrialParksProjectPage({ language = "ru", onBack, onToggleLanguage }) {
  const copy = CONTENT[language] || CONTENT.ru;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-[1200] border-b border-green-500/15 bg-slate-950/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-green-400/40 hover:text-green-300"
          >
            <ArrowLeft size={16} />
            {copy.back}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLanguage("ru")}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${language === "ru" ? "bg-green-500 text-slate-900" : "text-slate-400 hover:text-green-400"}`}
            >
              RU
            </button>
            <button
              onClick={() => onToggleLanguage("en")}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${language === "en" ? "bg-cyan-400 text-slate-900" : "text-slate-400 hover:text-cyan-400"}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 sm:px-6 sm:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-green-500/15 bg-slate-900 shadow-2xl shadow-black/30">
          <div className="h-[calc(100vh-120px)] min-h-[760px]">
            <IndustrialParksMap />
          </div>
        </section>
      </main>
    </div>
  );
}
