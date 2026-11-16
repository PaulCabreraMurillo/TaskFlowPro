
package com.taskflow.backend.dto;

import java.time.LocalDate;

public record TareaResponse(

    Long id,

    String titulo,

    String descripcion,

    String estado,

    String prioridad,

    LocalDate fechaVencimiento,

    Long proyectoId

) {}
