
package com.taskflow.backend.dto;

import java.time.LocalDateTime;

public record ProyectoResponse(
    Long id,
    String nombre,
    String descripcion,
    String estado,
    LocalDateTime fechaCreacion
) {}
