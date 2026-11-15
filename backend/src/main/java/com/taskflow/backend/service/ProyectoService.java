
package com.taskflow.backend.service;

import com.taskflow.backend.dto.ProyectoRequest;
import com.taskflow.backend.dto.ProyectoResponse;
import com.taskflow.backend.model.Proyecto;
import com.taskflow.backend.repository.ProyectoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProyectoService {

    private final ProyectoRepository repository;

    public ProyectoService(ProyectoRepository repository) {
        this.repository = repository;
    }

    private Proyecto buscarEntidad(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Proyecto no encontrado con ID: " + id
            ));
    }

    private ProyectoResponse convertirRespuesta(Proyecto p) {
        return new ProyectoResponse(
            p.getId(),
            p.getNombre(),
            p.getDescripcion(),
            p.getEstado(),
            p.getFechaCreacion()
        );
    }

    public List<ProyectoResponse> listarProyectos() {
        return repository.findAll()
            .stream()
            .map(this::convertirRespuesta)
            .toList();
    }

    public ProyectoResponse buscarPorId(Long id) {
        return convertirRespuesta(buscarEntidad(id));
    }

    public ProyectoResponse crearProyecto(
            ProyectoRequest request) {

        Proyecto proyecto = new Proyecto();

        proyecto.setNombre(request.nombre());
        proyecto.setDescripcion(request.descripcion());
        proyecto.setEstado(request.estado());

        Proyecto guardado = repository.save(proyecto);

        return convertirRespuesta(guardado);
    }

    public ProyectoResponse actualizarProyecto(
            Long id,
            ProyectoRequest request) {

        Proyecto proyecto = buscarEntidad(id);

        proyecto.setNombre(request.nombre());
        proyecto.setDescripcion(request.descripcion());
        proyecto.setEstado(request.estado());

        return convertirRespuesta(repository.save(proyecto));
    }

    public void eliminarProyecto(Long id) {
        Proyecto proyecto = buscarEntidad(id);
        repository.delete(proyecto);
    }
}
