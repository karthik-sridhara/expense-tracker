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
            "/swagger-ui/**"
        );

        List<String> appPaths = new ArrayList<>(List.of(
            "/api/auth/**",
            "/api/users/check-email",
            "/api/utilities/**"
        ));
        appPaths.addAll(swaggerPaths);
        return appPaths;
    }

    @Bean(name = "admin-employee-paths")
    public List<String> adminEmployeePath() {
        return List.of(
            "/api/budgets/admin",
            "/api/categories/admin/**"
        );
    }

    @Bean(name="admin-paths")
    public List<String> adminPath() {
        return List.of(
            "/api/users/admin/**",
            "/api/roles"
        );
    }

    @Bean(name="secured-paths")
    public List<String> securedPath() {
        return List.of(
            "/api/**"
        );
    }
}
