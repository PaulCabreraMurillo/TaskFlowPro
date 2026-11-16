
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

  const [ordenamiento, setOrdenamiento] = useState('FECHA');

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

  const valorPrioridad = {
    ALTA: 3,
    MEDIA: 2,
    BAJA: 1
  };

  const tareasOrdenadas = [...tareasFiltradas].sort((a, b) => {
    if (ordenamiento === 'PRIORIDAD') {
      const diferencia =
        (valorPrioridad[b.prioridad] || 0) -
        (valorPrioridad[a.prioridad] || 0);

      if (diferencia !== 0) return diferencia;
    }

    if (ordenamiento === 'TITULO') {
      return (a.titulo || '').localeCompare(
        b.titulo || '',
        'es',
        { sensitivity: 'base' }
      );
    }

    if (ordenamiento === 'FECHA') {
      // Las tareas sin fecha quedan al final.
      if (!a.fechaVencimiento && !b.fechaVencimiento) {
        return 0;
      }

      if (!a.fechaVencimiento) return 1;
      if (!b.fechaVencimiento) return -1;

      const diferencia = a.fechaVencimiento.localeCompare(
        b.fechaVencimiento
      );

      if (diferencia !== 0) return diferencia;
    }

    // Orden secundario alfabético.
    return (a.titulo || '').localeCompare(
      b.titulo || '',
      'es',
      { sensitivity: 'base' }
    );
  });

  function limpiarFiltros() {
    setBusqueda('');
    setProyectoId('TODOS');
    setEstado('TODOS');
    setPrioridad('TODAS');
    setVencimiento('TODOS');
    setOrdenamiento('FECHA');
  }

  return (
    <section className="tablero-general">
      <div className="tablero-encabezado">
        <div>
          <h2>Panel general</h2>
          <p>
            Consulta, filtra y organiza las tareas de
            todos tus proyectos.
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
          <TareaResumen tareas={tareas} />

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
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
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

            <select
              aria-label="Ordenar tareas"
              value={ordenamiento}
              onChange={(evento) =>
                setOrdenamiento(evento.target.value)
              }
            >
              <option value="FECHA">
                Ordenar: fecha más próxima
              </option>
              <option value="PRIORIDAD">
                Ordenar: prioridad alta primero
              </option>
              <option value="TITULO">
                Ordenar: título A-Z
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

          <p className="contador-proyectos">
            Mostrando {tareasOrdenadas.length} de{' '}
            {tareas.length} tareas.
          </p>

          {tareasOrdenadas.length === 0 ? (
            <p className="sin-resultados">
              No se encontraron tareas con los filtros
              seleccionados.
            </p>
          ) : (
            <div className="proyectos">
              {tareasOrdenadas.map((tarea) => {
                const alerta =
                  obtenerEstadoVencimiento(tarea);

                const nombreProyecto =
                  nombresProyectos.get(tarea.proyectoId) ||
                  'Proyecto no encontrado';

                const nombreEstado =
                  tarea.estado === 'EN_PROGRESO'
                    ? 'En progreso'
                    : tarea.estado === 'FINALIZADA'
                      ? 'Finalizada'
                      : 'Pendiente';

                return (
                  <article
                    key={tarea.id}
                    className={
                      `tarjeta tarjeta-tablero ` +
                      `tarjeta-vencimiento-${alerta.codigo}`
                    }
                  >
                    <div className="tarjeta-tablero-encabezado">
                      <h3>{tarea.titulo}</h3>

                      <span
                        className={
                          `alerta-vencimiento ` +
                          `alerta-${alerta.codigo}`
                        }
                      >
                        {alerta.texto}
                      </span>
                    </div>

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
                        {nombreEstado}
                      </span>

                      <span
                        className={
                          `prioridad ` +
                          `prioridad-${tarea.prioridad}`
                        }
                      >
                        Prioridad: {tarea.prioridad}
                      </span>

                      <span>
                        Fecha límite:{' '}
                        {formatearFecha(
                          tarea.fechaVencimiento
                        )}
                      </span>
                    </div>

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
