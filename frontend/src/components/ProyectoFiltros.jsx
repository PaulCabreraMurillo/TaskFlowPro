
function ProyectoFiltros({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  total,
  mostrados
}) {
  return (
    <>
      <div className="barra-filtros">
        <input
          type="search"
          placeholder="Buscar proyectos..."
          aria-label="Buscar proyectos"
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />

        <select
          aria-label="Filtrar por estado"
          value={filtroEstado}
          onChange={(evento) =>
            setFiltroEstado(evento.target.value)
          }
        >
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="EN_PROGRESO">En progreso</option>
          <option value="FINALIZADO">Finalizados</option>
        </select>
      </div>

      <p className="contador-proyectos">
        Mostrando {mostrados} de {total} proyectos
      </p>
    </>
  );
}

export default ProyectoFiltros;
