
import { useState } from 'react';

import TareaResumen from './TareaResumen';

import {
  obtenerNombreResponsable,
  coincideFiltroResponsable
} from '../utils/responsableUtils';

import { actualizarTarea } from '../services/tareaService';

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
  { codigo: 'PENDIENTE', titulo: 'Pendientes' },
  { codigo: 'EN_PROGRESO', titulo: 'En progreso' },
  { codigo: 'FINALIZADA', titulo: 'Finalizadas' }
];


function TarjetaTablero({
  tarea,
  nombreProyecto,
  responsables,
  abrirTarea,
  cargando,
  vistaKanban,
  cambiarEstado,
  guardandoTareaId,
  iniciarArrastre,
  terminarArrastre,
  tareaArrastradaId
}) {
  const alerta = obtenerEstadoVencimiento(tarea);
  const guardando = guardandoTareaId === tarea.id;

  const arrastrando = tareaArrastradaId === tarea.id;

  const bloqueada =
    cargando || guardandoTareaId !== null;

  return (
    <article
      className={
        `tarjeta tarjeta-tablero ` +
        `tarjeta-vencimiento-${alerta.codigo} ` +
        (arrastrando ? 'tarjeta-arrastrando' : '')
      }
      draggable={vistaKanban && !bloqueada}
      onDragStart={(evento) => {
        if (vistaKanban && !bloqueada) {
          iniciarArrastre(evento, tarea);
        }
      }}
      onDragEnd={terminarArrastre}
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

      
<p className="responsable-tarea">
  <strong>Responsable:</strong>{' '}
  {obtenerNombreResponsable(tarea, responsables)}
</p>


      <p>{tarea.descripcion || 'Sin descripción'}</p>

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

      {vistaKanban && (
        <>
          <p className="kanban-instruccion">
            Arrastra esta tarjeta a otra columna.
          </p>

          <div className="kanban-cambiar-estado">
            <label htmlFor={`estado-tarea-${tarea.id}`}>
              Cambiar estado
            </label>

            <select
              id={`estado-tarea-${tarea.id}`}
              value={tarea.estado}
              onChange={(evento) =>
                cambiarEstado(tarea, evento.target.value)
              }
              disabled={bloqueada}
              onDragStart={(evento) =>
                evento.stopPropagation()
              }
            >
              {COLUMNAS_KANBAN.map((columna) => (
                <option
                  key={columna.codigo}
                  value={columna.codigo}
                >
                  {NOMBRES_ESTADO[columna.codigo]}
                </option>
              ))}
            </select>

            {guardando && (
              <span
                className="kanban-guardando"
                role="status"
              >
                Guardando cambio...
              </span>
            )}
          </div>
        </>
      )}

      <div className="acciones-tarjeta">
        <button
          type="button"
          className="boton-tareas"
          onClick={() => abrirTarea(tarea)}
          disabled={
            bloqueada ||
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
  responsables = [],
  cargando,
  error,
  recargar,
  abrirTarea
}) {

  const [busqueda, setBusqueda] = useState('');
  const [proyectoId, setProyectoId] = useState('TODOS');
  const [estado, setEstado] = useState('TODOS');
  const [prioridad, setPrioridad] = useState('TODAS');
  const [responsableId, setResponsableId] = useState('TODOS');
  const [vencimiento, setVencimiento] = useState('TODOS');
  const [ordenamiento, setOrdenamiento] = useState('FECHA');

  const [vistaTablero, setVistaTablero] =
    useState('LISTA');

  const [guardandoTareaId, setGuardandoTareaId] =
    useState(null);

  const [mensajeEstado, setMensajeEstado] = useState('');
  const [errorEstado, setErrorEstado] = useState('');

  const [tareaArrastradaId, setTareaArrastradaId] =
    useState(null);

  const [columnaDestino, setColumnaDestino] =
    useState(null);

  const nombresProyectos = new Map(
    proyectos.map((proyecto) => [
      proyecto.id,
      proyecto.nombre
    ])
  );

  async function cambiarEstado(tarea, nuevoEstado) {
    if (
      guardandoTareaId !== null ||
      cargando ||
      tarea.estado === nuevoEstado
    ) {
      return;
    }

    if (!NOMBRES_ESTADO[nuevoEstado]) {
      setErrorEstado('Estado de tarea no válido.');
      return;
    }

    setGuardandoTareaId(tarea.id);
    setMensajeEstado('');
    setErrorEstado('');

    try {
      const datos = {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || '',
        estado: nuevoEstado,
        prioridad: tarea.prioridad,
        fechaVencimiento:
          tarea.fechaVencimiento || null,
        proyectoId: tarea.proyectoId
      };

      await actualizarTarea(tarea.id, datos);

      // Recargar las tareas desde la API.
      await recargar();

      setMensajeEstado(
        `La tarea "${tarea.titulo}" cambió a ` +
        `"${NOMBRES_ESTADO[nuevoEstado]}".`
      );
    } catch (err) {
      setErrorEstado(
        err.message ||
        'No se pudo actualizar la tarea.'
      );
    } finally {
      setGuardandoTareaId(null);
    }
  }

  function iniciarArrastre(evento, tarea) {
    if (guardandoTareaId !== null || cargando) {
      evento.preventDefault();
      return;
    }

    evento.dataTransfer.effectAllowed = 'move';

    evento.dataTransfer.setData(
      'text/plain',
      String(tarea.id)
    );

    setTareaArrastradaId(tarea.id);
    setMensajeEstado('');
    setErrorEstado('');
  }

  function terminarArrastre() {
    setTareaArrastradaId(null);
    setColumnaDestino(null);
  }

  function permitirSoltar(evento, codigoColumna) {
    if (
      tareaArrastradaId === null ||
      guardandoTareaId !== null ||
      cargando
    ) {
      return;
    }

    evento.preventDefault();
    evento.dataTransfer.dropEffect = 'move';

    setColumnaDestino(codigoColumna);
  }

  async function soltarTarea(evento, nuevoEstado) {
    evento.preventDefault();

    const idTexto =
      evento.dataTransfer.getData('text/plain');

    const id = Number(idTexto);

    setTareaArrastradaId(null);
    setColumnaDestino(null);

    if (
      !Number.isSafeInteger(id) ||
      guardandoTareaId !== null ||
      cargando
    ) {
      return;
    }

    const tarea = tareas.find(
      (item) => item.id === id
    );

    if (!tarea || tarea.estado === nuevoEstado) {
      return;
    }

    await cambiarEstado(tarea, nuevoEstado);
  }

  const tareasFiltradas = tareas.filter((tarea) => {
    const nombreProyecto =
      nombresProyectos.get(tarea.proyectoId) || '';

    
const nombreResponsable =
  obtenerNombreResponsable(tarea, responsables);


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
    .includes(texto) ||
  nombreResponsable
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
    
    
const coincideResponsable =
  coincideFiltroResponsable(
    tarea,
    responsableId
  );
       

    
return (
  coincideBusqueda &&
  coincideProyecto &&
  coincideEstado &&
  coincidePrioridad &&
  coincideVencimiento &&
  coincideResponsable
);

  });

  const tareasOrdenadas = [...tareasFiltradas].sort(
    (a, b) => {
      if (ordenamiento === 'PRIORIDAD') {
        const diferencia =
          (VALOR_PRIORIDAD[b.prioridad] || 0) -
          (VALOR_PRIORIDAD[a.prioridad] || 0);

        if (diferencia !== 0) return diferencia;
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

          if (diferencia !== 0) return diferencia;
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
    setResponsableId('TODOS');
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
        responsables={responsables}
        abrirTarea={abrirTarea}
        cargando={cargando}
        vistaKanban={vistaTablero === 'KANBAN'}
        cambiarEstado={cambiarEstado}
        guardandoTareaId={guardandoTareaId}
        iniciarArrastre={iniciarArrastre}
        terminarArrastre={terminarArrastre}
        tareaArrastradaId={tareaArrastradaId}
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
          disabled={cargando || guardandoTareaId !== null}
        >
          {cargando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          Error: {error}
        </p>
      )}

      {errorEstado && (
        <p className="mensaje-error" role="alert">
          Error: {errorEstado}
        </p>
      )}

      {mensajeEstado && (
        <p className="mensaje-exito" role="status">
          {mensajeEstado}
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
  aria-label="Filtrar por responsable"
  value={responsableId}
  onChange={(evento) =>
    setResponsableId(evento.target.value)
  }
>
  <option value="TODOS">
    Todos los responsables
  </option>

  <option value="SIN_RESPONSABLE">
    Sin responsable
  </option>

  {responsables.map((responsable) => (
    <option
      key={responsable.id}
      value={String(responsable.id)}
    >
      {responsable.nombre}
      {responsable.activo ? '' : ' (inactivo)'}
    </option>
  ))}
</select>


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
                disabled={guardandoTareaId !== null}
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
                disabled={guardandoTareaId !== null}
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

                const resaltada =
                  columnaDestino === columna.codigo &&
                  tareaArrastradaId !== null;

                return (
                  <section
                    key={columna.codigo}
                    className={
                      `kanban-columna ` +
                      `kanban-${columna.codigo} ` +
                      (resaltada
                        ? 'kanban-columna-destino'
                        : '')
                    }
                    onDragOver={(evento) =>
                      permitirSoltar(
                        evento,
                        columna.codigo
                      )
                    }
                    onDragLeave={(evento) => {
                      if (
                        !evento.currentTarget.contains(
                          evento.relatedTarget
                        )
                      ) {
                        setColumnaDestino(null);
                      }
                    }}
                    onDrop={(evento) =>
                      soltarTarea(
                        evento,
                        columna.codigo
                      )
                    }
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
                          Arrastra una tarea aquí.
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
