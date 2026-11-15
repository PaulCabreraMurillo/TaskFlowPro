
package com.taskflow.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(
    description = "Datos necesarios para crear o actualizar un proyecto"
)
public record ProyectoRequest(

    @Schema(
        description = "Nombre del proyecto",
        example = "Sistema de inventarios"
    )
    @NotBlank(message = "El nombre es obligatorio")
    @Size(
        max = 150,
        message = "El nombre no puede superar 150 caracteres"
    )
    String nombre,

    @Schema(
        description = "Descripcion del proyecto",
        example = "Aplicacion para controlar inventarios"
    )
    @Size(
        max = 1000,
        message = "La descripcion no puede superar 1000 caracteres"
    )
    String descripcion,

    @Schema(
        description = "Estado actual del proyecto",
        example = "ACTIVO",
        allowableValues = {
            "ACTIVO",
            "EN_PROGRESO",
            "FINALIZADO"
        }
    )
    @NotNull(message = "El estado es obligatorio")
    @Pattern(
        regexp = "ACTIVO|EN_PROGRESO|FINALIZADO",
        message = "El estado debe ser ACTIVO, EN_PROGRESO o FINALIZADO"
    )
    String estado

) {}
