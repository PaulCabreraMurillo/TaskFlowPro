
package com.taskflow.backend.service;

import com.taskflow.backend.dto.TareaRequest;
import com.taskflow.backend.dto.TareaResponse;
import com.taskflow.backend.entity.Responsable;
import com.taskflow.backend.entity.Tarea;
import com.taskflow.backend.model.Proyecto;
import com.taskflow.backend.repository.ProyectoRepository;
import com.taskflow.backend.repository.ResponsableRepository;
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

    @Mock
    private ResponsableRepository responsableRepository;

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

    private Proyecto crearProyecto() {

        Proyecto proyecto = new Proyecto();
        proyecto.setId(1L);

        return proyecto;
    }

    private void asignarProyecto(Tarea tarea) {

        tarea.setProyecto(crearProyecto());
    }

    private Responsable crearResponsable(
            Long id,
            boolean activo) {

        Responsable responsable = new Responsable();

        responsable.setId(id);
        responsable.setNombre("Responsable de prueba");
        responsable.setCorreo("prueba@example.com");
        responsable.setActivo(activo);

        return responsable;
    }

    @Test
    void debeListarTodasLasTareas() {

        asignarProyecto(tarea);

        when(tareaRepository.findAll())
                .thenReturn(List.of(tarea));

        List<TareaResponse> resultado =
                tareaService.listar();

        assertEquals(1, resultado.size());

        assertEquals(
                "Diseñar interfaz",
                resultado.get(0).titulo()
        );

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

        assertEquals(
                1L,
                resultado.get(0).proyectoId()
        );
    }

    @Test
    void debeObtenerTareaPorId() {

        asignarProyecto(tarea);

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        TareaResponse resultado =
                tareaService.obtenerPorId(1L);

        assertEquals(1L, resultado.id());

        assertEquals(
                "Diseñar interfaz",
                resultado.titulo()
        );
    }

    @Test
    void debeCrearTarea() {

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

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

        assertEquals(
                "Diseñar interfaz",
                resultado.titulo()
        );

        assertEquals(1L, resultado.proyectoId());

        assertNull(resultado.responsableId());

        verify(tareaRepository)
                .save(any(Tarea.class));
    }

    @Test
    void debeActualizarTarea() {

        asignarProyecto(tarea);

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

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
                tareaService.actualizar(
                        1L,
                        actualizado
                );

        assertEquals(
                "Interfaz actualizada",
                resultado.titulo()
        );

        assertEquals(
                "EN_PROGRESO",
                resultado.estado()
        );
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

    // =====================================
    // NUEVAS PRUEBAS DE RESPONSABLES
    // =====================================

    @Test
    void debeCrearTareaConResponsableActivo() {

        Responsable responsable =
                crearResponsable(5L, true);

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

        when(responsableRepository.findById(5L))
                .thenReturn(Optional.of(responsable));

        when(tareaRepository.save(any(Tarea.class)))
                .thenAnswer(invocacion -> {

                    Tarea guardada =
                            invocacion.getArgument(0);

                    guardada.setId(2L);

                    return guardada;
                });

        TareaRequest solicitud = new TareaRequest(
                "Preparar informe",
                "Informe mensual",
                "PENDIENTE",
                "ALTA",
                LocalDate.of(2026, 12, 10),
                1L,
                5L
        );

        TareaResponse resultado =
                tareaService.crear(solicitud);

        assertEquals(2L, resultado.id());
        assertEquals(5L, resultado.responsableId());
    }

    @Test
    void debeRechazarResponsableInexistente() {

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

        when(responsableRepository.findById(99L))
                .thenReturn(Optional.empty());

        TareaRequest solicitud = new TareaRequest(
                "Preparar informe",
                "",
                "PENDIENTE",
                "MEDIA",
                null,
                1L,
                99L
        );

        ResponseStatusException excepcion =
                assertThrows(
                        ResponseStatusException.class,
                        () -> tareaService.crear(solicitud)
                );

        assertEquals(
                404,
                excepcion.getStatusCode().value()
        );

        verify(tareaRepository, never())
                .save(any(Tarea.class));
    }

    @Test
    void debeRechazarResponsableInactivo() {

        Responsable responsable =
                crearResponsable(5L, false);

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

        when(responsableRepository.findById(5L))
                .thenReturn(Optional.of(responsable));

        TareaRequest solicitud = new TareaRequest(
                "Preparar informe",
                "",
                "PENDIENTE",
                "MEDIA",
                null,
                1L,
                5L
        );

        ResponseStatusException excepcion =
                assertThrows(
                        ResponseStatusException.class,
                        () -> tareaService.crear(solicitud)
                );

        assertEquals(
                400,
                excepcion.getStatusCode().value()
        );

        verify(tareaRepository, never())
                .save(any(Tarea.class));
    }

    @Test
    void debeConservarResponsableAlCambiarEstado() {

        asignarProyecto(tarea);

        Responsable responsable =
                crearResponsable(5L, true);

        tarea.setResponsable(responsable);

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

        when(tareaRepository.save(any(Tarea.class)))
                .thenAnswer(invocacion ->
                        invocacion.getArgument(0)
                );

        // Simula una actualización del Kanban:
        // el frontend anterior no envía responsableId.
        TareaRequest solicitud = new TareaRequest(
                "Diseñar interfaz",
                "Crear pantalla",
                "EN_PROGRESO",
                "ALTA",
                LocalDate.of(2026, 11, 30),
                1L
        );

        TareaResponse resultado =
                tareaService.actualizar(
                        1L,
                        solicitud
                );

        assertEquals(
                "EN_PROGRESO",
                resultado.estado()
        );

        assertEquals(
                5L,
                resultado.responsableId()
        );

        verify(responsableRepository, never())
                .findById(any());
    }

    @Test
    void debeCambiarResponsableDeTarea() {

        asignarProyecto(tarea);

        Responsable responsableAnterior =
                crearResponsable(5L, true);

        Responsable responsableNuevo =
                crearResponsable(8L, true);

        tarea.setResponsable(responsableAnterior);

        when(tareaRepository.findById(1L))
                .thenReturn(Optional.of(tarea));

        when(proyectoRepository.findById(1L))
                .thenReturn(Optional.of(crearProyecto()));

        when(responsableRepository.findById(8L))
                .thenReturn(Optional.of(responsableNuevo));

        when(tareaRepository.save(any(Tarea.class)))
                .thenAnswer(invocacion ->
                        invocacion.getArgument(0)
                );

        TareaRequest solicitud = new TareaRequest(
                "Diseñar interfaz",
                "Crear pantalla",
                "PENDIENTE",
                "ALTA",
                LocalDate.of(2026, 11, 30),
                1L,
                8L
        );

        TareaResponse resultado =
                tareaService.actualizar(
                        1L,
                        solicitud
                );

        assertEquals(
                8L,
                resultado.responsableId()
        );
    }
}
