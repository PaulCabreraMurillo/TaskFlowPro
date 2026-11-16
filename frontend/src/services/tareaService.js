
import { solicitarApi } from './apiClient';

const RECURSO = 'tareas';

export async function obtenerTareas() {
  return solicitarApi(RECURSO, {
    accion: 'consultar las tareas'
  });
}

export async function obtenerTareaPorId(id) {
  return solicitarApi(`${RECURSO}/${id}`, {
    accion: 'consultar la tarea'
  });
}

export async function obtenerTareasPorProyecto(proyectoId) {
  return solicitarApi(
    `${RECURSO}/proyecto/${proyectoId}`,
    {
      accion: 'consultar las tareas del proyecto'
    }
  );
}

export async function crearTarea(tarea) {
  return solicitarApi(RECURSO, {
    method: 'POST',
    body: tarea,
    accion: 'crear la tarea'
  });
}

export async function actualizarTarea(id, tarea) {
  return solicitarApi(`${RECURSO}/${id}`, {
    method: 'PUT',
    body: tarea,
    accion: 'actualizar la tarea'
  });
}

export async function eliminarTarea(id) {
  await solicitarApi(`${RECURSO}/${id}`, {
    method: 'DELETE',
    accion: 'eliminar la tarea'
  });

  return true;
}
