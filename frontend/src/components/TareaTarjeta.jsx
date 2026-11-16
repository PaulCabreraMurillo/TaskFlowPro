
import {
  obtenerEstadoVencimiento,
  formatearFecha
} from '../utils/vencimientoUtils';

const nombresEstado = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  FINALIZADA: 'Finalizada'
};

function TareaTarjeta({
  tarea,
  iniciarEdicion,
  manejarEliminar,
  eliminandoId,
  guardando
}) {
  const vencimiento = obtenerEstadoVencimiento(tarea);

  return (
    <article className="tarjeta tarea-tarjeta">
      <div className="tarea-encabezado">
        <h3>{tarea.titulo}</h3>

        <span
          className={`prioridad prioridad-${tarea.prioridad}`}
        >
          {tarea.prioridad}
        </span>
      </div>

      <p>{tarea.descripcion || 'Sin descripción'}</p>

      <div className="tarea-detalles">
        <span className={`estado ${tarea.estado}`}>
          {nombresEstado[tarea.estado] || tarea.estado}
        </span>

        <span>
          Fecha límite: {formatearFecha(tarea.fechaVencimiento)}
        </span>

        <span
          className={`alerta-vencimiento alerta-${vencimiento.codigo}`}
        >
          {vencimiento.texto}
        </span>
      </div>

      <div className="acciones-tarjeta">
        <button
          type="button"
          className="boton-editar"
          onClick={() => iniciarEdicion(tarea)}
          disabled={guardando || eliminandoId !== null}
        >
          Editar
        </button>

        <button
          type="button"
          className="boton-eliminar"
          onClick={() => manejarEliminar(tarea)}
          disabled={guardando || eliminandoId !== null}
        >
          {eliminandoId === tarea.id
            ? 'Eliminando...'
            : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}

export default TareaTarjeta;
