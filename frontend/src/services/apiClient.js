
const API_BASE = 'http://localhost:8080/api';

export function obtenerUrlApi(recurso) {
  return `${API_BASE}/${recurso}`;
}

function obtenerMensajeDetalle(datos) {
  if (!datos || typeof datos !== 'object') {
    return '';
  }

  const mensaje =
    datos.detail ||
    datos.message ||
    datos.mensaje ||
    datos.title;

  if (typeof mensaje === 'string' && mensaje.trim()) {
    return mensaje.trim();
  }

  if (Array.isArray(datos.errors) && datos.errors.length > 0) {
    const mensajes = datos.errors
      .map((error) => {
        if (typeof error === 'string') {
          return error;
        }

        if (error && typeof error === 'object') {
          const campo = error.field || error.campo || '';
          const detalle =
            error.defaultMessage ||
            error.message ||
            error.mensaje ||
            '';

          return campo && detalle
            ? `${campo}: ${detalle}`
            : detalle;
        }

        return '';
      })
      .filter(Boolean);

    if (mensajes.length > 0) {
      return mensajes.join('; ');
    }
  }

  return '';
}

function mensajePorEstado(estado, accion) {
  if (estado === 400 || estado === 422) {
    return `No se pudo ${accion}. Revisa los datos ingresados.`;
  }

  if (estado === 401) {
    return 'La sesión no está autorizada para esta operación.';
  }

  if (estado === 403) {
    return 'No tienes permisos para realizar esta operación.';
  }

  if (estado === 404) {
    return 'El registro solicitado no existe o fue eliminado.';
  }

  if (estado === 409) {
    return 'La operación genera un conflicto con los datos existentes.';
  }

  if (estado >= 500) {
    return 'El servidor presentó un error. Inténtalo nuevamente.';
  }

  return `No se pudo ${accion}. Código HTTP ${estado}.`;
}

export async function solicitarApi(
  recurso,
  {
    method = 'GET',
    body,
    accion = 'completar la operación'
  } = {}
) {
  const opciones = {
    method,
    headers: {
      Accept: 'application/json'
    }
  };

  if (body !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(body);
  }

  let respuesta;

  try {
    respuesta = await fetch(
      obtenerUrlApi(recurso),
      opciones
    );
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor de TaskFlow Pro. ' +
      'Verifica que Spring Boot esté ejecutándose en ' +
      'http://localhost:8080 y que PostgreSQL esté disponible.'
    );
  }

  if (!respuesta.ok) {
    let datos = null;

    try {
      datos = await respuesta.json();
    } catch {
      // La respuesta puede no contener JSON.
    }

    const detalle = obtenerMensajeDetalle(datos);

    throw new Error(
      detalle || mensajePorEstado(respuesta.status, accion)
    );
  }

  if (respuesta.status === 204) {
    return null;
  }

  const texto = await respuesta.text();

  if (!texto.trim()) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(
      'El servidor devolvió una respuesta que no se pudo interpretar.'
    );
  }
}
