
package com.taskflow.backend.controller;

import com.taskflow.backend.dto.ProyectoRequest;
import com.taskflow.backend.dto.ProyectoResponse;
import com.taskflow.backend.service.ProyectoService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@Tag(
    name = "Proyectos",
    description = "Operaciones para administrar proyectos"
)
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    @Operation(
        summary = "Listar proyectos",
        description = "Obtiene todos los proyectos registrados."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Listado obtenido correctamente"
    )
    @GetMapping
    public List<ProyectoResponse> listar() {
        return service.listarProyectos();
    }

    @Operation(
        summary = "Buscar proyecto por ID",
        description = "Consulta un proyecto utilizando su identificador."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Proyecto encontrado"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Proyecto no encontrado"
        )
    })
    @GetMapping("/{id}")
    public ProyectoResponse buscarPorId(
            @Parameter(description = "ID del proyecto")
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }

    @Operation(
        summary = "Crear proyecto",
        description = "Registra un proyecto nuevo con datos validados."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Proyecto creado correctamente"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de entrada invalidos"
        )
    })
    @PostMapping
    public ResponseEntity<ProyectoResponse> crear(
            @Valid @RequestBody ProyectoRequest request) {

        ProyectoResponse creado =
            service.crearProyecto(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(creado);
    }

    @Operation(
        summary = "Actualizar proyecto",
        description = "Modifica los datos de un proyecto existente."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Proyecto actualizado"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de entrada invalidos"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Proyecto no encontrado"
        )
    })
    @PutMapping("/{id}")
    public ProyectoResponse actualizar(
            @Parameter(description = "ID del proyecto")
            @PathVariable Long id,
            @Valid @RequestBody ProyectoRequest request) {

        return service.actualizarProyecto(id, request);
    }

    @Operation(
        summary = "Eliminar proyecto",
        description = "Elimina un proyecto existente."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Proyecto eliminado correctamente"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Proyecto no encontrado"
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID del proyecto")
            @PathVariable Long id) {

        service.eliminarProyecto(id);

        return ResponseEntity.noContent().build();
    }
}
