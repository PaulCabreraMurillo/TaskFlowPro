
package com.taskflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TareaRequest(

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150)
    String titulo,

    @Size(max = 1000)
    String descripcion,

    @NotBlank(message = "El estado es obligatorio")
    String estado,

    @NotBlank(message = "La prioridad es obligatoria")
    String prioridad,

    LocalDate fechaVencimiento,

    @NotNull(message = "El proyecto es obligatorio")
    Long proyectoId

) {}
