
package com.taskflow.backend.dto;

import java.time.LocalDate;

public record TareaResponse(

    Long id,
    String titulo,
    String descripcion,
    String estado,
    String prioridad,
    LocalDate fechaVencimiento,
    Long proyectoId,
    Long responsableId

) {
    // Compatibilidad con el constructor anterior.
    public TareaResponse(
            Long id,
            String titulo,
            String descripcion,
            String estado,
            String prioridad,
            LocalDate fechaVencimiento,
            Long proyectoId) {

        this(
            id,
            titulo,
            descripcion,
            estado,
            prioridad,
            fechaVencimiento,
            proyectoId,
            null
        );
    }
}
