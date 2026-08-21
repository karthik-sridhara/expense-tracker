package com.ksportfolio.expensetracker.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class PathConfig {

    @Bean(name="public-paths")
    public List<String> publicPath() {

        List<String> swaggerPaths = List.of(
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/api/utilities/**"
        );

        List<String> appPaths = new ArrayList<>(List.of(
                "/api/auth/**"
        ));
        appPaths.addAll(swaggerPaths);
        return appPaths;
    }

    @Bean(name = "admin-employee-paths")
    public List<String> adminEmployeePath() {
        return List.of(
                "/api/categories",
                "/api/users"
        );
    }

    @Bean(name="admin-paths")
    public List<String> adminPath() {
        return List.of(
        );
    }

    @Bean(name="employee-paths")
    public List<String> employeePath() {
        return List.of(
        );
    }

    @Bean(name="secured-paths")
    public List<String> securedPath() {
        return List.of(
            "/api/**"
        );
    }
}
