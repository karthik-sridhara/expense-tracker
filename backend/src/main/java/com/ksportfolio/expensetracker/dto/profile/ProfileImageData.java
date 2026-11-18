package com.ksportfolio.expensetracker.dto.profile;

import org.springframework.core.io.Resource;

public record ProfileImageData (
    Resource resource,
    String contentType,
    boolean etagMatched,
    String etag
){}
