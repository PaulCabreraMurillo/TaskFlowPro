
function ProyectoTarjeta({
  proyecto,
  iniciarEdicion,
  manejarEliminar,
  guardando,
  eliminandoId
}) {
  return (
    <div className="tarjeta">
      <h3>{proyecto.nombre}</h3>

      <p>{proyecto.descripcion}</p>

      <span className={`estado ${proyecto.estado}`}>
        {proyecto.estado}
      </span>

      <div className="acciones-tarjeta">
        <button
          type="button"
          className="boton-editar"
          onClick={() => iniciarEdicion(proyecto)}
          disabled={guardando || eliminandoId !== null}
        >
          Editar
        </button>

        <button
          type="button"
          className="boton-eliminar"
          onClick={() => manejarEliminar(proyecto)}
          disabled={guardando || eliminandoId !== null}
        >
          {eliminandoId === proyecto.id
            ? 'Eliminando...'
            : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}

export default ProyectoTarjeta;
