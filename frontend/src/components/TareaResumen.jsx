
import {
  obtenerEstadoVencimiento
} from '../utils/vencimientoUtils';

function TareaResumen({ tareas }) {
  const total = tareas.length;

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

  const proximas = tareas.filter(
    (tarea) =>
      obtenerEstadoVencimiento(tarea).codigo === 'PROXIMA'
  ).length;

  const indicadores = [
    {
      etiqueta: 'Total de tareas',
      valor: total,
      clase: ''
    },
    {
      etiqueta: 'Pendientes',
      valor: pendientes,
      clase: ''
    },
    {
      etiqueta: 'En progreso',
      valor: enProgreso,
      clase: ''
    },
    {
      etiqueta: 'Finalizadas',
      valor: finalizadas,
      clase: ''
    },
    {
      etiqueta: 'Vencidas',
      valor: vencidas,
      clase: 'indicador-vencidas'
    },
    {
      etiqueta: 'Próximas a vencer',
      valor: proximas,
      clase: 'indicador-proximas'
    }
  ];

  return (
    <div className="resumen-tareas">
      {indicadores.map((indicador) => (
        <div
          className={`resumen-tarea-tarjeta ${indicador.clase}`}
          key={indicador.etiqueta}
        >
          <strong>{indicador.valor}</strong>
          <span>{indicador.etiqueta}</span>
        </div>
      ))}
    </div>
  );
}

export default TareaResumen;
