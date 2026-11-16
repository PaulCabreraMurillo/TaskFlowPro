
const API_URL = "http://localhost:8080/api/responsables";

async function procesarRespuesta(respuesta) {
  if (!respuesta.ok) {
    let mensaje = `Error HTTP ${respuesta.status}`;

    try {
      const datos = await respuesta.json();

      mensaje =
        datos.detail ||
        datos.message ||
        datos.error ||
        mensaje;
    } catch {
      // Mantener el mensaje HTTP original.
    }

    throw new Error(mensaje);
  }

  if (respuesta.status === 204) {
    return null;
  }

  return respuesta.json();
}

export async function obtenerResponsables() {
  const respuesta = await fetch(API_URL);
  return procesarRespuesta(respuesta);
}

export async function obtenerResponsablePorId(id) {
  const respuesta = await fetch(`${API_URL}/${id}`);
  return procesarRespuesta(respuesta);
}

export async function crearResponsable(datos) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  return procesarRespuesta(respuesta);
}

export async function actualizarResponsable(id, datos) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  return procesarRespuesta(respuesta);
}

export async function eliminarResponsable(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return procesarRespuesta(respuesta);
}
