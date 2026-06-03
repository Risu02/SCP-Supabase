import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' // Added Link import
import { supabase } from './supabase'

const CLASS_OPTIONS = ['Safe', 'Euclid', 'Keter', 'Thaumiel', 'Apollyon', 'Neutralized']

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

const emptyRecord = {
  item: '',
  class: '',
  description: '',
  containment: '',
  image: ''
}

export default function AdminPanel() {
  const [scps, setScps] = useState([])
  const [newRecord, setNewRecord] = useState(emptyRecord)
  const [editRecord, setEditRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScps()
  }, [])

  const fetchScps = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('scp_subjects')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching SCP records:', error.message)
      setLoading(false)
      return
    }

    setScps(data || [])
    setLoading(false)
  }

  const addRecord = async (event) => {
    event.preventDefault()

    const { error } = await supabase
      .from('scp_subjects')
      .insert([newRecord])

    if (error) {
      console.error('Error adding SCP record:', error.message)
      return
    }

    setNewRecord(emptyRecord)
    fetchScps()
  }

  const deleteRecord = async (id) => {
    const confirmDelete = window.confirm('CONFIRM: Permanently delete this SCP record?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('scp_subjects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting SCP record:', error.message)
      return
    }

    fetchScps()
  }

  const startEditing = (scp) => {
    setEditRecord({ ...scp })
  }

  const saveEdit = async (event, id) => {
    event.preventDefault()

    const { id: recordId, created_at, ...updatedRecord } = editRecord

    const { error } = await supabase
      .from('scp_subjects')
      .update(updatedRecord)
      .eq('id', id)

    if (error) {
      console.error('Error updating SCP record:', error.message)
      return
    }

    setEditRecord(null)
    fetchScps()
  }

  return (
    <section className="admin-wrapper">
      <div className="admin-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <h1 style={{ textAlign: 'left', marginBottom: 0 }}>Admin Panel</h1>
          <span className="record-count">{scps.length} RECORD{scps.length !== 1 ? 'S' : ''} ON FILE</span>
        </div>
        
        {/* ── Return to Menu Button ── */}
        <Link to="/" className="btn secondary" style={{ textDecoration: 'none' }}>
          ← Return to Menu
        </Link>
      </div>
      <p className="muted" style={{ textAlign: 'left', marginBottom: '28px' }}>
        Manage SCP subject entries — create, update, or expunge records.
      </p>

      {/* ── Add New Record Form ── */}
      <form className="form-card" onSubmit={addRecord}>
        <h2>// New Subject Entry</h2>

        <label htmlFor="new-item">Item Designation</label>
        <input
          id="new-item"
          value={newRecord.item}
          onChange={(e) => setNewRecord({ ...newRecord, item: e.target.value })}
          placeholder="e.g. SCP-173"
          required
        />

        <label htmlFor="new-class">Object Class</label>
        <select
          id="new-class"
          value={newRecord.class}
          onChange={(e) => setNewRecord({ ...newRecord, class: e.target.value })}
          required
        >
          <option value="" disabled>Select class…</option>
          {CLASS_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label htmlFor="new-image">Image URL (optional)</label>
        <input
          id="new-image"
          value={newRecord.image}
          onChange={(e) => setNewRecord({ ...newRecord, image: e.target.value })}
          placeholder="https://…"
        />

        <label htmlFor="new-containment">Special Containment Procedures</label>
        <textarea
          id="new-containment"
          value={newRecord.containment}
          onChange={(e) => setNewRecord({ ...newRecord, containment: e.target.value })}
          placeholder="Describe containment protocols…"
          required
        />

        <label htmlFor="new-description">Description</label>
        <textarea
          id="new-description"
          value={newRecord.description}
          onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
          placeholder="Describe the subject's nature and properties…"
          required
        />

        <div className="button-row">
          <button type="submit" className="btn-amber">+ Add SCP Record</button>
        </div>
      </form>

      {/* ── Records Grid ── */}
      <div className="section-title">Active Records</div>

      {loading ? (
        <div className="loading">Loading records…</div>
      ) : scps.length === 0 ? (
        <p className="muted">No records found. Add a subject above.</p>
      ) : (
        <div className="grid">
          {scps.map((scp) => (
            <article className="card" key={scp.id}>
              {editRecord && editRecord.id === scp.id ? (
                /* ── Edit Form ── */
                <form onSubmit={(event) => saveEdit(event, scp.id)}>
                  <label>Item Designation</label>
                  <input
                    value={editRecord.item}
                    onChange={(e) => setEditRecord({ ...editRecord, item: e.target.value })}
                    required
                  />

                  <label>Object Class</label>
                  <select
                    value={editRecord.class}
                    onChange={(e) => setEditRecord({ ...editRecord, class: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select class…</option>
                    {CLASS_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <label>Image URL</label>
                  <input
                    value={editRecord.image || ''}
                    onChange={(e) => setEditRecord({ ...editRecord, image: e.target.value })}
                    placeholder="https://…"
                  />

                  <label>Containment Procedures</label>
                  <textarea
                    value={editRecord.containment}
                    onChange={(e) => setEditRecord({ ...editRecord, containment: e.target.value })}
                    required
                  />

                  <label>Description</label>
                  <textarea
                    value={editRecord.description}
                    onChange={(e) => setEditRecord({ ...editRecord, description: e.target.value })}
                    required
                  />

                  <div className="button-row">
                    <button type="submit">✓ Save</button>
                    <button type="button" className="secondary" onClick={() => setEditRecord(null)}>✕ Cancel</button>
                  </div>
                </form>
              ) : (
                /* ── View Mode ── */
                <div>
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
                      <span>[ NO IMAGE ]</span>
                    </div>
                  )}

                  <h2>{scp.item}</h2>
                  <span className={`class-badge class-${getClassKey(scp.class)}`}>{scp.class}</span>

                  <p style={{ fontSize: '0.82rem', marginTop: '8px' }}>
                    <strong style={{ color: 'var(--text-muted)' }}>CONTAINMENT: </strong>
                    {scp.containment?.slice(0, 120)}{scp.containment?.length > 120 ? '…' : ''}
                  </p>

                  <div className="button-row">
                    <button onClick={() => startEditing(scp)}>Edit</button>
                    <button className="danger" onClick={() => deleteRecord(scp.id)}>Expunge</button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}