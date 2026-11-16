
const DIAS_ALERTA = 3;

function convertirFechaLocal(fechaTexto) {
  if (!fechaTexto) return null;

  const partes = fechaTexto.split('-').map(Number);

  if (partes.length !== 3) return null;

  const [anio, mes, dia] = partes;

  const fecha = new Date(anio, mes - 1, dia);

  if (
    Number.isNaN(fecha.getTime()) ||
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }

  return fecha;
}

export function obtenerEstadoVencimiento(
  tarea,
  fechaActual = new Date()
) {
  if (tarea.estado === 'FINALIZADA') {
    return {
      codigo: 'FINALIZADA',
      texto: 'Finalizada'
    };
  }

  if (!tarea.fechaVencimiento) {
    return {
      codigo: 'SIN_FECHA',
      texto: 'Sin vencimiento'
    };
  }

  const vencimiento = convertirFechaLocal(
    tarea.fechaVencimiento
  );

  if (!vencimiento) {
    return {
      codigo: 'SIN_FECHA',
      texto: 'Fecha no válida'
    };
  }

  const hoy = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    fechaActual.getDate()
  );

  // Se comparan días de calendario, evitando problemas
  // por las horas o cambios de horario.
  const diaUTC = (fecha) =>
    Date.UTC(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate()
    );

  const diferenciaDias = Math.round(
    (diaUTC(vencimiento) - diaUTC(hoy)) /
      (1000 * 60 * 60 * 24)
  );

  if (diferenciaDias < 0) {
    return {
      codigo: 'VENCIDA',
      texto: 'Vencida',
      diferenciaDias
    };
  }

  if (diferenciaDias <= DIAS_ALERTA) {
    return {
      codigo: 'PROXIMA',
      texto:
        diferenciaDias === 0
          ? 'Vence hoy'
          : `Vence en ${diferenciaDias} día(s)`,
      diferenciaDias
    };
  }

  return {
    codigo: 'AL_DIA',
    texto: 'Al día',
    diferenciaDias
  };
}

export function formatearFecha(fechaTexto) {
  const fecha = convertirFechaLocal(fechaTexto);

  if (!fecha) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(fecha);
}
