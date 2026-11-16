
import { useEffect, useState } from 'react';

import {
  obtenerProyectos,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} from './services/proyectoService';

import {
  obtenerTareasPorProyecto,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  obtenerTareas
} from './services/tareaService';

import ProyectoFormulario from './components/ProyectoFormulario';
import ProyectoFiltros from './components/ProyectoFiltros';
import ProyectoTarjeta from './components/ProyectoTarjeta';


import TareaFormulario from './components/TareaFormulario';
import TareaLista from './components/TareaLista';
import TareaResumen from './components/TareaResumen';

import './App.css';

import TableroGeneral from './components/TableroGeneral';
import ResponsablesPanel from './components/ResponsablesPanel';
import { obtenerResponsables } from './services/responsableService';

const formularioInicial = {
  nombre: '',
  descripcion: '',
  estado: 'ACTIVO'
};


const tareaInicial = {
  titulo: '',
  descripcion: '',
  estado: 'PENDIENTE',
  prioridad: 'MEDIA',
  fechaVencimiento: '',
  responsableId: ''
};


function App() {
  const [vistaActual, setVistaActual] = useState('PROYECTOS');

  const [responsables, setResponsables] = useState([]);
  const [cargandoResponsables, setCargandoResponsables] =
    useState(false);
  const [errorResponsables, setErrorResponsables] =
    useState('');

  const [tareaPendienteAbrir, setTareaPendienteAbrir] = useState(null);

  const [tareasGenerales, setTareasGenerales] = useState([]);
  const [cargandoTablero, setCargandoTablero] = useState(false);
  const [errorTablero, setErrorTablero] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [formulario, setFormulario] = useState(formularioInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);

  // Estados del módulo de tareas
  const [proyectoSeleccionadoId, setProyectoSeleccionadoId] =
    useState(null);

  const [tareas, setTareas] = useState([]);
  const [cargandoTareas, setCargandoTareas] = useState(false);
  const [errorTareas, setErrorTareas] = useState('');
  const [mensajeTareas, setMensajeTareas] = useState('');

  const [formularioTarea, setFormularioTarea] =
    useState({ ...tareaInicial });

  const [editandoTareaId, setEditandoTareaId] = useState(null);
  const [guardandoTarea, setGuardandoTarea] = useState(false);
  const [eliminandoTareaId, setEliminandoTareaId] =
    useState(null);

  const [filtroEstadoTarea, setFiltroEstadoTarea] =
    useState('TODOS');

  const [filtroPrioridadTarea, setFiltroPrioridadTarea] =
    useState('TODAS');


  useEffect(() => {
    let activo = true;

    async function cargarResponsables() {
      setCargandoResponsables(true);
      setErrorResponsables('');

      try {
        const datos = await obtenerResponsables();

        if (activo) {
          setResponsables(datos);
        }
      } catch (err) {
        if (activo) {
          setErrorResponsables(err.message);
        }
      } finally {
        if (activo) {
          setCargandoResponsables(false);
        }
      }
    }

    cargarResponsables();

    return () => {
      activo = false;
    };
  }, []);

  

  useEffect(() => {
    async function cargarProyectos() {
      try {
        const datos = await obtenerProyectos();
        setProyectos(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarProyectos();
  }, []);

  // Cargar tareas cuando cambia el proyecto seleccionado
  useEffect(() => {
    if (proyectoSeleccionadoId === null) {
      setTareas([]);
      setCargandoTareas(false);
      return;
    }

    let activo = true;

    async function cargarTareas() {
      setCargandoTareas(true);
      setErrorTareas('');
      setTareas([]);

      try {
        const datos = await obtenerTareasPorProyecto(
          proyectoSeleccionadoId
        );

        if (activo) {
          setTareas(datos);
        }
      } catch (err) {
        if (activo) {
          setErrorTareas(err.message);
          setTareaPendienteAbrir(null);
        }
      } finally {
        if (activo) {
          setCargandoTareas(false);
        }
      }
    }

    cargarTareas();

    return () => {
      activo = false;
    };
  }, [proyectoSeleccionadoId]);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  function iniciarEdicion(proyecto) {
    setEditandoId(proyecto.id);

    setFormulario({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion || '',
      estado: proyecto.estado
    });

    setError('');
    setMensaje('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario({ ...formularioInicial });
    setError('');
    setMensaje('');
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    setError('');
    setMensaje('');

    if (!formulario.nombre.trim()) {
      setError('El nombre del proyecto es obligatorio.');
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        estado: formulario.estado
      };

      if (editandoId !== null) {
        const actualizado = await actualizarProyecto(
          editandoId,
          datos
        );

        setProyectos((anteriores) =>
          anteriores.map((proyecto) =>
            proyecto.id === editandoId
              ? actualizado
              : proyecto
          )
        );

        setMensaje('Proyecto actualizado correctamente.');
      } else {
        const nuevo = await crearProyecto(datos);

        setProyectos((anteriores) => [
          ...anteriores,
          nuevo
        ]);

        setMensaje('Proyecto creado correctamente.');
      }

      setFormulario({ ...formularioInicial });
      setEditandoId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function manejarEliminar(proyecto) {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar "${proyecto.nombre}"?`
    );

    if (!confirmado) return;

    setError('');
    setMensaje('');
    setEliminandoId(proyecto.id);

    try {
      await eliminarProyecto(proyecto.id);

      setProyectos((anteriores) =>
        anteriores.filter((item) => item.id !== proyecto.id)
      );

      if (editandoId === proyecto.id) {
        setEditandoId(null);
        setFormulario({ ...formularioInicial });
      }

      if (proyectoSeleccionadoId === proyecto.id) {
        setProyectoSeleccionadoId(null);
        setTareas([]);
        setFormularioTarea({ ...tareaInicial });
        setEditandoTareaId(null);
      }

      setMensaje('Proyecto eliminado correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEliminandoId(null);
    }
  }

  // Seleccionar proyecto para administrar sus tareas
  function abrirTareaDesdeTablero(tarea) {
    const existeProyecto = proyectos.some(
      (proyecto) => proyecto.id === tarea.proyectoId
    );

    if (!existeProyecto) {
      window.alert('No se encontró el proyecto de esta tarea.');
      return;
    }

    setTareaPendienteAbrir({ id: tarea.id, proyectoId: tarea.proyectoId });
    seleccionarProyecto(tarea.proyectoId);
    setVistaActual('PROYECTOS');
  }

  function seleccionarProyecto(id) {
    setProyectoSeleccionadoId(id);
    if (id === null) setTareaPendienteAbrir(null);
    setFormularioTarea({ ...tareaInicial });
    setEditandoTareaId(null);
    setErrorTareas('');
    setMensajeTareas('');
    setFiltroEstadoTarea('TODOS');
    setFiltroPrioridadTarea('TODAS');
  }

  // Abrir el formulario de edición cuando se cargue la tarea seleccionada.
  useEffect(() => {
    if (!tareaPendienteAbrir || cargandoTareas || errorTareas) return;
    if (proyectoSeleccionadoId !== tareaPendienteAbrir.proyectoId) return;

    const tarea = tareas.find((item) => item.id === tareaPendienteAbrir.id);
    if (!tarea) return;

    setEditandoTareaId(tarea.id);
    
setFormularioTarea({
  titulo: tarea.titulo,
  descripcion: tarea.descripcion || '',
  estado: tarea.estado,
  prioridad: tarea.prioridad,
  fechaVencimiento: tarea.fechaVencimiento || '',
  responsableId:
    tarea.responsableId != null
      ? String(tarea.responsableId)
      : ''
});

    setTareaPendienteAbrir(null);

    // La sección de tareas está debajo del listado de proyectos.
    window.requestAnimationFrame(() => {
      document.getElementById('modulo-tareas')?.scrollIntoView({
        behavior: 'smooth', block: 'start'
      });
    });
  }, [tareaPendienteAbrir, tareas, cargandoTareas, errorTareas, proyectoSeleccionadoId]);

  function manejarCambioTarea(evento) {
    const { name, value } = evento.target;

    setFormularioTarea((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  function iniciarEdicionTarea(tarea) {
    setEditandoTareaId(tarea.id);

    
setFormularioTarea({
  titulo: tarea.titulo,
  descripcion: tarea.descripcion || '',
  estado: tarea.estado,
  prioridad: tarea.prioridad,
  fechaVencimiento: tarea.fechaVencimiento || '',
  responsableId:
    tarea.responsableId != null
      ? String(tarea.responsableId)
      : ''
});


    setErrorTareas('');
    setMensajeTareas('');
  }

  function cancelarEdicionTarea() {
    setEditandoTareaId(null);
    setFormularioTarea({ ...tareaInicial });
    setErrorTareas('');
    setMensajeTareas('');
  }

  async function manejarSubmitTarea(evento) {
    evento.preventDefault();

    if (proyectoSeleccionadoId === null) return;

    setErrorTareas('');
    setMensajeTareas('');

    if (!formularioTarea.titulo.trim()) {
      setErrorTareas('El título de la tarea es obligatorio.');
      return;
    }

    setGuardandoTarea(true);

    try {
      
const datos = {
  titulo: formularioTarea.titulo.trim(),
  descripcion: formularioTarea.descripcion.trim(),
  estado: formularioTarea.estado,
  prioridad: formularioTarea.prioridad,
  fechaVencimiento:
    formularioTarea.fechaVencimiento || null,
  proyectoId: proyectoSeleccionadoId
};

if (formularioTarea.responsableId !== '') {
  datos.responsableId = Number(
    formularioTarea.responsableId
  );
}


      if (editandoTareaId !== null) {
        const actualizada = await actualizarTarea(
          editandoTareaId,
          datos
        );

        setTareas((anteriores) =>
          anteriores.map((tarea) =>
            tarea.id === editandoTareaId
              ? actualizada
              : tarea
          )
        );

        setMensajeTareas('Tarea actualizada correctamente.');
      } else {
        const nueva = await crearTarea(datos);

        setTareas((anteriores) => [
          ...anteriores,
          nueva
        ]);

        setMensajeTareas('Tarea creada correctamente.');
      }

      setFormularioTarea({ ...tareaInicial });
      setEditandoTareaId(null);
    } catch (err) {
      setErrorTareas(err.message);
    } finally {
      setGuardandoTarea(false);
    }
  }

  async function manejarEliminarTarea(tarea) {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar la tarea "${tarea.titulo}"?`
    );

    if (!confirmado) return;

    setErrorTareas('');
    setMensajeTareas('');
    setEliminandoTareaId(tarea.id);

    try {
      await eliminarTarea(tarea.id);

      setTareas((anteriores) =>
        anteriores.filter((item) => item.id !== tarea.id)
      );

      if (editandoTareaId === tarea.id) {
        setEditandoTareaId(null);
        setFormularioTarea({ ...tareaInicial });
      }

      setMensajeTareas('Tarea eliminada correctamente.');
    } catch (err) {
      setErrorTareas(err.message);
    } finally {
      setEliminandoTareaId(null);
    }
  }

  const proyectosFiltrados = proyectos.filter((proyecto) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideBusqueda =
      (proyecto.nombre || '').toLowerCase().includes(texto) ||
      (proyecto.descripcion || '').toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === 'TODOS' ||
      proyecto.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const proyectoSeleccionado = proyectos.find(
    (proyecto) => proyecto.id === proyectoSeleccionadoId
  );

  async function cargarTablero() {
    setCargandoTablero(true);
    setErrorTablero('');

    try {
      const datos = await obtenerTareas();
      setTareasGenerales(datos);
    } catch (err) {
      setErrorTablero(err.message);
    } finally {
      setCargandoTablero(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>TaskFlow Pro</h1>
        <p>Gestión inteligente de proyectos</p>
      </header>

      <main className="contenido">
        <nav className="navegacion-principal" aria-label="Navegación principal">
          <button
            type="button"
            className={vistaActual === 'PROYECTOS' ? 'activo' : ''}
            
onClick={async () => {
  setVistaActual('PROYECTOS');
  setCargandoResponsables(true);
  setErrorResponsables('');

  try {
    const datos = await obtenerResponsables();
    setResponsables(datos);
  } catch (err) {
    setErrorResponsables(err.message);
  } finally {
    setCargandoResponsables(false);
  }
}}

          >
            Proyectos
          </button>

          <button
            type="button"
            className={vistaActual === 'TABLERO' ? 'activo' : ''}
            
onClick={async () => {
  setVistaActual('TABLERO');
  cargarTablero();

  setCargandoResponsables(true);
  setErrorResponsables('');

  try {
    const datos = await obtenerResponsables();
    setResponsables(datos);
  } catch (err) {
    setErrorResponsables(err.message);
  } finally {
    setCargandoResponsables(false);
  }
}}

          >
            Panel general
          </button>

          <button
            type="button"
            className={
              vistaActual === 'RESPONSABLES' ? 'activo' : ''
            }
            onClick={() => setVistaActual('RESPONSABLES')}
          >
            Responsables
          </button>

        {vistaActual === 'RESPONSABLES' && (
          <ResponsablesPanel />
        )}


        </nav>

        {vistaActual === 'TABLERO' && (
          <TableroGeneral
            proyectos={proyectos}
            tareas={tareasGenerales}
            cargando={cargandoTablero}
            error={errorTablero}
            recargar={cargarTablero}
            abrirTarea={abrirTareaDesdeTablero}
            responsables={responsables}
          />
        )}

        {vistaActual === 'PROYECTOS' && (
          <>
            <ProyectoFormulario
          formulario={formulario}
          editandoId={editandoId}
          guardando={guardando}
          eliminandoId={eliminandoId}
          manejarCambio={manejarCambio}
          manejarSubmit={manejarSubmit}
          cancelarEdicion={cancelarEdicion}
        />

        {mensaje && (
          <p className="mensaje-exito" role="status">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="mensaje-error" role="alert">
            Error: {error}
          </p>
        )}

        <section>
          <h2>Mis proyectos</h2>
          <p>Proyectos registrados en PostgreSQL.</p>

          <ProyectoFiltros
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            total={proyectos.length}
            mostrados={proyectosFiltrados.length}
          />

          {cargando && <p>Cargando proyectos...</p>}

          {!cargando && !error && proyectos.length === 0 && (
            <p>No hay proyectos registrados.</p>
          )}

          {!cargando &&
            !error &&
            proyectos.length > 0 &&
            proyectosFiltrados.length === 0 && (
              <p className="sin-resultados">
                No se encontraron proyectos con los filtros seleccionados.
              </p>
            )}

          {!cargando && proyectosFiltrados.length > 0 && (
            <div className="proyectos">
              {proyectosFiltrados.map((proyecto) => (
                <div key={proyecto.id}>
                  <ProyectoTarjeta
                    proyecto={proyecto}
                    iniciarEdicion={iniciarEdicion}
                    manejarEliminar={manejarEliminar}
                    guardando={guardando}
                    eliminandoId={eliminandoId}
                  />

                  <button
                    type="button"
                    className="boton-tareas"
                    onClick={() =>
                      seleccionarProyecto(proyecto.id)
                    }
                  >
                    Ver tareas
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {proyectoSeleccionado && (
          <section className="modulo-tareas" id="modulo-tareas">
            <div className="modulo-tareas-encabezado">
              <div>
                <h2>
                  Tareas de: {proyectoSeleccionado.nombre}
                </h2>
                <p>
                  Administra las tareas de este proyecto.
                </p>
              </div>

              <button
                type="button"
                className="boton-cerrar-tareas"
                onClick={() => seleccionarProyecto(null)}
              >
                Cerrar
              </button>
            </div>

            {mensajeTareas && (
              <p className="mensaje-exito" role="status">
                {mensajeTareas}
              </p>
            )}

            {errorTareas && (
              <p className="mensaje-error" role="alert">
                Error: {errorTareas}
              </p>
            )}
            {!cargandoTareas && !errorTareas && (
              <TareaResumen tareas={tareas} />
            )}

            
<TareaFormulario
  formulario={formularioTarea}
  editandoId={editandoTareaId}
  guardando={guardandoTarea}
  manejarCambio={manejarCambioTarea}
  manejarSubmit={manejarSubmitTarea}
  cancelarEdicion={cancelarEdicionTarea}
  responsables={responsables}
  cargandoResponsables={cargandoResponsables}
  errorResponsables={errorResponsables}
/>


            {cargandoTareas ? (
              <p>Cargando tareas...</p>
            ) : !errorTareas ? (
              <TareaLista
                tareas={tareas}
                filtroEstado={filtroEstadoTarea}
                setFiltroEstado={setFiltroEstadoTarea}
                filtroPrioridad={filtroPrioridadTarea}
                setFiltroPrioridad={setFiltroPrioridadTarea}
                iniciarEdicion={iniciarEdicionTarea}
                manejarEliminar={manejarEliminarTarea}
                eliminandoId={eliminandoTareaId}
                guardando={guardandoTarea}
                responsables={responsables}
              />
            ) : null}
          </section>
        )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
