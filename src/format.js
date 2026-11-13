export function formatMoney(valor, moneda) {
  const n = Number(valor) || 0
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
