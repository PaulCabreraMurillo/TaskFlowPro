
package com.taskflow.backend.controller;

import com.taskflow.backend.dto.ResponsableRequest;
import com.taskflow.backend.dto.ResponsableResponse;
import com.taskflow.backend.service.ResponsableService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/responsables")
@CrossOrigin(origins = "http://localhost:5173")
public class ResponsableController {

    private final ResponsableService service;

    public ResponsableController(
            ResponsableService service) {
        this.service = service;
    }

    @GetMapping
    public List<ResponsableResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponsableResponse obtenerPorId(
            @PathVariable Long id) {

        return service.obtenerPorId(id);
    }

    @PostMapping
    public ResponseEntity<ResponsableResponse> crear(
            @Valid @RequestBody
            ResponsableRequest request) {

        ResponsableResponse respuesta =
                service.crear(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(respuesta);
    }

    @PutMapping("/{id}")
    public ResponsableResponse actualizar(
            @PathVariable Long id,
            @Valid @RequestBody
            ResponsableRequest request) {

        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
