import { useMemo, useState } from 'react'
import { ESTADOS, ETAPAS, OPERACIONES, TIPOS } from './data.js'
import { formatDate, formatMoney } from './format.js'
import { Chip, LeadCard, PropertyCard, toneEstado } from './components.jsx'

/* ---------- Resumen ---------- */

function Stat({ label, value, hint }) {
  return (
    <div className="card stat">
      <p className="stat__label">{label}</p>
      <p className="stat__value">{value}</p>
      {hint && <p className="stat__hint">{hint}</p>}
    </div>
  )
}

export function Dashboard({ properties, leads, goto }) {
  const disponibles = properties.filter((p) => p.estado === 'Disponible')
  const enVenta = disponibles.filter((p) => p.operacion === 'Venta').length
  const enAlquiler = disponibles.filter((p) => p.operacion === 'Alquiler').length
  const activos = leads.filter((l) => l.etapa !== 'Cerrado')
  const cerradas = properties.filter((p) => p.estado === 'Cerrada').length

  const porEtapa = ETAPAS.map((e) => ({ etapa: e, n: leads.filter((l) => l.etapa === e).length }))
  const max = Math.max(1, ...porEtapa.map((x) => x.n))
  const visitas = leads.filter((l) => l.etapa === 'Visita agendada')
  const recientes = [...properties].sort((a, b) => b.creada.localeCompare(a.creada)).slice(0, 4)

  return (
    <div className="stack">
      <div className="stats">
        <Stat label="Disponibles" value={disponibles.length} hint={`${enVenta} en venta · ${enAlquiler} en alquiler`} />
        <Stat label="Interesados activos" value={activos.length} hint={`${leads.length} en total`} />
        <Stat label="Visitas agendadas" value={visitas.length} hint="Para confirmar esta semana" />
        <Stat label="Operaciones cerradas" value={cerradas} hint="Propiedades con estado Cerrada" />
      </div>

      <div className="grid-2">
        <section className="card panel">
          <h2 className="panel__title">Interesados por etapa</h2>
          <ul className="bars">
            {porEtapa.map(({ etapa, n }) => (
              <li key={etapa}>
                <span className="bars__label">{etapa}</span>
                <span className="bars__track">
                  <span className="bars__fill" style={{ width: `${(n / max) * 100}%` }} />
                </span>
                <span className="bars__n">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card panel">
          <h2 className="panel__title">Próximas visitas</h2>
          {visitas.length === 0 ? (
            <p className="muted">No hay visitas agendadas.</p>
          ) : (
            <ul className="list">
              {visitas.map((l) => (
                <li key={l.id}>
                  <strong>{l.nombre}</strong>
                  <span className="muted">{l.notas || 'Sin notas'}</span>
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn--ghost btn--sm" onClick={() => goto('interesados')}>
            Ver todos los interesados
          </button>
        </section>
      </div>

      <section className="card panel">
        <h2 className="panel__title">Últimas propiedades cargadas</h2>
        <ul className="list list--rows">
          {recientes.map((p) => (
            <li key={p.id}>
              <span>
                <strong>{p.titulo}</strong> <span className="muted">· {p.barrio}</span>
              </span>
              <span className="list__right">
                <Chip tone={toneEstado(p.estado)}>{p.estado}</Chip>
                <span>{formatMoney(p.precio, p.moneda)}</span>
                <span className="muted">{formatDate(p.creada)}</span>
              </span>
            </li>
          ))}
        </ul>
        <button className="btn btn--ghost btn--sm" onClick={() => goto('propiedades')}>
          Ver todas las propiedades
        </button>
      </section>
    </div>
  )
}

/* ---------- Propiedades ---------- */

export function PropertiesView({ properties, leads, onNew, onEdit, onOpen }) {
  const [q, setQ] = useState('')
  const [operacion, setOperacion] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [estado, setEstado] = useState('Todos')
  const [orden, setOrden] = useState('recientes')

  const visibles = useMemo(() => {
    const term = q.trim().toLowerCase()
    const out = properties.filter(
      (p) =>
        (operacion === 'Todas' || p.operacion === operacion) &&
        (tipo === 'Todos' || p.tipo === tipo) &&
        (estado === 'Todos' || p.estado === estado) &&
        (!term || `${p.titulo} ${p.barrio} ${p.notas}`.toLowerCase().includes(term)),
    )
    const sorters = {
      recientes: (a, b) => b.creada.localeCompare(a.creada),
      precio: (a, b) => a.precio - b.precio,
      m2: (a, b) => b.m2 - a.m2,
    }
    return out.sort(sorters[orden])
  }, [properties, q, operacion, tipo, estado, orden])

  const interesadosDe = (id) => leads.filter((l) => l.propiedadesIds.includes(id)).length

  return (
    <div className="stack">
      <div className="toolbar">
        <input
          className="toolbar__search"
          type="search"
          placeholder="Buscar por título, barrio o nota…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar propiedades"
        />
        <select value={operacion} onChange={(e) => setOperacion(e.target.value)} aria-label="Operación">
          <option>Todas</option>
          {OPERACIONES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Tipo">
          <option>Todos</option>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Estado">
          <option>Todos</option>
          {ESTADOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select value={orden} onChange={(e) => setOrden(e.target.value)} aria-label="Ordenar por">
          <option value="recientes">Más recientes</option>
          <option value="precio">Precio (menor a mayor)</option>
          <option value="m2">Superficie (mayor a menor)</option>
        </select>
        <button className="btn btn--primary" onClick={onNew}>
          + Nueva propiedad
        </button>
      </div>

      <p className="muted" role="status">
        {visibles.length} {visibles.length === 1 ? 'propiedad' : 'propiedades'}
      </p>

      {visibles.length === 0 ? (
        <div className="empty">
          <h3>No hay propiedades con esos filtros</h3>
          <p className="muted">Probá cambiar la búsqueda o cargá una propiedad nueva.</p>
        </div>
      ) : (
        <div className="cards">
          {visibles.map((p) => (
            <PropertyCard key={p.id} p={p} interesados={interesadosDe(p.id)} onOpen={onOpen} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Interesados (pipeline) ---------- */

export function LeadsView({ leads, properties, dispatch, onNew, onEdit }) {
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const visibles = leads.filter((l) => !term || `${l.nombre} ${l.email} ${l.telefono} ${l.notas}`.toLowerCase().includes(term))

  function remove(lead) {
    if (window.confirm(`¿Eliminar a ${lead.nombre}? Esta acción no se puede deshacer.`)) {
      dispatch({ type: 'lead/delete', id: lead.id })
    }
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <input
          className="toolbar__search"
          type="search"
          placeholder="Buscar por nombre, contacto o nota…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar interesados"
        />
        <button className="btn btn--primary" onClick={onNew}>
          + Nuevo interesado
        </button>
      </div>

      <div className="pipeline">
        {ETAPAS.map((etapa) => {
          const col = visibles.filter((l) => l.etapa === etapa)
          return (
            <section key={etapa} className="pipeline__col" aria-label={`Etapa ${etapa}`}>
              <h2 className="pipeline__title">
                {etapa} <span className="pipeline__count">{col.length}</span>
              </h2>
              <div className="pipeline__list">
                {col.length === 0 && <p className="muted pipeline__empty">Sin interesados</p>}
                {col.map((l) => (
                  <LeadCard
                    key={l.id}
                    lead={l}
                    properties={properties}
                    onMove={(id, e) => dispatch({ type: 'lead/move', id, etapa: e })}
                    onEdit={onEdit}
                    onDelete={remove}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
