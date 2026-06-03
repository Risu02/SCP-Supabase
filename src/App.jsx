import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavMenu from './NavMenu'
import SCPDetail from './SCPDetail'
import AdminPanel from './AdminPanel'
import { supabase } from './supabase'
import './App.css'

function getClassKey(cls) {
  if (!cls) return 'default'
  const c = cls.toLowerCase()
  if (c.includes('safe'))     return 'safe'
  if (c.includes('euclid'))   return 'euclid'
  if (c.includes('keter'))    return 'keter'
  if (c.includes('thaumiel')) return 'thaumiel'
  if (c.includes('apollyon')) return 'apollyon'
  return 'default'
}

function HomePage() {
  const [scps, setScps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScps = async () => {
      const { data, error } = await supabase
        .from('scp_subjects')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching SCPs:', error.message)
        setLoading(false)
        return
      }

      setScps(data || [])
      setLoading(false)
    }

    fetchScps()
  }, [])

  return (
    <>
      {/* Hero banner */}
      <section className="hero">
        <h1 className="cursor">SCP Subject Database</h1>
        <p>Secure. Contain. Protect.</p>
        <p>
          Classified repository of anomalous entities and objects maintained by the SCP Foundation.
          Access is restricted to personnel with Level 3 clearance or above.
        </p>
        <span className="stamp">CLASSIFIED</span>
      </section>

      {/* Subject grid */}
      <div className="section-title">Documented Subjects</div>

      {loading ? (
        <div className="loading">Retrieving subject index…</div>
      ) : scps.length === 0 ? (
        <p className="muted">No subjects on record. Use the Admin Panel to add entries.</p>
      ) : (
        <div className="grid">
          {scps.map((scp) => (
            <Link
              key={scp.id}
              to={`/scp/${scp.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className="card">
                {scp.image ? (
                  <img
                    className="scp-image"
                    src={scp.image}
                    alt={scp.item}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="scp-image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span>[ IMAGE REDACTED ]</span>
                  </div>
                )}

                <h2>{scp.item}</h2>
                <span className={`class-badge class-${getClassKey(scp.class)}`}>
                  {scp.class || 'Unclassified'}
                </span>

                <p style={{ marginTop: '10px', fontSize: '0.83rem' }}>
                  {scp.description?.slice(0, 130)}{scp.description?.length > 130 ? '…' : ''}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <Router>
      <NavMenu />

      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scp/:id" element={<SCPDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
