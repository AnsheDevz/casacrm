// Datos de demostración. Son ficticios: nombres, teléfonos y precios inventados.
export const TIPOS = ['Departamento', 'Casa', 'PH', 'Local', 'Terreno']
export const OPERACIONES = ['Venta', 'Alquiler']
export const ESTADOS = ['Disponible', 'Reservada', 'Cerrada']
export const ETAPAS = ['Nuevo', 'Contactado', 'Visita agendada', 'Negociación', 'Cerrado']
export const MONEDAS = ['USD', 'ARS']

const hace = (dias) => new Date(Date.now() - dias * 86400000).toISOString()

export const SEED = {
  properties: [
    { id: 'p1', titulo: 'Luminoso 3 ambientes con balcón', tipo: 'Departamento', operacion: 'Venta', precio: 142000, moneda: 'USD', barrio: 'Palermo', ambientes: 3, m2: 68, estado: 'Disponible', notas: 'Piso 6, contrafrente, cochera opcional.', creada: hace(2) },
    { id: 'p2', titulo: 'Monoambiente a estrenar', tipo: 'Departamento', operacion: 'Alquiler', precio: 520000, moneda: 'ARS', barrio: 'Microcentro', ambientes: 1, m2: 32, estado: 'Disponible', notas: 'Contrato 24 meses. Expensas aparte.', creada: hace(4) },
    { id: 'p3', titulo: 'Casa con jardín y parrilla', tipo: 'Casa', operacion: 'Venta', precio: 235000, moneda: 'USD', barrio: 'Villa Urquiza', ambientes: 5, m2: 190, estado: 'Reservada', notas: 'Lote de 8,66 x 30. Apta crédito.', creada: hace(9) },
    { id: 'p4', titulo: 'PH reciclado con terraza', tipo: 'PH', operacion: 'Venta', precio: 118000, moneda: 'USD', barrio: 'Caballito', ambientes: 3, m2: 74, estado: 'Disponible', notas: 'Terraza propia de 25 m². Sin expensas.', creada: hace(12) },
    { id: 'p5', titulo: '2 ambientes cerca del subte', tipo: 'Departamento', operacion: 'Alquiler', precio: 690000, moneda: 'ARS', barrio: 'Almagro', ambientes: 2, m2: 44, estado: 'Disponible', notas: 'Acepta mascotas pequeñas.', creada: hace(15) },
    { id: 'p6', titulo: 'Local sobre avenida', tipo: 'Local', operacion: 'Alquiler', precio: 1450000, moneda: 'ARS', barrio: 'Belgrano', ambientes: 2, m2: 60, estado: 'Disponible', notas: 'Vidriera de 5 metros. Habilitado gastronomía.', creada: hace(18) },
    { id: 'p7', titulo: 'Terreno en esquina', tipo: 'Terreno', operacion: 'Venta', precio: 98000, moneda: 'USD', barrio: 'Saavedra', ambientes: 0, m2: 260, estado: 'Disponible', notas: 'FOT 2.4. Documentación al día.', creada: hace(21) },
    { id: 'p8', titulo: '4 ambientes con cochera', tipo: 'Departamento', operacion: 'Venta', precio: 189000, moneda: 'USD', barrio: 'Recoleta', ambientes: 4, m2: 112, estado: 'Cerrada', notas: 'Operación cerrada el mes pasado.', creada: hace(40) },
  ],
  leads: [
    { id: 'l1', nombre: 'Camila Rodríguez', telefono: '11 5555-0101', email: 'camila@example.com', presupuesto: 150000, moneda: 'USD', etapa: 'Visita agendada', propiedadesIds: ['p1', 'p4'], notas: 'Busca para vivir. Visita el sábado 11 hs.', creada: hace(3) },
    { id: 'l2', nombre: 'Martín Gómez', telefono: '11 5555-0102', email: 'martin@example.com', presupuesto: 600000, moneda: 'ARS', etapa: 'Contactado', propiedadesIds: ['p2', 'p5'], notas: 'Se muda por trabajo. Necesita garantía propietaria.', creada: hace(5) },
    { id: 'l3', nombre: 'Lucía Fernández', telefono: '11 5555-0103', email: 'lucia@example.com', presupuesto: 240000, moneda: 'USD', etapa: 'Negociación', propiedadesIds: ['p3'], notas: 'Ofreció USD 228.000. Espera respuesta del dueño.', creada: hace(10) },
    { id: 'l4', nombre: 'Tomás Álvarez', telefono: '11 5555-0104', email: 'tomas@example.com', presupuesto: 120000, moneda: 'USD', etapa: 'Nuevo', propiedadesIds: ['p4'], notas: 'Consulta por mail. Llamar mañana.', creada: hace(1) },
    { id: 'l5', nombre: 'Sofía Herrera', telefono: '11 5555-0105', email: 'sofia@example.com', presupuesto: 1500000, moneda: 'ARS', etapa: 'Visita agendada', propiedadesIds: ['p6'], notas: 'Quiere abrir una cafetería.', creada: hace(6) },
    { id: 'l6', nombre: 'Julián Castro', telefono: '11 5555-0106', email: 'julian@example.com', presupuesto: 190000, moneda: 'USD', etapa: 'Cerrado', propiedadesIds: ['p8'], notas: 'Escrituró.', creada: hace(35) },
    { id: 'l7', nombre: 'Valentina Ruiz', telefono: '11 5555-0107', email: 'valen@example.com', presupuesto: 100000, moneda: 'USD', etapa: 'Contactado', propiedadesIds: ['p7'], notas: 'Quiere construir. Pidió planos del FOT.', creada: hace(7) },
  ],
}
