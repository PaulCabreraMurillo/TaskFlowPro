
import { solicitarApi } from './apiClient';

const RECURSO = 'proyectos';

export async function obtenerProyectos() {
  return solicitarApi(RECURSO, {
    accion: 'consultar los proyectos'
  });
}

export async function crearProyecto(proyecto) {
  return solicitarApi(RECURSO, {
    method: 'POST',
    body: proyecto,
    accion: 'crear el proyecto'
  });
}

export async function actualizarProyecto(id, proyecto) {
  return solicitarApi(`${RECURSO}/${id}`, {
    method: 'PUT',
    body: proyecto,
    accion: 'actualizar el proyecto'
  });
}

export async function eliminarProyecto(id) {
  await solicitarApi(`${RECURSO}/${id}`, {
    method: 'DELETE',
    accion: 'eliminar el proyecto'
  });

  return true;
}
