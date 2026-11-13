import { useState } from 'react'
import { useStore } from './store.js'
import { Dashboard, LeadsView, PropertiesView } from './views.jsx'
import { LeadForm, PropertyDetail, PropertyForm } from './components.jsx'

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'propiedades', label: 'Propiedades' },
  { id: 'interesados', label: 'Interesados' },
]

export default function App() {
  const [state, dispatch] = useStore()
  const [tab, setTab] = useState('resumen')
  // modal: { kind: 'property' | 'lead' | 'detail', item?: object } | null
  const [modal, setModal] = useState(null)
  const close = () => setModal(null)

  function saveProperty(property) {
    dispatch({ type: 'property/save', payload: property })
    close()
  }
  function deleteProperty(p) {
    if (window.confirm(`¿Eliminar "${p.titulo}"? Se quitará también de los interesados vinculados.`)) {
      dispatch({ type: 'property/delete', id: p.id })
      close()
    }
  }
  function saveLead(lead) {
    dispatch({ type: 'lead/save', payload: lead })
    close()
  }
  function exportJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'casacrm-datos.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  function resetDemo() {
    if (window.confirm('Se restauran los datos de ejemplo y se pierden los cambios. ¿Continuar?')) {
      dispatch({ type: 'reset' })
    }
  }

  const detailProperty = modal?.kind === 'detail' ? state.properties.find((p) => p.id === modal.item) : null

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">⌂</span>
          <span className="brand__name">CasaCRM</span>
        </div>
        <nav aria-label="Secciones">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav__item ${tab === t.id ? 'is-active' : ''}`}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="side__foot">
          <button className="btn btn--ghost btn--sm" onClick={exportJson}>Exportar datos</button>
          <button className="btn btn--ghost btn--sm" onClick={resetDemo}>Restaurar demo</button>
          <p className="muted">Los datos se guardan en tu navegador.</p>
        </div>
      </aside>

      <main className="main">
        <header className="main__head">
          <h1>{TABS.find((t) => t.id === tab).label}</h1>
        </header>

        {tab === 'resumen' && <Dashboard properties={state.properties} leads={state.leads} goto={setTab} />}
        {tab === 'propiedades' && (
          <PropertiesView
            properties={state.properties}
            leads={state.leads}
            onNew={() => setModal({ kind: 'property' })}
            onEdit={(p) => setModal({ kind: 'property', item: p })}
            onOpen={(id) => setModal({ kind: 'detail', item: id })}
          />
        )}
        {tab === 'interesados' && (
          <LeadsView
            leads={state.leads}
            properties={state.properties}
            dispatch={dispatch}
            onNew={() => setModal({ kind: 'lead' })}
            onEdit={(l) => setModal({ kind: 'lead', item: l })}
          />
        )}
      </main>

      {modal?.kind === 'property' && (
        <PropertyForm initial={modal.item} onSave={saveProperty} onDelete={deleteProperty} onClose={close} />
      )}
      {modal?.kind === 'lead' && (
        <LeadForm initial={modal.item} properties={state.properties} onSave={saveLead} onClose={close} />
      )}
      {detailProperty && (
        <PropertyDetail
          property={detailProperty}
          leads={state.leads}
          onEdit={(p) => setModal({ kind: 'property', item: p })}
          onClose={close}
        />
      )}
    </div>
  )
}
