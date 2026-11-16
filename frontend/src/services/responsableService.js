
import { solicitarApi } from './apiClient';

const RECURSO = 'responsables';

export async function obtenerResponsables() {
  return solicitarApi(RECURSO, {
    accion: 'consultar los responsables'
  });
}

export async function obtenerResponsablePorId(id) {
  return solicitarApi(`${RECURSO}/${id}`, {
    accion: 'consultar el responsable'
  });
}

export async function crearResponsable(datos) {
  return solicitarApi(RECURSO, {
    method: 'POST',
    body: datos,
    accion: 'registrar el responsable'
  });
}

export async function actualizarResponsable(id, datos) {
  return solicitarApi(`${RECURSO}/${id}`, {
    method: 'PUT',
    body: datos,
    accion: 'actualizar el responsable'
  });
}

export async function eliminarResponsable(id) {
  return solicitarApi(`${RECURSO}/${id}`, {
    method: 'DELETE',
    accion: 'eliminar el responsable'
  });
}
