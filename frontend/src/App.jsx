
import { useEffect, useState } from 'react';

import {
  obtenerProyectos,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} from './services/proyectoService';

import ProyectoFormulario from './components/ProyectoFormulario';
import ProyectoFiltros from './components/ProyectoFiltros';
import ProyectoTarjeta from './components/ProyectoTarjeta';

import './App.css';

const formularioInicial = {
  nombre: '',
  descripcion: '',
  estado: 'ACTIVO'
};

function App() {
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

      setMensaje('Proyecto eliminado correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEliminandoId(null);
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

  return (
    <div className="app">
      <header className="header">
        <h1>TaskFlow Pro</h1>
        <p>Gestión inteligente de proyectos</p>
      </header>

      <main className="contenido">
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
                <ProyectoTarjeta
                  key={proyecto.id}
                  proyecto={proyecto}
                  iniciarEdicion={iniciarEdicion}
                  manejarEliminar={manejarEliminar}
                  guardando={guardando}
                  eliminandoId={eliminandoId}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
