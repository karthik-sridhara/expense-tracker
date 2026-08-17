package com.ksportfolio.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ApiVersionConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureApiVersioning(ApiVersionConfigurer configurer) {
        // Configure API versioning here
        configurer.useMediaTypeParameter(MediaType.parseMediaType("application/vnd.expensetracker+json"), "v")
                .addSupportedVersions("1.0", "2.0")
                .setDefaultVersion("1.0");
    }
}
