import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'

export default function NavMenu() {
  const [scps, setScps] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchScps = async () => {
      const { data, error } = await supabase
        .from('scp_subjects')
        .select('id, item, class')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching navigation records:', error.message)
        return
      }

      setScps(data || [])
    }

    fetchScps()
  }, [])

  return (
    <nav className="nav">
      <div className="nav-top">
        <Link className="brand" to="/" onClick={() => setIsOpen(false)}>
          SCP Database
        </Link>

        <button
          className={`nav-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle subject index"
        >
          {isOpen ? 'CLOSE MENU' : `ENTITY MENU (${scps.length})`}
          <span className="toggle-icon">▼</span>
        </button>
      </div>

      <div className={`nav-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="nav-drawer-inner">
          <div className="nav-drawer-content">
            <span className="nav-section-label">Documented Entites</span>
            <div className="links">
              {scps.length === 0 && (
                <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                  No subjects on record.
                </span>
              )}
              {scps.map((scp) => (
                <Link
                  key={scp.id}
                  to={`/scp/${scp.id}`}
                  onClick={() => setIsOpen(false)}
                  title={`Class: ${scp.class || 'Unknown'}`}
                >
                  {scp.item}
                </Link>
              ))}
            </div>

            <span className="nav-section-label" style={{ marginTop: '14px' }}>Administration</span>
            <div className="links">
              <Link
                className="admin-link"
                to="/admin"
                onClick={() => setIsOpen(false)}
              >
                ⚙ Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
