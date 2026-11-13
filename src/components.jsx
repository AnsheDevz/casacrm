import { useEffect, useState } from 'react'
import { ESTADOS, ETAPAS, MONEDAS, OPERACIONES, TIPOS } from './data.js'
import { formatDate, formatMoney, slug } from './format.js'
import { newId } from './store.js'

/* ---------- Piezas básicas ---------- */

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal__head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field__error">{error}</small>}
    </label>
  )
}

export function Chip({ children, tone = 'neutral' }) {
  return <span className={`chip chip--${tone}`}>{children}</span>
}

const estadoTone = { Disponible: 'ok', Reservada: 'warn', Cerrada: 'muted' }
const etapaTone = {
  Nuevo: 'info',
  Contactado: 'neutral',
  'Visita agendada': 'warn',
  Negociación: 'accent',
  Cerrado: 'ok',
}
export const toneEstado = (e) => estadoTone[e] ?? 'neutral'
export const toneEtapa = (e) => etapaTone[e] ?? 'neutral'

/* Dibujo simple por tipo de propiedad (SVG propio, sin librerías) */
function Glyph({ tipo }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' }
  const shapes = {
    Departamento: (
      <>
        <rect x="14" y="10" width="36" height="46" rx="2" {...common} />
        <path d="M22 20h6M36 20h6M22 30h6M36 30h6M22 40h6M36 40h6M28 56V48h8v8" {...common} />
      </>
    ),
    Casa: (
      <>
        <path d="M8 30 32 10l24 20" {...common} />
        <path d="M14 26v28h36V26M27 54V40h10v14" {...common} />
      </>
    ),
    PH: (
      <>
        <path d="M10 56h44M14 56V28l18-14 18 14v28" {...common} />
        <path d="M24 38h16M24 46h16" {...common} />
      </>
    ),
    Local: (
      <>
        <path d="M10 22h44l-4-10H14l-4 10Zm4 0v32h36V22" {...common} />
        <path d="M26 54V38h12v16" {...common} />
      </>
    ),
    Terreno: (
      <>
        <path d="M6 50 22 30l10 12 10-16 16 24Z" {...common} />
        <path d="M6 56h52" {...common} />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="glyph">
      {shapes[tipo] ?? shapes.Departamento}
    </svg>
  )
}

/* ---------- Tarjetas ---------- */

export function PropertyCard({ p, interesados, onOpen, onEdit }) {
  return (
    <article className={`card prop prop--${slug(p.tipo)}`}>
      <button className="prop__visual" onClick={() => onOpen(p.id)} aria-label={`Ver detalle de ${p.titulo}`}>
        <Glyph tipo={p.tipo} />
        <span className="prop__ops">
          <Chip tone={p.operacion === 'Venta' ? 'accent' : 'info'}>{p.operacion}</Chip>
          <Chip tone={toneEstado(p.estado)}>{p.estado}</Chip>
        </span>
      </button>
      <div className="prop__body">
        <h3 className="prop__title">{p.titulo}</h3>
        <p className="prop__where">
          {p.tipo} · {p.barrio}
        </p>
        <p className="prop__specs">
          {p.ambientes > 0 && <span>{p.ambientes} amb.</span>}
          <span>{p.m2} m²</span>
        </p>
        <p className="prop__price">
          {formatMoney(p.precio, p.moneda)}
          {p.operacion === 'Alquiler' && <small> /mes</small>}
        </p>
      </div>
      <footer className="prop__foot">
        <span className="muted">
          {interesados} {interesados === 1 ? 'interesado' : 'interesados'}
        </span>
        <button className="btn btn--ghost btn--sm" onClick={() => onEdit(p)}>
          Editar
        </button>
      </footer>
    </article>
  )
}

export function LeadCard({ lead, properties, onMove, onEdit, onDelete }) {
  const props = properties.filter((p) => lead.propiedadesIds.includes(p.id))
  return (
    <article className="card lead">
      <header className="lead__head">
        <h3>{lead.nombre}</h3>
        <button className="icon-btn" onClick={() => onEdit(lead)} aria-label={`Editar a ${lead.nombre}`}>
          ✎
        </button>
      </header>
      <p className="muted">
        {lead.telefono}
        {lead.email && <> · {lead.email}</>}
      </p>
      <p className="lead__budget">Presupuesto: {lead.presupuesto > 0 ? formatMoney(lead.presupuesto, lead.moneda) : "a definir"}</p>
      {props.length > 0 && (
        <ul className="lead__props">
          {props.map((p) => (
            <li key={p.id}>{p.titulo}</li>
          ))}
        </ul>
      )}
      {lead.notas && <p className="lead__notes">{lead.notas}</p>}
      <footer className="lead__foot">
        <label className="lead__move">
          <span className="sr-only">Cambiar etapa de {lead.nombre}</span>
          <select value={lead.etapa} onChange={(e) => onMove(lead.id, e.target.value)}>
            {ETAPAS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>
        <button className="btn btn--danger btn--sm" onClick={() => onDelete(lead)}>
          Eliminar
        </button>
      </footer>
    </article>
  )
}

/* ---------- Formularios ---------- */

const blankProperty = () => ({
  id: newId(),
  titulo: '',
  tipo: TIPOS[0],
  operacion: OPERACIONES[0],
  precio: '',
  moneda: MONEDAS[0],
  barrio: '',
  ambientes: 1,
  m2: '',
  estado: ESTADOS[0],
  notas: '',
  creada: new Date().toISOString(),
})

export function PropertyForm({ initial, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initial ?? blankProperty())
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    const err = {}
    if (!form.titulo.trim()) err.titulo = 'Escribí un título.'
    if (!form.barrio.trim()) err.barrio = 'Indicá el barrio.'
    if (!(Number(form.precio) > 0)) err.precio = 'El precio debe ser mayor a 0.'
    if (!(Number(form.m2) > 0)) err.m2 = 'Indicá los metros cuadrados.'
    setErrors(err)
    if (Object.keys(err).length) return
    onSave({ ...form, precio: Number(form.precio), m2: Number(form.m2), ambientes: Number(form.ambientes) })
  }

  return (
    <Modal title={initial ? 'Editar propiedad' : 'Nueva propiedad'} onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Título" error={errors.titulo}>
          <input value={form.titulo} onChange={set('titulo')} placeholder="Ej: 3 ambientes con balcón" autoFocus />
        </Field>
        <div className="form__row">
          <Field label="Tipo">
            <select value={form.tipo} onChange={set('tipo')}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Operación">
            <select value={form.operacion} onChange={set('operacion')}>
              {OPERACIONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado">
            <select value={form.estado} onChange={set('estado')}>
              {ESTADOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="form__row">
          <Field label="Precio" error={errors.precio}>
            <input type="number" min="0" value={form.precio} onChange={set('precio')} />
          </Field>
          <Field label="Moneda">
            <select value={form.moneda} onChange={set('moneda')}>
              {MONEDAS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Barrio" error={errors.barrio}>
            <input value={form.barrio} onChange={set('barrio')} placeholder="Ej: Palermo" />
          </Field>
        </div>
        <div className="form__row">
          <Field label="Ambientes">
            <input type="number" min="0" value={form.ambientes} onChange={set('ambientes')} />
          </Field>
          <Field label="Superficie (m²)" error={errors.m2}>
            <input type="number" min="0" value={form.m2} onChange={set('m2')} />
          </Field>
        </div>
        <Field label="Notas">
          <textarea rows="3" value={form.notas} onChange={set('notas')} placeholder="Detalles, expensas, condiciones…" />
        </Field>
        <div className="form__actions">
          {initial && (
            <button type="button" className="btn btn--danger" onClick={() => onDelete(initial)}>
              Eliminar
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}

const blankLead = () => ({
  id: newId(),
  nombre: '',
  telefono: '',
  email: '',
  presupuesto: '',
  moneda: MONEDAS[0],
  etapa: ETAPAS[0],
  propiedadesIds: [],
  notas: '',
  creada: new Date().toISOString(),
})

export function LeadForm({ initial, properties, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? blankLead())
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggle = (id) =>
    setForm((f) => ({
      ...f,
      propiedadesIds: f.propiedadesIds.includes(id)
        ? f.propiedadesIds.filter((x) => x !== id)
        : [...f.propiedadesIds, id],
    }))

  function submit(e) {
    e.preventDefault()
    const err = {}
    if (!form.nombre.trim()) err.nombre = 'Escribí el nombre.'
    if (!form.telefono.trim() && !form.email.trim()) err.telefono = 'Cargá un teléfono o un email.'
    setErrors(err)
    if (Object.keys(err).length) return
    onSave({ ...form, presupuesto: Number(form.presupuesto) || 0 })
  }

  return (
    <Modal title={initial ? 'Editar interesado' : 'Nuevo interesado'} onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Nombre y apellido" error={errors.nombre}>
          <input value={form.nombre} onChange={set('nombre')} autoFocus />
        </Field>
        <div className="form__row">
          <Field label="Teléfono" error={errors.telefono}>
            <input value={form.telefono} onChange={set('telefono')} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} />
          </Field>
        </div>
        <div className="form__row">
          <Field label="Presupuesto">
            <input type="number" min="0" value={form.presupuesto} onChange={set('presupuesto')} />
          </Field>
          <Field label="Moneda">
            <select value={form.moneda} onChange={set('moneda')}>
              {MONEDAS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Etapa">
            <select value={form.etapa} onChange={set('etapa')}>
              {ETAPAS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
        </div>
        <fieldset className="picker">
          <legend>Propiedades de interés</legend>
          {properties.length === 0 && <p className="muted">Todavía no cargaste propiedades.</p>}
          {properties.map((p) => (
            <label key={p.id} className="picker__item">
              <input type="checkbox" checked={form.propiedadesIds.includes(p.id)} onChange={() => toggle(p.id)} />
              <span>
                {p.titulo} <small className="muted">· {p.barrio}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <Field label="Notas">
          <textarea rows="3" value={form.notas} onChange={set('notas')} />
        </Field>
        <div className="form__actions">
          <span className="spacer" />
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- Detalle de propiedad ---------- */

export function PropertyDetail({ property, leads, onEdit, onClose }) {
  const interesados = leads.filter((l) => l.propiedadesIds.includes(property.id))
  return (
    <Modal title={property.titulo} onClose={onClose}>
      <div className="detail">
        <div className="detail__chips">
          <Chip tone={property.operacion === 'Venta' ? 'accent' : 'info'}>{property.operacion}</Chip>
          <Chip tone={toneEstado(property.estado)}>{property.estado}</Chip>
          <Chip>{property.tipo}</Chip>
        </div>
        <p className="detail__price">
          {formatMoney(property.precio, property.moneda)}
          {property.operacion === 'Alquiler' && <small> /mes</small>}
        </p>
        <dl className="detail__grid">
          <div><dt>Barrio</dt><dd>{property.barrio}</dd></div>
          <div><dt>Ambientes</dt><dd>{property.ambientes || '—'}</dd></div>
          <div><dt>Superficie</dt><dd>{property.m2} m²</dd></div>
          <div><dt>Publicada</dt><dd>{formatDate(property.creada)}</dd></div>
        </dl>
        {property.notas && <p className="detail__notes">{property.notas}</p>}
        <h3 className="detail__sub">Interesados ({interesados.length})</h3>
        {interesados.length === 0 ? (
          <p className="muted">Nadie consultó por esta propiedad todavía.</p>
        ) : (
          <ul className="detail__leads">
            {interesados.map((l) => (
              <li key={l.id}>
                <span>
                  <strong>{l.nombre}</strong> <span className="muted">· {l.telefono || l.email}</span>
                </span>
                <Chip tone={toneEtapa(l.etapa)}>{l.etapa}</Chip>
              </li>
            ))}
          </ul>
        )}
        <div className="form__actions">
          <span className="spacer" />
          <button className="btn btn--ghost" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn--primary" onClick={() => onEdit(property)}>
            Editar propiedad
          </button>
        </div>
      </div>
    </Modal>
  )
}
