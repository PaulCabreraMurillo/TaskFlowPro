
import { useState } from 'react';

import TareaResumen from './TareaResumen';

import {
  obtenerEstadoVencimiento,
  formatearFecha
} from '../utils/vencimientoUtils';

function TableroGeneral({
  proyectos,
  tareas,
  cargando,
  error,
  recargar,
  abrirTarea
}) {
  const [busqueda, setBusqueda] = useState('');
  const [proyectoId, setProyectoId] = useState('TODOS');
  const [estado, setEstado] = useState('TODOS');
  const [prioridad, setPrioridad] = useState('TODAS');
  const [vencimiento, setVencimiento] = useState('TODOS');

  const nombresProyectos = new Map(
    proyectos.map((proyecto) => [
      proyecto.id,
      proyecto.nombre
    ])
  );

  const tareasFiltradas = tareas.filter((tarea) => {
    const nombreProyecto =
      nombresProyectos.get(tarea.proyectoId) || '';

    const texto = busqueda.trim().toLowerCase();

    const coincideBusqueda =
      (tarea.titulo || '').toLowerCase().includes(texto) ||
      (tarea.descripcion || '')
        .toLowerCase()
        .includes(texto) ||
      nombreProyecto.toLowerCase().includes(texto);

    const coincideProyecto =
      proyectoId === 'TODOS' ||
      String(tarea.proyectoId) === proyectoId;

    const coincideEstado =
      estado === 'TODOS' ||
      tarea.estado === estado;

    const coincidePrioridad =
      prioridad === 'TODAS' ||
      tarea.prioridad === prioridad;

    const coincideVencimiento =
      vencimiento === 'TODOS' ||
      obtenerEstadoVencimiento(tarea).codigo === vencimiento;

    return (
      coincideBusqueda &&
      coincideProyecto &&
      coincideEstado &&
      coincidePrioridad &&
      coincideVencimiento
    );
  });

  function limpiarFiltros() {
    setBusqueda('');
    setProyectoId('TODOS');
    setEstado('TODOS');
    setPrioridad('TODAS');
    setVencimiento('TODOS');
  }

  return (
    <section className="tablero-general">
      <div className="tablero-encabezado">
        <div>
          <h2>Panel general</h2>
          <p>
            Consulta las tareas de todos tus proyectos.
          </p>
        </div>

        <button
          type="button"
          className="boton-tareas"
          onClick={recargar}
          disabled={cargando}
        >
          {cargando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          Error: {error}
        </p>
      )}

      {cargando ? (
        <p>Cargando tablero...</p>
      ) : (
        <>
          {/* Indicadores generales */}
          <TareaResumen tareas={tareas} />

          {/* Filtros */}
          <div className="filtros-tablero">
            <input
              type="text"
              aria-label="Buscar tareas"
              placeholder="Buscar tarea o proyecto..."
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
            />

            <select
              aria-label="Filtrar por proyecto"
              value={proyectoId}
              onChange={(evento) =>
                setProyectoId(evento.target.value)
              }
            >
              <option value="TODOS">
                Todos los proyectos
              </option>

              {proyectos.map((proyecto) => (
                <option
                  key={proyecto.id}
                  value={String(proyecto.id)}
                >
                  {proyecto.nombre}
                </option>
              ))}
            </select>

            <select
              aria-label="Filtrar por estado"
              value={estado}
              onChange={(evento) =>
                setEstado(evento.target.value)
              }
            >
              <option value="TODOS">
                Todos los estados
              </option>
              <option value="PENDIENTE">
                Pendiente
              </option>
              <option value="EN_PROGRESO">
                En progreso
              </option>
              <option value="FINALIZADA">
                Finalizada
              </option>
            </select>

            <select
              aria-label="Filtrar por prioridad"
              value={prioridad}
              onChange={(evento) =>
                setPrioridad(evento.target.value)
              }
            >
              <option value="TODAS">
                Todas las prioridades
              </option>
              <option value="BAJA">
                Baja
              </option>
              <option value="MEDIA">
                Media
              </option>
              <option value="ALTA">
                Alta
              </option>
            </select>

            <select
              aria-label="Filtrar por vencimiento"
              value={vencimiento}
              onChange={(evento) =>
                setVencimiento(evento.target.value)
              }
            >
              <option value="TODOS">
                Todos los vencimientos
              </option>
              <option value="VENCIDA">
                Vencidas
              </option>
              <option value="PROXIMA">
                Próximas a vencer
              </option>
              <option value="AL_DIA">
                Al día
              </option>
              <option value="SIN_FECHA">
                Sin fecha
              </option>
              <option value="FINALIZADA">
                Finalizadas
              </option>
            </select>

            <button
              type="button"
              className="boton-cancelar"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>

          {/* Contador de resultados */}
          <p className="contador-proyectos">
            Mostrando {tareasFiltradas.length} de{' '}
            {tareas.length} tareas.
          </p>

          {/* Listado de tareas */}
          {tareasFiltradas.length === 0 ? (
            <p className="sin-resultados">
              No se encontraron tareas.
            </p>
          ) : (
            <div className="proyectos">
              {tareasFiltradas.map((tarea) => {
                const alerta =
                  obtenerEstadoVencimiento(tarea);

                const nombreProyecto =
                  nombresProyectos.get(tarea.proyectoId) ||
                  'Proyecto no encontrado';

                return (
                  <article
                    className="tarjeta"
                    key={tarea.id}
                  >
                    <h3>{tarea.titulo}</h3>

                    <p className="nombre-proyecto-tarea">
                      Proyecto: {nombreProyecto}
                    </p>

                    <p>
                      {tarea.descripcion ||
                        'Sin descripción'}
                    </p>

                    <div className="tarea-detalles">
                      <span
                        className={`estado ${tarea.estado}`}
                      >
                        {tarea.estado === 'EN_PROGRESO'
                          ? 'En progreso'
                          : tarea.estado === 'FINALIZADA'
                            ? 'Finalizada'
                            : 'Pendiente'}
                      </span>

                      <span
                        className={`prioridad prioridad-${tarea.prioridad}`}
                      >
                        Prioridad: {tarea.prioridad}
                      </span>

                      <span>
                        Vence:{' '}
                        {formatearFecha(
                          tarea.fechaVencimiento
                        )}
                      </span>

                      <span
                        className={`alerta-vencimiento alerta-${alerta.codigo}`}
                      >
                        {alerta.texto}
                      </span>
                    </div>

                    {/* Navegación directa a la tarea */}
                    <div className="acciones-tarjeta">
                      <button
                        type="button"
                        className="boton-tareas"
                        onClick={() => abrirTarea(tarea)}
                        disabled={
                          cargando ||
                          typeof abrirTarea !== 'function'
                        }
                      >
                        Abrir tarea
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default TableroGeneral;
