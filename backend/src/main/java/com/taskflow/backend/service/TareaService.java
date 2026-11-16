
package com.taskflow.backend.service;

import com.taskflow.backend.dto.TareaRequest;
import com.taskflow.backend.dto.TareaResponse;
import com.taskflow.backend.entity.Responsable;
import com.taskflow.backend.entity.Tarea;
import com.taskflow.backend.repository.ProyectoRepository;
import com.taskflow.backend.repository.ResponsableRepository;
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
    private final ResponsableRepository responsableRepository;

    public TareaService(
            TareaRepository tareaRepository,
            ProyectoRepository proyectoRepository,
            ResponsableRepository responsableRepository) {

        this.tareaRepository = tareaRepository;
        this.proyectoRepository = proyectoRepository;
        this.responsableRepository = responsableRepository;
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
    public List<TareaResponse> listarPorProyecto(
            Long proyectoId) {

        verificarProyecto(proyectoId);

        return tareaRepository
                .findByProyectoId(proyectoId)
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
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "El proyecto indicado no existe"
                        )
                );

        Responsable responsable =
                buscarResponsableActivo(
                        request.responsableId()
                );

        Tarea tarea = new Tarea();

        tarea.setTitulo(request.titulo());
        tarea.setDescripcion(request.descripcion());
        tarea.setEstado(request.estado());
        tarea.setPrioridad(request.prioridad());
        tarea.setFechaVencimiento(
                request.fechaVencimiento()
        );
        tarea.setProyecto(proyecto);
        tarea.setResponsable(responsable);

        Tarea guardada = tareaRepository.save(tarea);

        return convertirRespuesta(guardada);
    }

    // Actualizar una tarea
    @Transactional
    public TareaResponse actualizar(
            Long id,
            TareaRequest request) {

        Tarea tarea = buscarTarea(id);

        var proyecto = proyectoRepository
                .findById(request.proyectoId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "El proyecto indicado no existe"
                        )
                );

        // Si se envía un responsableId, se valida
        // y se actualiza la asignación.
        //
        // Si no se envía, se conserva el responsable
        // actual. Esto protege las actualizaciones
        // realizadas desde el Kanban existente.
        if (request.responsableId() != null) {

            Responsable responsable =
                    buscarResponsableActivo(
                            request.responsableId()
                    );

            tarea.setResponsable(responsable);
        }

        tarea.setTitulo(request.titulo());
        tarea.setDescripcion(request.descripcion());
        tarea.setEstado(request.estado());
        tarea.setPrioridad(request.prioridad());
        tarea.setFechaVencimiento(
                request.fechaVencimiento()
        );
        tarea.setProyecto(proyecto);

        Tarea actualizada =
                tareaRepository.save(tarea);

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
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "La tarea indicada no existe"
                        )
                );
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

    // Buscar responsable y verificar que esté activo.
    // Si el ID es null, la tarea queda sin responsable.
    private Responsable buscarResponsableActivo(
            Long responsableId) {

        if (responsableId == null) {
            return null;
        }

        Responsable responsable = responsableRepository
                .findById(responsableId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "El responsable indicado no existe"
                        )
                );

        if (!Boolean.TRUE.equals(
                responsable.getActivo())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede asignar un responsable inactivo"
            );
        }

        return responsable;
    }

    // Convertir entidad JPA a DTO
    private TareaResponse convertirRespuesta(Tarea tarea) {

        Long responsableId = null;

        if (tarea.getResponsable() != null) {
            responsableId =
                    tarea.getResponsable().getId();
        }

        return new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                tarea.getFechaVencimiento(),
                tarea.getProyecto().getId(),
                responsableId
        );
    }
}
