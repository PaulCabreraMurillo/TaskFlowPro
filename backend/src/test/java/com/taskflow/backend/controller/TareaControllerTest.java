
package com.taskflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.backend.dto.TareaRequest;
import com.taskflow.backend.dto.TareaResponse;
import com.taskflow.backend.service.TareaService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TareaControllerTest {

    private MockMvc mockMvc;
    private TareaService tareaService;
    private ObjectMapper objectMapper;

    private TareaResponse respuesta;
    private TareaRequest solicitud;

    @BeforeEach
    void preparar() {


var validator =
        new org.springframework.validation.beanvalidation
                .LocalValidatorFactoryBean();

validator.afterPropertiesSet();

mockMvc = MockMvcBuilders
        .standaloneSetup(
                new TareaController(tareaService)
        )
        .setValidator(validator)
        .build();


        tareaService = mock(TareaService.class);

        
        mockMvc = MockMvcBuilders
        .standaloneSetup(
                new TareaController(tareaService)
        )
        .setValidator(
                new org.springframework.validation.beanvalidation
                        .LocalValidatorFactoryBean()
        )
        .build();


        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        respuesta = new TareaResponse(
                1L,
                "Diseñar interfaz",
                "Crear pantalla de tareas",
                "PENDIENTE",
                "ALTA",
                LocalDate.of(2026, 11, 30),
                1L
        );

        solicitud = new TareaRequest(
                "Diseñar interfaz",
                "Crear pantalla de tareas",
                "PENDIENTE",
                "ALTA",
                LocalDate.of(2026, 11, 30),
                1L
        );
    }

    @Test
    void debeListarTareas() throws Exception {

        when(tareaService.listar())
                .thenReturn(List.of(respuesta));

        mockMvc.perform(get("/api/tareas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].titulo")
                        .value("Diseñar interfaz"));

        verify(tareaService).listar();
    }

    @Test
    void debeConsultarTareaPorId() throws Exception {

        when(tareaService.obtenerPorId(1L))
                .thenReturn(respuesta);

        mockMvc.perform(get("/api/tareas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.prioridad")
                        .value("ALTA"));

        verify(tareaService).obtenerPorId(1L);
    }

    @Test
    void debeListarTareasPorProyecto() throws Exception {

        when(tareaService.listarPorProyecto(1L))
                .thenReturn(List.of(respuesta));

        mockMvc.perform(
                        get("/api/tareas/proyecto/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].proyectoId")
                        .value(1));

        verify(tareaService).listarPorProyecto(1L);
    }

    @Test
    void debeCrearTarea() throws Exception {

        when(tareaService.crear(any(TareaRequest.class)))
                .thenReturn(respuesta);

        mockMvc.perform(
                        post("/api/tareas")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(
                                                solicitud
                                        )
                                )
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo")
                        .value("Diseñar interfaz"));

        verify(tareaService).crear(any(TareaRequest.class));
    }

    @Test
    void debeActualizarTarea() throws Exception {

        TareaResponse actualizada = new TareaResponse(
                1L,
                "Interfaz actualizada",
                "Cambios realizados",
                "EN_PROGRESO",
                "MEDIA",
                LocalDate.of(2026, 12, 5),
                1L
        );

        when(tareaService.actualizar(
                eq(1L),
                any(TareaRequest.class)
        )).thenReturn(actualizada);

        mockMvc.perform(
                        put("/api/tareas/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(
                                                solicitud
                                        )
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo")
                        .value("Interfaz actualizada"))
                .andExpect(jsonPath("$.estado")
                        .value("EN_PROGRESO"));

        verify(tareaService).actualizar(
                eq(1L),
                any(TareaRequest.class)
        );
    }

    @Test
    void debeEliminarTarea() throws Exception {

        doNothing().when(tareaService).eliminar(1L);

        mockMvc.perform(delete("/api/tareas/1"))
                .andExpect(status().isNoContent());

        verify(tareaService).eliminar(1L);
    }

    @Test
    void debeRechazarTituloVacio() throws Exception {

        String json = """
                {
                  "titulo": "",
                  "descripcion": "Prueba",
                  "estado": "PENDIENTE",
                  "prioridad": "MEDIA",
                  "proyectoId": 1
                }
                """;

        mockMvc.perform(
                        post("/api/tareas")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isBadRequest());

        verifyNoInteractions(tareaService);
    }

    @Test
    void debeRechazarProyectoNulo() throws Exception {

        String json = """
                {
                  "titulo": "Tarea de prueba",
                  "descripcion": "Prueba",
                  "estado": "PENDIENTE",
                  "prioridad": "MEDIA"
                }
                """;

        mockMvc.perform(
                        post("/api/tareas")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isBadRequest());

        verifyNoInteractions(tareaService);
    }
}
