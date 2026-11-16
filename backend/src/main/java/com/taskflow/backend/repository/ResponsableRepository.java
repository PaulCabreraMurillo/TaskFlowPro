
package com.taskflow.backend.repository;

import com.taskflow.backend.entity.Responsable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponsableRepository
        extends JpaRepository<Responsable, Long> {
}
