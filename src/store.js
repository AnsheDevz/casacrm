import { useEffect, useReducer } from 'react'
import { SEED } from './data.js'

const KEY = 'casacrm:v1'

export const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // si el JSON está roto, arrancamos con los datos de demo
  }
  return SEED
}

// Un único reducer concentra todas las reglas de negocio de los datos.
function reducer(state, action) {
  switch (action.type) {
    case 'property/save': {
      const p = action.payload
      const exists = state.properties.some((x) => x.id === p.id)
      return {
        ...state,
        properties: exists
          ? state.properties.map((x) => (x.id === p.id ? p : x))
          : [p, ...state.properties],
      }
    }
    case 'property/delete':
      return {
        properties: state.properties.filter((p) => p.id !== action.id),
        // al borrar una propiedad, se quita de los interesados que la tenían
        leads: state.leads.map((l) => ({
          ...l,
          propiedadesIds: l.propiedadesIds.filter((id) => id !== action.id),
        })),
      }
    case 'lead/save': {
      const l = action.payload
      const exists = state.leads.some((x) => x.id === l.id)
      return {
        ...state,
        leads: exists ? state.leads.map((x) => (x.id === l.id ? l : x)) : [l, ...state.leads],
      }
    }
    case 'lead/delete':
      return { ...state, leads: state.leads.filter((l) => l.id !== action.id) }
    case 'lead/move':
      return {
        ...state,
        leads: state.leads.map((l) => (l.id === action.id ? { ...l, etapa: action.etapa } : l)),
      }
    case 'reset':
      return SEED
    default:
      return state
  }
}

export function useStore() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // almacenamiento lleno o bloqueado: la app sigue funcionando en memoria
    }
  }, [state])
  return [state, dispatch]
}
