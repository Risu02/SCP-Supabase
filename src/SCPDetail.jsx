import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from './supabase'

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

export default function SCPDetail() {
  const { id } = useParams()
  const [scpDetail, setScpDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScpDetails = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('scp_subjects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching SCP detail:', error.message)
        setLoading(false)
        return
      }

      setScpDetail(data)
      setLoading(false)
    }

    fetchScpDetails()
  }, [id])

  if (loading) {
    return (
      <div className="detail-card">
        <div className="loading">Retrieving classified file…</div>
      </div>
    )
  }

  if (!scpDetail) {
    return (
      <div className="detail-card">
        <p style={{ color: 'var(--red)', textAlign: 'center', padding: '40px 0' }}>
          ⚠ Record not found or access denied.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--green)', textDecoration: 'none', fontSize: '0.85rem' }}>
            ← Return to Index
          </Link>
        </div>
      </div>
    )
  }

  const classKey = getClassKey(scpDetail.class)

  return (
    <section className="detail-card">
      {/* Document header */}
      <div className="doc-header">
        <div>
          <h1 className="cursor">{scpDetail.item}</h1>
          <span className={`class-badge class-${classKey}`}>
            Object Class: {scpDetail.class || 'UNCLASSIFIED'}
          </span>
        </div>
        <div className="doc-meta">
          <div>FILE ID: SCP-{String(scpDetail.id).padStart(3, '0')}</div>
          <div>CLEARANCE: LEVEL 3</div>
          <div>STATUS: CONTAINED</div>
        </div>
      </div>

      {/* Image or placeholder */}
      {scpDetail.image ? (
        <img
          className="detail-image"
          src={scpDetail.image}
          alt={scpDetail.item}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="scp-image-placeholder" style={{ maxHeight: '260px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>[ IMAGE REDACTED ]</span>
        </div>
      )}

      <h3>Special Containment Procedures</h3>
      <p>{scpDetail.containment}</p>

      <h3>Description</h3>
      <p>{scpDetail.description}</p>

      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <Link
          to="/"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
          }}
        >
          ← Back to Menu
        </Link>
      </div>
    </section>
  )
}
