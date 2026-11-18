package com.ksportfolio.expensetracker.service;


import org.springframework.core.io.Resource;

import java.io.InputStream;

public interface FileStorageService {
    String store(InputStream data, String contentType, String folder); // returns key
    Resource load(String key);
    void delete(String key);
}

