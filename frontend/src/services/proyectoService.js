
const API_URL = 'http://localhost:8080/api/proyectos';

export async function obtenerProyectos() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error(
      `Error al obtener proyectos: ${respuesta.status}`
    );
  }

  return await respuesta.json();
}


export async function crearProyecto(proyecto) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(proyecto)
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.json().catch(() => null);

    throw new Error(
      detalle?.message ||
      detalle?.mensaje ||
      `Error al crear proyecto: ${respuesta.status}`
    );
  }

  return await respuesta.json();
}


export async function actualizarProyecto(id, proyecto) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(proyecto)
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.json().catch(() => null);

    throw new Error(
      detalle?.message ||
      detalle?.mensaje ||
      `Error al actualizar proyecto: ${respuesta.status}`
    );
  }

  return await respuesta.json();
}

export async function eliminarProyecto(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.json().catch(() => null);

    throw new Error(
      detalle?.message ||
      detalle?.mensaje ||
      `Error al eliminar proyecto: ${respuesta.status}`
    );
  }
}
