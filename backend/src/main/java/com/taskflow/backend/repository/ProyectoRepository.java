
package com.taskflow.backend.repository;

import com.taskflow.backend.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository
        extends JpaRepository<Proyecto, Long> {
}
