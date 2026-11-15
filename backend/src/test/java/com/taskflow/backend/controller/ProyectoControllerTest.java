
package com.taskflow.backend.controller;

import com.taskflow.backend.dto.ProyectoResponse;
import com.taskflow.backend.exception.GlobalExceptionHandler;
import com.taskflow.backend.service.ProyectoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProyectoControllerTest {

    private MockMvc mockMvc;
    private ProyectoService service;
    private LocalValidatorFactoryBean validator;

    @BeforeEach
    void configurar() {
        service = mock(ProyectoService.class);

        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        ProyectoController controller =
            new ProyectoController(service);

        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setValidator(validator)
            .setControllerAdvice(
                new GlobalExceptionHandler()
            )
            .build();
    }

    @Test
    void debeListarProyectos() throws Exception {
        ProyectoResponse proyecto =
            new ProyectoResponse(
                1L,
                "TaskFlow Pro",
                "Proyecto de prueba",
                "ACTIVO",
                null
            );

        when(service.listarProyectos())
            .thenReturn(List.of(proyecto));

        mockMvc.perform(get("/api/proyectos"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(
                jsonPath("$[0].nombre")
                    .value("TaskFlow Pro")
            );
    }

    @Test
    void debeCrearProyecto() throws Exception {
        ProyectoResponse respuesta =
            new ProyectoResponse(
                1L,
                "Nuevo proyecto",
                "Descripcion",
                "ACTIVO",
                null
            );

        when(service.crearProyecto(any()))
            .thenReturn(respuesta);

        String json = """
            {
                "nombre": "Nuevo proyecto",
                "descripcion": "Descripcion",
                "estado": "ACTIVO"
            }
            """;

        mockMvc.perform(
                post("/api/proyectos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
            )
            .andExpect(status().isCreated())
            .andExpect(
                jsonPath("$.nombre")
                    .value("Nuevo proyecto")
            );
    }

    @Test
    void debeRechazarNombreVacio() throws Exception {
        String json = """
            {
                "nombre": "",
                "descripcion": "Prueba",
                "estado": "ACTIVO"
            }
            """;

        mockMvc.perform(
                post("/api/proyectos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
            )
            .andExpect(status().isBadRequest())
            .andExpect(
                jsonPath("$.errores.nombre")
                    .value("El nombre es obligatorio")
            );

        verifyNoInteractions(service);
    }

    @Test
    void debeRechazarEstadoInvalido() throws Exception {
        String json = """
            {
                "nombre": "Proyecto valido",
                "descripcion": "Prueba",
                "estado": "CANCELADO"
            }
            """;

        mockMvc.perform(
                post("/api/proyectos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
            )
            .andExpect(status().isBadRequest())
            .andExpect(
                jsonPath("$.errores.estado").exists()
            );

        verifyNoInteractions(service);
    }

    @Test
    void debeResponder404() throws Exception {
        when(service.buscarPorId(999L))
            .thenThrow(
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Proyecto no encontrado con ID: 999"
                )
            );

        mockMvc.perform(get("/api/proyectos/999"))
            .andExpect(status().isNotFound())
            .andExpect(
                jsonPath("$.estado").value(404)
            );
    }
}
