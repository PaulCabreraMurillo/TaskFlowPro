
const API_URL = "http://localhost:8080/api/tareas";

// Consultar todas las tareas
export async function obtenerTareas() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("Error al obtener las tareas");
  }

  return respuesta.json();
}

// Consultar una tarea por ID
export async function obtenerTareaPorId(id) {
  const respuesta = await fetch(`${API_URL}/${id}`);

  if (!respuesta.ok) {
    throw new Error("Error al consultar la tarea");
  }

  return respuesta.json();
}

// Consultar tareas de un proyecto
export async function obtenerTareasPorProyecto(proyectoId) {
  const respuesta = await fetch(
    `${API_URL}/proyecto/${proyectoId}`
  );

  if (!respuesta.ok) {
    throw new Error(
      "Error al obtener las tareas del proyecto"
    );
  }

  return respuesta.json();
}

// Crear una tarea
export async function crearTarea(tarea) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarea),
  });

  if (!respuesta.ok) {
    throw new Error("Error al crear la tarea");
  }

  return respuesta.json();
}

// Actualizar una tarea
export async function actualizarTarea(id, tarea) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarea),
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar la tarea");
  }

  return respuesta.json();
}

// Eliminar una tarea
export async function eliminarTarea(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar la tarea");
  }

  return true;
}
