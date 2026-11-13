# Notas para explicar CasaCRM en una entrevista

## Arquitectura en una frase
Un estado único `{ properties, leads }` manejado por un reducer (`src/store.js`); los componentes solo leen y despachan acciones.

## Decisiones para poder defender
1. **useReducer en vez de useState suelto**: las reglas de negocio quedan en un solo lugar, es fácil de testear y las acciones tienen nombre (`property/save`, `lead/move`...).
2. **Relación muchos a muchos**: cada interesado guarda `propiedadesIds`. Al borrar una propiedad, el reducer la quita de todos los interesados (integridad referencial a mano).
3. **Save como upsert**: `property/save` actualiza si el id existe y agrega si no; así un solo formulario sirve para alta y edición.
4. **Persistencia**: `useEffect` guarda en `localStorage` ante cada cambio; `load()` tolera JSON roto y cae a los datos de demo.
5. **Filtros derivados con `useMemo`**: no se guardan listas filtradas en el estado, se calculan desde la fuente única.
6. **Validación en el formulario**: título, barrio, precio > 0, m² > 0; en interesados, nombre y al menos un medio de contacto.
7. **Accesibilidad**: modal con `role="dialog"`, cierre con Escape, etiquetas asociadas a cada input, select como alternativa accesible a drag & drop.
8. **Dinero**: `Intl.NumberFormat('es-AR')`, moneda guardada por registro (ARS/USD), nunca se suman monedas distintas.

## Preguntas probables y respuesta corta
- *¿Cómo escalarías esto?* Backend + base de datos (Node/Express o Supabase), autenticación por agente, y reemplazar localStorage por una capa de API.
- *¿Qué mejorarías?* Tests del reducer, drag & drop entre columnas, historial de contactos por interesado, subida de fotos.
- *¿Usaste IA?* Sí, como asistente; entiendo el código y puedo modificarlo.
