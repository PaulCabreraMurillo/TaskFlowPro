
export function obtenerNombreResponsable(
  tarea,
  responsables = []
) {
  if (tarea.responsableId == null) {
    return 'Sin responsable';
  }

  const responsable = responsables.find(
    (item) =>
      String(item.id) === String(tarea.responsableId)
  );

  if (!responsable) {
    return `Responsable #${tarea.responsableId} (no encontrado)`;
  }

  return responsable.activo === true
    ? responsable.nombre
    : `${responsable.nombre} (inactivo)`;
}

export function coincideFiltroResponsable(
  tarea,
  filtro
) {
  if (filtro === 'TODOS') {
    return true;
  }

  if (filtro === 'SIN_RESPONSABLE') {
    return tarea.responsableId == null;
  }

  return String(tarea.responsableId) === filtro;
}
