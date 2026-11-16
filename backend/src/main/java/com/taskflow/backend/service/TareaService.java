
package com.taskflow.backend.service;

import com.taskflow.backend.dto.TareaRequest;
import com.taskflow.backend.dto.TareaResponse;
import com.taskflow.backend.entity.Tarea;
import com.taskflow.backend.repository.ProyectoRepository;
import com.taskflow.backend.repository.TareaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final ProyectoRepository proyectoRepository;

    public TareaService(
            TareaRepository tareaRepository,
            ProyectoRepository proyectoRepository) {

        this.tareaRepository = tareaRepository;
        this.proyectoRepository = proyectoRepository;
    }

    // Consultar todas las tareas
    @Transactional(readOnly = true)
    public List<TareaResponse> listar() {

        return tareaRepository.findAll()
                .stream()
                .map(this::convertirRespuesta)
                .toList();
    }

    // Consultar tareas de un proyecto
    @Transactional(readOnly = true)
    public List<TareaResponse> listarPorProyecto(Long proyectoId) {

        verificarProyecto(proyectoId);

        return tareaRepository.findByProyectoId(proyectoId)
                .stream()
                .map(this::convertirRespuesta)
                .toList();
    }

    // Consultar una tarea por ID
    @Transactional(readOnly = true)
    public TareaResponse obtenerPorId(Long id) {

        Tarea tarea = buscarTarea(id);

        return convertirRespuesta(tarea);
    }

    // Crear una tarea
    @Transactional
    public TareaResponse crear(TareaRequest request) {

        var proyecto = proyectoRepository
                .findById(request.proyectoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El proyecto indicado no existe"
                ));

        Tarea tarea = new Tarea();

        tarea.setTitulo(request.titulo());
        tarea.setDescripcion(request.descripcion());
        tarea.setEstado(request.estado());
        tarea.setPrioridad(request.prioridad());
        tarea.setFechaVencimiento(request.fechaVencimiento());
        tarea.setProyecto(proyecto);

        Tarea guardada = tareaRepository.save(tarea);

        return convertirRespuesta(guardada);
    }

    // Actualizar una tarea
    @Transactional
    public TareaResponse actualizar(Long id, TareaRequest request) {

        Tarea tarea = buscarTarea(id);

        var proyecto = proyectoRepository
                .findById(request.proyectoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El proyecto indicado no existe"
                ));

        tarea.setTitulo(request.titulo());
        tarea.setDescripcion(request.descripcion());
        tarea.setEstado(request.estado());
        tarea.setPrioridad(request.prioridad());
        tarea.setFechaVencimiento(request.fechaVencimiento());
        tarea.setProyecto(proyecto);

        Tarea actualizada = tareaRepository.save(tarea);

        return convertirRespuesta(actualizada);
    }

    // Eliminar una tarea
    @Transactional
    public void eliminar(Long id) {

        Tarea tarea = buscarTarea(id);

        tareaRepository.delete(tarea);
    }

    // Buscar tarea y controlar si no existe
    private Tarea buscarTarea(Long id) {

        return tareaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "La tarea indicada no existe"
                ));
    }

    // Verificar que exista el proyecto
    private void verificarProyecto(Long proyectoId) {

        if (!proyectoRepository.existsById(proyectoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El proyecto indicado no existe"
            );
        }
    }

    // Convertir entidad JPA a DTO
    private TareaResponse convertirRespuesta(Tarea tarea) {

        return new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                tarea.getFechaVencimiento(),
                tarea.getProyecto().getId()
        );
    }
}
