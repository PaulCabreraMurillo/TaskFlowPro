
package com.taskflow.backend.service;

import com.taskflow.backend.dto.ProyectoRequest;
import com.taskflow.backend.dto.ProyectoResponse;
import com.taskflow.backend.model.Proyecto;
import com.taskflow.backend.repository.ProyectoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProyectoServiceTest {

    private ProyectoRepository repository;
    private ProyectoService service;

    @BeforeEach
    void configurar() {
        repository = mock(ProyectoRepository.class);
        service = new ProyectoService(repository);
    }

    private Proyecto crearProyectoEjemplo() {
        Proyecto proyecto = new Proyecto();
        proyecto.setId(1L);
        proyecto.setNombre("TaskFlow Pro");
        proyecto.setDescripcion("Proyecto de prueba");
        proyecto.setEstado("ACTIVO");
        return proyecto;
    }

    @Test
    void debeListarProyectos() {
        when(repository.findAll())
            .thenReturn(List.of(crearProyectoEjemplo()));

        List<ProyectoResponse> resultado =
            service.listarProyectos();

        assertEquals(1, resultado.size());
        assertEquals(
            "TaskFlow Pro",
            resultado.get(0).nombre()
        );

        verify(repository).findAll();
    }

    @Test
    void debeBuscarProyectoPorId() {
        when(repository.findById(1L))
            .thenReturn(Optional.of(crearProyectoEjemplo()));

        ProyectoResponse resultado =
            service.buscarPorId(1L);

        assertEquals(1L, resultado.id());
        assertEquals("ACTIVO", resultado.estado());
    }

    @Test
    void debeCrearProyecto() {
        ProyectoRequest request = new ProyectoRequest(
            "Nuevo proyecto",
            "Descripcion de prueba",
            "ACTIVO"
        );

        when(repository.save(any(Proyecto.class)))
            .thenAnswer(invocacion -> {
                Proyecto proyecto =
                    invocacion.getArgument(0);
                proyecto.setId(2L);
                return proyecto;
            });

        ProyectoResponse resultado =
            service.crearProyecto(request);

        assertEquals(2L, resultado.id());
        assertEquals(
            "Nuevo proyecto",
            resultado.nombre()
        );

        verify(repository).save(any(Proyecto.class));
    }

    @Test
    void debeActualizarProyecto() {
        Proyecto existente = crearProyectoEjemplo();

        ProyectoRequest request = new ProyectoRequest(
            "Proyecto actualizado",
            "Nueva descripcion",
            "EN_PROGRESO"
        );

        when(repository.findById(1L))
            .thenReturn(Optional.of(existente));

        when(repository.save(any(Proyecto.class)))
            .thenAnswer(invocacion ->
                invocacion.getArgument(0)
            );

        ProyectoResponse resultado =
            service.actualizarProyecto(1L, request);

        assertEquals(
            "Proyecto actualizado",
            resultado.nombre()
        );

        assertEquals(
            "EN_PROGRESO",
            resultado.estado()
        );
    }

    @Test
    void debeEliminarProyecto() {
        Proyecto proyecto = crearProyectoEjemplo();

        when(repository.findById(1L))
            .thenReturn(Optional.of(proyecto));

        service.eliminarProyecto(1L);

        verify(repository).delete(proyecto);
    }

    @Test
    void debeResponder404SiNoExiste() {
        when(repository.findById(999L))
            .thenReturn(Optional.empty());

        ResponseStatusException excepcion =
            assertThrows(
                ResponseStatusException.class,
                () -> service.buscarPorId(999L)
            );

        assertEquals(
            HttpStatus.NOT_FOUND,
            excepcion.getStatusCode()
        );
    }
}
