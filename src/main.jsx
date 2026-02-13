import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const experiences = [
  {
    company: "СИБУР",
    role: "ГИС-аналитик / Урбанист",
    period: "2024 — 2025",
    description: "Анализ территориального развития и промышленных зон. Оптимизация инфраструктуры с использованием геоданных."
  },
  {
    company: "Роснефть",
    role: "Специалист по земельно-имущественным отношениям",
    period: "2022 — 2024",
    description: "Сопровождение кадастрового учета, работа с ЗОУИТ и оформление прав на участки для объектов нефтедобычи."
  },
  {
    company: "Сургутнефтегаз",
    role: "Ведущий специалист по кадастровой деятельности",
    period: "Важная веха",
    description: "Комплексное сопровождение кадастровых работ, анализ ПЗЗ и документации по планировке территорий."
  }
];

function App() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#333', maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a365d', marginBottom: '10px' }}>ГИС Портфолио 🌍</h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>Евгений — Специалист по кадастру и урбанистике</p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2c5282', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Опыт в индустрии</h2>
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {experiences.map((exp, i) => (
            <div key={i} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{exp.company}</h3>
              <p style={{ fontWeight: 'bold', color: '#2b6cb0' }}>{exp.role} <span style={{ color: '#a0aec0', fontWeight: 'normal' }}>| {exp.period}</span></p>
              <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ color: '#2c5282', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Компетенции</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
          {['QGIS', 'Python', 'Кадастр', 'Системы ИСОГД', 'Анализ ПЗЗ', 'ЗОУИТ', 'AI tools'].map(skill => (
            <span key={skill} style={{ padding: '8px 16px', background: '#edf2f7', borderRadius: '20px', fontSize: '0.85rem' }}>{skill}</span>
          ))}
        </div>
      </section>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)