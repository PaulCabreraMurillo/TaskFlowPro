
import { useState } from 'react';

import TableroGeneral from './TableroGeneral';
import ResumenResponsables from './ResumenResponsables';
import './PanelSeguimiento.css';

function PanelSeguimiento({
  proyectos,
  tareas,
  responsables,
  cargando,
  error,
  recargar,
  abrirTarea
}) {
  const [mostrarIndicadores, setMostrarIndicadores] =
    useState(true);

  return (
    <div className="panel-seguimiento">
      <section className="panel-seguimiento-encabezado">
        <div>
          <h2>Indicadores de seguimiento</h2>
          <p>
            Consulta la distribución de tareas,
            los vencimientos y el cumplimiento
            de cada responsable.
          </p>
        </div>

        <button
          type="button"
          className="boton-tareas"
          onClick={() =>
            setMostrarIndicadores((anterior) => !anterior)
          }
        >
          {mostrarIndicadores
            ? 'Ocultar indicadores'
            : 'Mostrar indicadores'}
        </button>
      </section>

      {error && (
        <p className="mensaje-error" role="alert">
          No se pudieron cargar los datos: {error}
        </p>
      )}

      {cargando ? (
        <p>Cargando indicadores...</p>
      ) : mostrarIndicadores ? (
        <ResumenResponsables
          tareas={tareas}
          responsables={responsables}
        />
      ) : null}

      <TableroGeneral
        proyectos={proyectos}
        tareas={tareas}
        responsables={responsables}
        cargando={cargando}
        error={error}
        recargar={recargar}
        abrirTarea={abrirTarea}
      />
    </div>
  );
}

export default PanelSeguimiento;
