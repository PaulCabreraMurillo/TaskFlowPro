
import { useEffect, useState } from 'react';

import {
  obtenerProyectos,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} from './services/proyectoService';

import './App.css';

const formularioInicial = {
  nombre: '',
  descripcion: '',
  estado: 'ACTIVO'
};

function App() {
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

    if (!confirmado) {
      return;
    }

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

  return (
    <div className="app">
      <header className="header">
        <h1>TaskFlow Pro</h1>
        <p>Gestión inteligente de proyectos</p>
      </header>

      <main className="contenido">
        <section className="formulario-seccion">
          <h2>
            {editandoId !== null
              ? 'Editar proyecto'
              : 'Nuevo proyecto'}
          </h2>

          <form onSubmit={manejarSubmit}>
            <div className="campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                maxLength={150}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                maxLength={1000}
                rows={3}
              />
            </div>

            <div className="campo">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formulario.estado}
                onChange={manejarCambio}
              >
                <option value="ACTIVO">Activo</option>
                <option value="EN_PROGRESO">En progreso</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>

            <div className="acciones-formulario">
              <button type="submit" disabled={guardando}>
                {guardando
                  ? 'Guardando...'
                  : editandoId !== null
                    ? 'Guardar cambios'
                    : 'Guardar proyecto'}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  className="boton-cancelar"
                  onClick={cancelarEdicion}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

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

          {cargando && <p>Cargando proyectos...</p>}

          {!cargando && !error && proyectos.length === 0 && (
            <p>No hay proyectos registrados.</p>
          )}

          {!cargando && proyectos.length > 0 && (
            <div className="proyectos">
              {proyectos.map((proyecto) => (
                <div className="tarjeta" key={proyecto.id}>
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
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
