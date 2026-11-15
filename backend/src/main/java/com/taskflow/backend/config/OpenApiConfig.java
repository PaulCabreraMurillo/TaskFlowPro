
package com.taskflow.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI taskFlowOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("TaskFlow Pro API")
                .version("1.0.0")
                .description("""
                    API REST para la gestion de proyectos.

                    Funcionalidades:
                    - Crear proyectos
                    - Consultar proyectos
                    - Actualizar proyectos
                    - Eliminar proyectos
                    - Validar los datos de entrada

                    Tecnologias:
                    Java 25, Spring Boot 4,
                    Spring Data JPA y PostgreSQL.
                    """)
                .contact(new Contact()
                    .name("Equipo TaskFlow Pro"))
                .license(new License()
                    .name("Licencia por definir")));
    }
}
