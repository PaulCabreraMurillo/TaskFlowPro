
import { useEffect, useState } from "react";

import {
  obtenerResponsables,
  crearResponsable,
  actualizarResponsable,
} from "../services/responsableService";

const FORMULARIO_INICIAL = {
  nombre: "",
  correo: "",
  activo: true,
};

export default function ResponsablesPanel() {
  const [responsables, setResponsables] = useState([]);
  const [formulario, setFormulario] = useState({
    ...FORMULARIO_INICIAL,
  });

  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [filtro, setFiltro] = useState("");

  async function cargarResponsables() {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerResponsables();
      setResponsables(datos);
    } catch (err) {
      setError(
        err.message ||
          "No se pudieron cargar los responsables."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarResponsables();
  }, []);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function cancelarEdicion() {
    setFormulario({ ...FORMULARIO_INICIAL });
    setEditandoId(null);
    setError("");
  }

  function editarResponsable(responsable) {
    setFormulario({
      nombre: responsable.nombre,
      correo: responsable.correo || "",
      activo: responsable.activo,
    });

    setEditandoId(responsable.id);
    setMensaje("");
    setError("");
  }

  async function guardarResponsable(evento) {
    evento.preventDefault();

    setError("");
    setMensaje("");

    const datos = {
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim() || null,
      activo: formulario.activo,
    };

    if (!datos.nombre) {
      setError("El nombre es obligatorio.");
      return;
    }

    setGuardando(true);

    try {
      if (editandoId !== null) {
        await actualizarResponsable(editandoId, datos);
      } else {
        await crearResponsable(datos);
      }

      const datosActualizados =
        await obtenerResponsables();

      setResponsables(datosActualizados);

      setMensaje(
        editandoId !== null
          ? "Responsable actualizado correctamente."
          : "Responsable registrado correctamente."
      );

      setFormulario({ ...FORMULARIO_INICIAL });
      setEditandoId(null);
    } catch (err) {
      setError(
        err.message ||
          "No se pudo guardar el responsable."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(responsable) {
    const nuevoEstado = !responsable.activo;

    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      await actualizarResponsable(responsable.id, {
        nombre: responsable.nombre,
        correo: responsable.correo,
        activo: nuevoEstado,
      });

      const datos = await obtenerResponsables();
      setResponsables(datos);

      setMensaje(
        nuevoEstado
          ? "Responsable activado correctamente."
          : "Responsable desactivado correctamente."
      );

      if (editandoId === responsable.id) {
        setFormulario((anterior) => ({
          ...anterior,
          activo: nuevoEstado,
        }));
      }
    } catch (err) {
      setError(
        err.message ||
          "No se pudo cambiar el estado."
      );
    } finally {
      setGuardando(false);
    }
  }

  const responsablesFiltrados = responsables.filter(
    (responsable) => {
      const busqueda = filtro.trim().toLowerCase();

      return (
        responsable.nombre
          .toLowerCase()
          .includes(busqueda) ||
        (responsable.correo || "")
          .toLowerCase()
          .includes(busqueda)
      );
    }
  );

  const activos = responsables.filter(
    (responsable) => responsable.activo
  ).length;

  return (
    <section className="responsables-panel">
      <div className="responsables-encabezado">
        <div>
          <h2>Gestión de responsables</h2>
          <p>
            Registra y administra las personas que
            podrán recibir tareas.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarResponsables}
          disabled={cargando || guardando}
        >
          Actualizar
        </button>
      </div>

      <div className="responsables-indicadores">
        <div className="responsables-indicador">
          <strong>{responsables.length}</strong>
          <span>Total</span>
        </div>

        <div className="responsables-indicador">
          <strong>{activos}</strong>
          <span>Activos</span>
        </div>

        <div className="responsables-indicador">
          <strong>
            {responsables.length - activos}
          </strong>
          <span>Inactivos</span>
        </div>
      </div>

      {error && (
        <p className="responsables-error" role="alert">
          {error}
        </p>
      )}

      {mensaje && (
        <p
          className="responsables-exito"
          role="status"
        >
          {mensaje}
        </p>
      )}

      <form
        className="responsables-formulario"
        onSubmit={guardarResponsable}
      >
        <h3>
          {editandoId !== null
            ? "Editar responsable"
            : "Registrar responsable"}
        </h3>

        <label htmlFor="responsable-nombre">
          Nombre completo
        </label>

        <input
          id="responsable-nombre"
          name="nombre"
          type="text"
          value={formulario.nombre}
          onChange={actualizarCampo}
          maxLength={120}
          required
          disabled={guardando}
          placeholder="Nombre del responsable"
        />

        <label htmlFor="responsable-correo">
          Correo electrónico
        </label>

        <input
          id="responsable-correo"
          name="correo"
          type="email"
          value={formulario.correo}
          onChange={actualizarCampo}
          maxLength={150}
          disabled={guardando}
          placeholder="correo@empresa.com"
        />

        <label
          className="responsables-checkbox"
          htmlFor="responsable-activo"
        >
          <input
            id="responsable-activo"
            type="checkbox"
            checked={formulario.activo}
            onChange={(evento) =>
              setFormulario((anterior) => ({
                ...anterior,
                activo: evento.target.checked,
              }))
            }
            disabled={guardando}
          />

          Responsable activo
        </label>

        <div className="responsables-acciones">
          <button
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : editandoId !== null
                ? "Guardar cambios"
                : "Registrar responsable"}
          </button>

          {editandoId !== null && (
            <button
              type="button"
              onClick={cancelarEdicion}
              disabled={guardando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="responsables-listado">
        <div className="responsables-listado-encabezado">
          <h3>Responsables registrados</h3>

          <input
            type="search"
            value={filtro}
            onChange={(evento) =>
              setFiltro(evento.target.value)
            }
            placeholder="Buscar por nombre o correo"
            aria-label="Buscar responsables"
          />
        </div>

        {cargando ? (
          <p>Cargando responsables...</p>
        ) : responsablesFiltrados.length === 0 ? (
          <p>No se encontraron responsables.</p>
        ) : (
          <div className="responsables-tarjetas">
            {responsablesFiltrados.map(
              (responsable) => (
                <article
                  key={responsable.id}
                  className="responsable-tarjeta"
                >
                  <div>
                    <h4>{responsable.nombre}</h4>

                    <p>
                      {responsable.correo ||
                        "Sin correo registrado"}
                    </p>

                    <span
                      className={
                        responsable.activo
                          ? "responsable-estado activo"
                          : "responsable-estado inactivo"
                      }
                    >
                      {responsable.activo
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </div>

                  <div className="responsable-botones">
                    <button
                      type="button"
                      onClick={() =>
                        editarResponsable(responsable)
                      }
                      disabled={guardando}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarEstado(responsable)
                      }
                      disabled={guardando}
                    >
                      {responsable.activo
                        ? "Desactivar"
                        : "Activar"}
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
