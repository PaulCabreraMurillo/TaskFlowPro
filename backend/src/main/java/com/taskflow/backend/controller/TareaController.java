
package com.taskflow.backend.controller;

import com.taskflow.backend.dto.TareaRequest;
import com.taskflow.backend.dto.TareaResponse;
import com.taskflow.backend.service.TareaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "http://localhost:5173")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    // Consultar todas las tareas
    @GetMapping
    public ResponseEntity<List<TareaResponse>> listar() {
        return ResponseEntity.ok(tareaService.listar());
    }

    // Consultar tareas de un proyecto
    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<TareaResponse>> listarPorProyecto(
            @PathVariable Long proyectoId) {

        return ResponseEntity.ok(
                tareaService.listarPorProyecto(proyectoId)
        );
    }

    // Consultar tarea por ID
    @GetMapping("/{id}")
    public ResponseEntity<TareaResponse> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tareaService.obtenerPorId(id)
        );
    }

    // Crear una tarea
    @PostMapping
    public ResponseEntity<TareaResponse> crear(
            @Valid @RequestBody TareaRequest request) {

        TareaResponse creada = tareaService.crear(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creada);
    }

    // Actualizar una tarea
    @PutMapping("/{id}")
    public ResponseEntity<TareaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TareaRequest request) {

        return ResponseEntity.ok(
                tareaService.actualizar(id, request)
        );
    }

    // Eliminar una tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        tareaService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
