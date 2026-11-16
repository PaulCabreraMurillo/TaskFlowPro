
const estados = [
  { valor: 'PENDIENTE', texto: 'Pendiente' },
  { valor: 'EN_PROGRESO', texto: 'En progreso' },
  { valor: 'FINALIZADA', texto: 'Finalizada' }
];

function TareaFormulario({
  formulario,
  editandoId,
  guardando,
  manejarCambio,
  manejarSubmit,
  cancelarEdicion
}) {
  return (
    <section className="formulario-seccion">
      <h3>
        {editandoId !== null
          ? 'Editar tarea'
          : 'Nueva tarea'}
      </h3>

      <form onSubmit={manejarSubmit}>
        <div className="campo">
          <label htmlFor="tituloTarea">Título</label>
          <input
            id="tituloTarea"
            name="titulo"
            value={formulario.titulo}
            onChange={manejarCambio}
            maxLength={150}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="descripcionTarea">
            Descripción
          </label>
          <textarea
            id="descripcionTarea"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            maxLength={1000}
            rows={3}
          />
        </div>

        <div className="campo">
          <label htmlFor="estadoTarea">Estado</label>
          <select
            id="estadoTarea"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
          >
            {estados.map((estado) => (
              <option
                key={estado.valor}
                value={estado.valor}
              >
                {estado.texto}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="prioridadTarea">
            Prioridad
          </label>
          <select
            id="prioridadTarea"
            name="prioridad"
            value={formulario.prioridad}
            onChange={manejarCambio}
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="fechaTarea">
            Fecha de vencimiento
          </label>
          <input
            id="fechaTarea"
            type="date"
            name="fechaVencimiento"
            value={formulario.fechaVencimiento}
            onChange={manejarCambio}
          />
        </div>

        <div className="acciones-formulario">
          <button type="submit" disabled={guardando}>
            {guardando
              ? 'Guardando...'
              : editandoId !== null
                ? 'Actualizar tarea'
                : 'Crear tarea'}
          </button>

          {editandoId !== null && (
            <button
              type="button"
              className="boton-cancelar"
              onClick={cancelarEdicion}
              disabled={guardando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TareaFormulario;
