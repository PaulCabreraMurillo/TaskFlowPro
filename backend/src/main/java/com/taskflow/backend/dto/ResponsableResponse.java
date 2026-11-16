
package com.taskflow.backend.dto;

public record ResponsableResponse(
    Long id,
    String nombre,
    String correo,
    Boolean activo
) {
}
