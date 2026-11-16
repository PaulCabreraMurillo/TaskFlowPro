
import { useState } from 'react';

import TareaResumen from './TareaResumen';

import {
  obtenerEstadoVencimiento,
  formatearFecha
} from '../utils/vencimientoUtils';

const NOMBRES_ESTADO = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  FINALIZADA: 'Finalizada'
};

const VALOR_PRIORIDAD = {
  ALTA: 3,
  MEDIA: 2,
  BAJA: 1
};

const COLUMNAS_KANBAN = [
  {
    codigo: 'PENDIENTE',
    titulo: 'Pendientes'
  },
  {
    codigo: 'EN_PROGRESO',
    titulo: 'En progreso'
  },
  {
    codigo: 'FINALIZADA',
    titulo: 'Finalizadas'
  }
];

function TarjetaTablero({
  tarea,
  nombreProyecto,
  abrirTarea,
  cargando
}) {
  const alerta = obtenerEstadoVencimiento(tarea);

  return (
    <article
      className={
        `tarjeta tarjeta-tablero ` +
        `tarjeta-vencimiento-${alerta.codigo}`
      }
    >
      <div className="tarjeta-tablero-encabezado">
        <h3>{tarea.titulo}</h3>

        <span
          className={
            `alerta-vencimiento alerta-${alerta.codigo}`
          }
        >
          {alerta.texto}
        </span>
      </div>

      <p className="nombre-proyecto-tarea">
        Proyecto: {nombreProyecto}
      </p>

      <p>
        {tarea.descripcion || 'Sin descripción'}
      </p>

      <div className="tarea-detalles">
        <span className={`estado ${tarea.estado}`}>
          {NOMBRES_ESTADO[tarea.estado] || tarea.estado}
        </span>

        <span
          className={
            `prioridad prioridad-${tarea.prioridad}`
          }
        >
          Prioridad: {tarea.prioridad}
        </span>

        <span>
          Fecha límite:{' '}
          {formatearFecha(tarea.fechaVencimiento)}
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
}

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

  // Nueva opción de visualización.
  const [vistaTablero, setVistaTablero] = useState('LISTA');

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
      (tarea.titulo || '')
        .toLowerCase()
        .includes(texto) ||
      (tarea.descripcion || '')
        .toLowerCase()
        .includes(texto) ||
      nombreProyecto
        .toLowerCase()
        .includes(texto);

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
      obtenerEstadoVencimiento(tarea).codigo ===
        vencimiento;

    return (
      coincideBusqueda &&
      coincideProyecto &&
      coincideEstado &&
      coincidePrioridad &&
      coincideVencimiento
    );
  });

  const tareasOrdenadas = [...tareasFiltradas].sort(
    (a, b) => {
      if (ordenamiento === 'PRIORIDAD') {
        const diferencia =
          (VALOR_PRIORIDAD[b.prioridad] || 0) -
          (VALOR_PRIORIDAD[a.prioridad] || 0);

        if (diferencia !== 0) {
          return diferencia;
        }
      }

      if (ordenamiento === 'FECHA') {
        if (!a.fechaVencimiento && b.fechaVencimiento) {
          return 1;
        }

        if (a.fechaVencimiento && !b.fechaVencimiento) {
          return -1;
        }

        if (a.fechaVencimiento && b.fechaVencimiento) {
          const diferencia =
            a.fechaVencimiento.localeCompare(
              b.fechaVencimiento
            );

          if (diferencia !== 0) {
            return diferencia;
          }
        }
      }

      return (a.titulo || '').localeCompare(
        b.titulo || '',
        'es',
        { sensitivity: 'base' }
      );
    }
  );

  function limpiarFiltros() {
    setBusqueda('');
    setProyectoId('TODOS');
    setEstado('TODOS');
    setPrioridad('TODAS');
    setVencimiento('TODOS');
    setOrdenamiento('FECHA');
  }

  function renderizarTarjeta(tarea) {
    const nombreProyecto =
      nombresProyectos.get(tarea.proyectoId) ||
      'Proyecto no encontrado';

    return (
      <TarjetaTablero
        key={tarea.id}
        tarea={tarea}
        nombreProyecto={nombreProyecto}
        abrirTarea={abrirTarea}
        cargando={cargando}
      />
    );
  }

  return (
    <section className="tablero-general">
      <div className="tablero-encabezado">
        <div>
          <h2>Panel general</h2>
          <p>
            Consulta y organiza las tareas de todos
            tus proyectos.
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
              <option value="VENCIDA">Vencidas</option>
              <option value="PROXIMA">
                Próximas a vencer
              </option>
              <option value="AL_DIA">Al día</option>
              <option value="SIN_FECHA">Sin fecha</option>
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

          {/* Selector de vista */}
          <div className="selector-vista-tablero">
            <div>
              <strong>Visualización de tareas</strong>
              <p>
                Mostrando {tareasOrdenadas.length} de{' '}
                {tareas.length} tareas.
              </p>
            </div>

            <div
              className="botones-vista-tablero"
              role="group"
              aria-label="Seleccionar vista del tablero"
            >
              <button
                type="button"
                className={
                  vistaTablero === 'LISTA' ? 'activo' : ''
                }
                aria-pressed={vistaTablero === 'LISTA'}
                onClick={() => setVistaTablero('LISTA')}
              >
                Lista
              </button>

              <button
                type="button"
                className={
                  vistaTablero === 'KANBAN' ? 'activo' : ''
                }
                aria-pressed={vistaTablero === 'KANBAN'}
                onClick={() => setVistaTablero('KANBAN')}
              >
                Kanban
              </button>
            </div>
          </div>

          {vistaTablero === 'LISTA' ? (
            tareasOrdenadas.length === 0 ? (
              <p className="sin-resultados">
                No se encontraron tareas con los filtros
                seleccionados.
              </p>
            ) : (
              <div className="proyectos">
                {tareasOrdenadas.map(renderizarTarjeta)}
              </div>
            )
          ) : (
            <div className="kanban-tablero">
              {COLUMNAS_KANBAN.map((columna) => {
                const tareasColumna =
                  tareasOrdenadas.filter(
                    (tarea) =>
                      tarea.estado === columna.codigo
                  );

                return (
                  <section
                    className={
                      `kanban-columna ` +
                      `kanban-${columna.codigo}`
                    }
                    key={columna.codigo}
                  >
                    <div className="kanban-encabezado">
                      <h3>{columna.titulo}</h3>
                      <span className="kanban-contador">
                        {tareasColumna.length}
                      </span>
                    </div>

                    <div className="kanban-contenido">
                      {tareasColumna.length === 0 ? (
                        <p className="kanban-vacio">
                          No hay tareas en este estado.
                        </p>
                      ) : (
                        tareasColumna.map(
                          renderizarTarjeta
                        )
                      )}
                    </div>
                  </section>
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
