
package com.taskflow.backend.service;

import com.taskflow.backend.dto.TareaRequest;
import com.taskflow.backend.dto.TareaResponse;
import com.taskflow.backend.entity.Tarea;
import com.taskflow.backend.repository.ProyectoRepository;
import com.taskflow.backend.repository.TareaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TareaServiceTest {

    @Mock
    private TareaRepository tareaRepository;

    @Mock
    private ProyectoRepository proyectoRepository;

    @InjectMocks
    private TareaService tareaService;

    private Tarea tarea;
    private TareaRequest request;

    @BeforeEach
    void prepararDatos() {

        tarea = new Tarea();

        tarea.setId(1L);
        tarea.setTitulo("Diseñar interfaz");
        tarea.setDescripcion("Crear pantalla");
        tarea.setEstado("PENDIENTE");
        tarea.setPrioridad("ALTA");
        tarea.setFechaVencimiento(
                LocalDate.of(2026, 11, 30)
        );

        request = new TareaRequest(
                "Diseñar interfaz",
                "Crear pantalla",
                "PENDIENTE",
                "ALTA",
                LocalDate.of(2026, 11, 30),
                1L
        );
    }

    private void asignarProyecto(Tarea tarea) {
        // Sustituye el import de Proyecto si está
        // declarado en otro paquete.
        var proyecto = new com.taskflow.backend.model.Proyecto();
        proyecto.setId(1L);
        tarea.setProyecto(proyecto);
    }

    @Test
    void debeListarTodasLasTareas() {

        asignarProyecto(tarea);

        when(tareaRepository.findAll())
                .thenReturn(List.of(tarea));

        List<TareaResponse> resultado =
                tareaService.listar();

        assertEquals(1, resultado.size());
        assertEquals("Diseñar interfaz",
                resultado.get(0).titulo());

        verify(tareaRepository).findAll();
    }

    @Test
    void debeListarTareasPorProyecto() {

        asignarProyecto(tarea);

        when(proyectoRepository.existsById(1L))
                .thenReturn(true);

        when(tareaRepository.findByProyectoId(1L))
                .thenReturn(List.of(tarea));

        List<TareaResponse> resultado =
                tareaService.listarPorProyecto(1L);

        assertEquals(1, resultado.size());
        assertEquals(1L, resultado.get(0).proyectoId());
    }

    @Test
    void debeObtenerTareaPorId() {

        asignarProyecto(tarea);

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        TareaResponse resultado =
                tareaService.obtenerPorId(1L);

        assertEquals(1L, resultado.id());
        assertEquals("Diseñar interfaz",
                resultado.titulo());
    }

    @Test
    void debeCrearTarea() {

        var proyecto = new com.taskflow.backend.model.Proyecto();
        proyecto.setId(1L);

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(proyecto));

        when(tareaRepository.save(any(Tarea.class)))
                .thenAnswer(invocacion -> {
                    Tarea guardada =
                            invocacion.getArgument(0);
                    guardada.setId(1L);
                    return guardada;
                });

        TareaResponse resultado =
                tareaService.crear(request);

        assertEquals(1L, resultado.id());
        assertEquals("Diseñar interfaz",
                resultado.titulo());
        assertEquals(1L, resultado.proyectoId());

        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void debeActualizarTarea() {

        var proyecto = new com.taskflow.backend.model.Proyecto();
        proyecto.setId(1L);

        asignarProyecto(tarea);

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(proyecto));

        when(tareaRepository.save(any(Tarea.class)))
                .thenAnswer(invocacion ->
                        invocacion.getArgument(0)
                );

        TareaRequest actualizado = new TareaRequest(
                "Interfaz actualizada",
                "Cambios completados",
                "EN_PROGRESO",
                "MEDIA",
                LocalDate.of(2026, 12, 5),
                1L
        );

        TareaResponse resultado =
                tareaService.actualizar(1L, actualizado);

        assertEquals("Interfaz actualizada",
                resultado.titulo());

        assertEquals("EN_PROGRESO",
                resultado.estado());
    }

    @Test
    void debeEliminarTarea() {

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        tareaService.eliminar(1L);

        verify(tareaRepository).delete(tarea);
    }

    @Test
    void debeRechazarProyectoInexistente() {

        when(proyectoRepository.findById(99L))
                .thenReturn(Optional.empty());

        TareaRequest invalido = new TareaRequest(
                "Tarea inválida",
                "Proyecto inexistente",
                "PENDIENTE",
                "MEDIA",
                null,
                99L
        );

        ResponseStatusException excepcion =
                assertThrows(
                        ResponseStatusException.class,
                        () -> tareaService.crear(invalido)
                );

        assertEquals(
                404,
                excepcion.getStatusCode().value()
        );

        verify(tareaRepository, never())
                .save(any(Tarea.class));
    }
}
