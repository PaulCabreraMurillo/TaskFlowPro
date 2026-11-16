
import TareaTarjeta from './TareaTarjeta';

function TareaLista({
  tareas,
  filtroEstado,
  setFiltroEstado,
  filtroPrioridad,
  setFiltroPrioridad,
  iniciarEdicion,
  manejarEliminar,
  eliminandoId,
  guardando
}) {
  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideEstado =
      filtroEstado === 'TODOS' ||
      tarea.estado === filtroEstado;

    const coincidePrioridad =
      filtroPrioridad === 'TODAS' ||
      tarea.prioridad === filtroPrioridad;

    return coincideEstado && coincidePrioridad;
  });

  return (
    <section>
      <h3>Tareas registradas</h3>

      <div className="barra-filtros">
        <select
          aria-label="Filtrar tareas por estado"
          value={filtroEstado}
          onChange={(evento) =>
            setFiltroEstado(evento.target.value)
          }
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="EN_PROGRESO">En progreso</option>
          <option value="FINALIZADA">Finalizadas</option>
        </select>

        <select
          aria-label="Filtrar tareas por prioridad"
          value={filtroPrioridad}
          onChange={(evento) =>
            setFiltroPrioridad(evento.target.value)
          }
        >
          <option value="TODAS">Todas las prioridades</option>
          <option value="BAJA">Baja</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
        </select>
      </div>

      <p className="contador-proyectos">
        Mostrando {tareasFiltradas.length} de {tareas.length} tareas.
      </p>

      {tareas.length === 0 ? (
        <p className="sin-resultados">
          Este proyecto todavía no tiene tareas.
        </p>
      ) : tareasFiltradas.length === 0 ? (
        <p className="sin-resultados">
          No hay tareas con los filtros seleccionados.
        </p>
      ) : (
        <div className="proyectos">
          {tareasFiltradas.map((tarea) => (
            <TareaTarjeta
              key={tarea.id}
              tarea={tarea}
              iniciarEdicion={iniciarEdicion}
              manejarEliminar={manejarEliminar}
              eliminandoId={eliminandoId}
              guardando={guardando}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TareaLista;
