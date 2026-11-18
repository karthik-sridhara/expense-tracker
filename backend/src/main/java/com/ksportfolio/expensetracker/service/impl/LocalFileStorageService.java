package com.ksportfolio.expensetracker.service.impl;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageService implements FileStorageService {

    private final Path root;

    public LocalFileStorageService(@Value("${app.storage.location.local}") String root) {
        this.root = Paths.get(root).toAbsolutePath().normalize();
    }

    @Override
    public String store(InputStream data, String contentType, String folder) {
        String ext = switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
        String key = folder + "/" + UUID.randomUUID() + ext;
        Path target = resolveSafe(key);
        try{
            Files.createDirectories(target.getParent());
            Files.copy(data, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessLogicException(ErrorCode.FAIL_TO_SAVE_FILE, key);
        }
        return key;
    }

    @Override
    public Resource load(String key) {
        Path file = resolveSafe(key);
        if (!Files.exists(file)) {
            throw new BusinessLogicException(ErrorCode.FILE_NOT_FOUND,key);
        }
        return new FileSystemResource(file);
    }

    @Override
    public void delete(String key) {
        Path file = resolveSafe(key);
        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new BusinessLogicException(ErrorCode.FAIL_TO_DELETE_FILE,key);
        }
    }

    private Path resolveSafe(String key) {
        Path file = root.resolve(key).normalize();
        if (!file.startsWith(root)) {
            throw new SecurityException("Invalid key");
        }
        return file;
    }

}

