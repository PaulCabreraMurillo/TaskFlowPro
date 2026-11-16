
function ProyectoFormulario({
  formulario,
  editandoId,
  guardando,
  eliminandoId,
  manejarCambio,
  manejarSubmit,
  cancelarEdicion
}) {
  return (
    <section className="formulario-seccion">
      <h2>
        {editandoId !== null
          ? 'Editar proyecto'
          : 'Nuevo proyecto'}
      </h2>

      <form onSubmit={manejarSubmit}>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            maxLength={150}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            maxLength={1000}
            rows={3}
          />
        </div>

        <div className="campo">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
          >
            <option value="ACTIVO">Activo</option>
            <option value="EN_PROGRESO">En progreso</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>

        <div className="acciones-formulario">
          <button
            type="submit"
            disabled={guardando || eliminandoId !== null}
          >
            {guardando
              ? 'Guardando...'
              : editandoId !== null
                ? 'Guardar cambios'
                : 'Guardar proyecto'}
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

export default ProyectoFormulario;
