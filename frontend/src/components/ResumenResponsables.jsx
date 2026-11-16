
import { useState } from 'react';
import { obtenerEstadoVencimiento } from '../utils/vencimientoUtils';

function calcularIndicadores(tareas) {
  const pendientes = tareas.filter(
    (tarea) => tarea.estado === 'PENDIENTE'
  ).length;

  const enProgreso = tareas.filter(
    (tarea) => tarea.estado === 'EN_PROGRESO'
  ).length;

  const finalizadas = tareas.filter(
    (tarea) => tarea.estado === 'FINALIZADA'
  ).length;

  const vencidas = tareas.filter(
    (tarea) =>
      obtenerEstadoVencimiento(tarea).codigo === 'VENCIDA'
  ).length;

  const total = tareas.length;

  const cumplimiento = total > 0
    ? Math.round((finalizadas / total) * 100)
    : 0;

  return {
    total,
    pendientes,
    enProgreso,
    finalizadas,
    vencidas,
    cumplimiento
  };
}

function ResumenResponsables({
  tareas = [],
  responsables = []
}) {
  const [orden, setOrden] = useState('TOTAL');
  const [soloConTareas, setSoloConTareas] = useState(false);

  const grupos = responsables.map((responsable) => {
    const tareasPersona = tareas.filter(
      (tarea) =>
        String(tarea.responsableId) === String(responsable.id)
    );

    return {
      id: String(responsable.id),
      nombre: responsable.nombre,
      activo: responsable.activo === true,
      ...calcularIndicadores(tareasPersona)
    };
  });

  const tareasSinResponsable = tareas.filter(
    (tarea) => tarea.responsableId == null
  );

  grupos.push({
    id: 'SIN_RESPONSABLE',
    nombre: 'Sin responsable',
    activo: null,
    ...calcularIndicadores(tareasSinResponsable)
  });

  const idsConocidos = new Set(
    responsables.map((responsable) => String(responsable.id))
  );

  const tareasResponsableNoEncontrado = tareas.filter(
    (tarea) =>
      tarea.responsableId != null &&
      !idsConocidos.has(String(tarea.responsableId))
  );

  if (tareasResponsableNoEncontrado.length > 0) {
    grupos.push({
      id: 'NO_ENCONTRADO',
      nombre: 'Responsable no encontrado',
      activo: null,
      ...calcularIndicadores(tareasResponsableNoEncontrado)
    });
  }

  const gruposVisibles = grupos
    .filter((grupo) => !soloConTareas || grupo.total > 0)
    .sort((a, b) => {
      if (orden === 'VENCIDAS') {
        return b.vencidas - a.vencidas ||
          b.total - a.total;
      }

      if (orden === 'CUMPLIMIENTO') {
        return b.cumplimiento - a.cumplimiento ||
          b.total - a.total;
      }

      if (orden === 'NOMBRE') {
        return a.nombre.localeCompare(
          b.nombre,
          'es',
          { sensitivity: 'base' }
        );
      }

      return b.total - a.total ||
        a.nombre.localeCompare(b.nombre, 'es');
    });

  const indicadoresGenerales = calcularIndicadores(tareas);

  return (
    <section className="resumen-responsables">
      <div className="resumen-responsables-cabecera">
        <div>
          <h3>Seguimiento por responsable</h3>
          <p>
            Distribución de tareas y cumplimiento
            de cada persona.
          </p>
        </div>
      </div>

      <div className="resumen-responsables-generales">
        <div className="indicador-responsable">
          <span>Total de tareas</span>
          <strong>{indicadoresGenerales.total}</strong>
        </div>

        <div className="indicador-responsable">
          <span>Tareas vencidas</span>
          <strong>{indicadoresGenerales.vencidas}</strong>
        </div>

        <div className="indicador-responsable">
          <span>Sin responsable</span>
          <strong>{tareasSinResponsable.length}</strong>
        </div>

        <div className="indicador-responsable">
          <span>Cumplimiento general</span>
          <strong>
            {indicadoresGenerales.cumplimiento}%
          </strong>
        </div>
      </div>

      <div className="resumen-responsables-controles">
        <label>
          Ordenar por
          <select
            value={orden}
            onChange={(evento) => setOrden(evento.target.value)}
          >
            <option value="TOTAL">
              Mayor cantidad de tareas
            </option>
            <option value="VENCIDAS">
              Más tareas vencidas
            </option>
            <option value="CUMPLIMIENTO">
              Mayor cumplimiento
            </option>
            <option value="NOMBRE">
              Nombre A-Z
            </option>
          </select>
        </label>

        <label className="resumen-responsables-check">
          <input
            type="checkbox"
            checked={soloConTareas}
            onChange={(evento) =>
              setSoloConTareas(evento.target.checked)
            }
          />
          Mostrar solo personas con tareas
        </label>
      </div>

      {gruposVisibles.length === 0 ? (
        <p className="sin-resultados">
          No hay responsables con tareas asignadas.
        </p>
      ) : (
        <div className="resumen-responsables-grid">
          {gruposVisibles.map((grupo) => (
            <article
              className="resumen-responsable-card"
              key={grupo.id}
            >
              <div className="resumen-responsable-titulo">
                <h4>{grupo.nombre}</h4>

                {grupo.activo === false && (
                  <span className="responsable-inactivo">
                    Inactivo
                  </span>
                )}
              </div>

              <div className="resumen-responsable-total">
                <strong>{grupo.total}</strong>
                <span>
                  {grupo.total === 1 ? 'tarea' : 'tareas'}
                </span>
              </div>

              <div className="resumen-responsable-detalles">
                <span>Pendientes</span>
                <strong>{grupo.pendientes}</strong>

                <span>En progreso</span>
                <strong>{grupo.enProgreso}</strong>

                <span>Finalizadas</span>
                <strong>{grupo.finalizadas}</strong>

                <span>Vencidas</span>
                <strong>{grupo.vencidas}</strong>
              </div>

              <div className="resumen-responsable-progreso">
                <div className="resumen-progreso-texto">
                  <span>Cumplimiento</span>
                  <strong>{grupo.cumplimiento}%</strong>
                </div>

                <div
                  className="resumen-progreso-barra"
                  role="progressbar"
                  aria-label={`Cumplimiento de ${grupo.nombre}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={grupo.cumplimiento}
                >
                  <div
                    className="resumen-progreso-valor"
                    style={{
                      width: `${grupo.cumplimiento}%`
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ResumenResponsables;
