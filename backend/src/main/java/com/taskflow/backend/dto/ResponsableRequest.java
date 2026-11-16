
package com.taskflow.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResponsableRequest(

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120)
    String nombre,

    @Email(message = "El correo no es válido")
    @Size(max = 150)
    String correo,

    @NotNull(message = "El estado activo es obligatorio")
    Boolean activo

) {
}
