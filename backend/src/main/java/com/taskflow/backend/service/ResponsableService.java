
package com.taskflow.backend.service;

import com.taskflow.backend.dto.ResponsableRequest;
import com.taskflow.backend.dto.ResponsableResponse;
import com.taskflow.backend.entity.Responsable;
import com.taskflow.backend.repository.ResponsableRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ResponsableService {

    private final ResponsableRepository repository;

    public ResponsableService(
            ResponsableRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ResponsableResponse> listar() {

        return repository.findAll(
                Sort.by(Sort.Direction.ASC, "nombre")
            )
            .stream()
            .map(this::convertir)
            .toList();
    }

    @Transactional(readOnly = true)
    public ResponsableResponse obtenerPorId(Long id) {

        Responsable responsable = buscar(id);

        return convertir(responsable);
    }

    @Transactional
    public ResponsableResponse crear(
            ResponsableRequest request) {

        Responsable responsable = new Responsable();

        aplicarDatos(responsable, request);

        Responsable guardado =
                repository.save(responsable);

        return convertir(guardado);
    }

    @Transactional
    public ResponsableResponse actualizar(
            Long id,
            ResponsableRequest request) {

        Responsable responsable = buscar(id);

        aplicarDatos(responsable, request);

        Responsable actualizado =
                repository.save(responsable);

        return convertir(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {

        Responsable responsable = buscar(id);

        repository.delete(responsable);
    }

    private Responsable buscar(Long id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Responsable no encontrado"
                )
            );
    }

    private void aplicarDatos(
            Responsable responsable,
            ResponsableRequest request) {

        responsable.setNombre(
            request.nombre().trim()
        );

        String correo = request.correo();

        responsable.setCorreo(
            correo == null || correo.isBlank()
                ? null
                : correo.trim()
        );

        responsable.setActivo(request.activo());
    }

    private ResponsableResponse convertir(
            Responsable responsable) {

        return new ResponsableResponse(
            responsable.getId(),
            responsable.getNombre(),
            responsable.getCorreo(),
            responsable.getActivo()
        );
    }
}
