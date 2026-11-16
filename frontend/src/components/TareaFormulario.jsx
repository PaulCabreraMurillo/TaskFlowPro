
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
  cancelarEdicion,
  responsables = [],
  cargandoResponsables = false,
  errorResponsables = ''
}) {
  const responsableSeleccionadoId =
    formulario.responsableId === null ||
    formulario.responsableId === undefined
      ? ''
      : String(formulario.responsableId);

  const responsableSeleccionado = responsables.find(
    (responsable) =>
      String(responsable.id) === responsableSeleccionadoId
  );

  const responsablesActivos = responsables.filter(
    (responsable) => responsable.activo === true
  );

  const responsableInactivoSeleccionado =
    responsableSeleccionado &&
    responsableSeleccionado.activo !== true;

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
            disabled={guardando}
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
            disabled={guardando}
          />
        </div>

        <div className="campo">
          <label htmlFor="estadoTarea">Estado</label>
          <select
            id="estadoTarea"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
            disabled={guardando}
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
            disabled={guardando}
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
            disabled={guardando}
          />
        </div>

        <div className="campo">
          <label htmlFor="responsableTarea">
            Responsable asignado
          </label>

          <select
            id="responsableTarea"
            name="responsableId"
            value={responsableSeleccionadoId}
            onChange={manejarCambio}
            disabled={
              guardando ||
              cargandoResponsables ||
              Boolean(errorResponsables)
            }
          >
            {responsableSeleccionadoId === '' && (
              <option value="">
                Sin responsable asignado
              </option>
            )}

            {responsableInactivoSeleccionado && (
              <option
                value={responsableSeleccionadoId}
              >
                {responsableSeleccionado.nombre}
                {' (inactivo - asignación existente)'}
              </option>
            )}

            {responsablesActivos.map((responsable) => (
              <option
                key={responsable.id}
                value={String(responsable.id)}
              >
                {responsable.nombre}
              </option>
            ))}
          </select>

          {cargandoResponsables && (
            <small>Cargando responsables...</small>
          )}

          {errorResponsables && (
            <small role="alert">
              Error al cargar responsables:
              {' '}{errorResponsables}
            </small>
          )}

          {!cargandoResponsables &&
            !errorResponsables &&
            responsablesActivos.length === 0 && (
              <small>
                No hay responsables activos disponibles.
              </small>
            )}

          {responsableInactivoSeleccionado && (
            <small>
              Este responsable está inactivo.
              Puedes conservar la asignación actual
              o seleccionar otro responsable activo.
            </small>
          )}
        </div>

        <div className="acciones-formulario">
          <button
            type="submit"
            disabled={guardando}
          >
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
