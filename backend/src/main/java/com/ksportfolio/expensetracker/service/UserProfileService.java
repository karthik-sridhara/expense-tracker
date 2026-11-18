package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.profile.ProfileImageData;
import com.ksportfolio.expensetracker.dto.profile.UserProfileResponse;
import com.ksportfolio.expensetracker.dto.profile.UserProfileUpdateRequest;
import com.ksportfolio.expensetracker.entity.UserProfile;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.UserProfileMapper;
import com.ksportfolio.expensetracker.repository.UserProfileRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.DateTimeException;
import java.time.ZoneId;
import java.util.Currency;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserProfileService {

    private final UserProfileRepo userProfileRepo;
    private final FileStorageService storage;

    public ProfileImageData loadImage(Integer userId,String ifNoneMatch) {
        UserProfile profile = getUserProfile(userId);
        String key = profile.getImagePath();
        if (key == null) {
            throw new BusinessLogicException(ErrorCode.NO_PROFILE_IMAGE,userId);
        }
        String etag = "\"" + key.hashCode() + "\"";
        if (etag.equals(ifNoneMatch)) {
            return new ProfileImageData(null,null,true,etag);
        }
        String contentType = profile.getImageType() != null ? profile.getImageType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        return new ProfileImageData(storage.load(key), contentType, false, etag);
    }

    public UserProfileResponse get(Integer userId) {
        return UserProfileResponse.from(getUserProfile(userId));
    }

    @Transactional
    public void update(Integer userId, UserProfileUpdateRequest request) {
        try {
            ZoneId.of(request.timezone());
        } catch (DateTimeException e) {
            throw new BusinessLogicException(ErrorCode.INVALID_FORMAT, request.timezone(), "timezone");
        }
        try {
            Currency.getInstance(request.currency());
        } catch (IllegalArgumentException e) {
            throw new BusinessLogicException(ErrorCode.INVALID_FORMAT, request.currency(), "currency");
        }
        UserProfile profile = getUserProfile(userId);
        UserProfileMapper.toEntity(profile, request);
    }

    @Transactional
    public void updateImage(Integer userId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new BusinessLogicException(ErrorCode.FILE_IS_EMPTY);
        }
        UserProfile profile = getUserProfile(userId);
        String newKey = storage.store(new ByteArrayInputStream(file.getBytes()), file.getContentType(), "profiles/" + userId);
        String oldKey = profile.getImagePath();

        profile.setImagePath(newKey);
        profile.setImageType(file.getContentType());

        // Delete files only once the transaction outcome is known
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
            if (status == STATUS_COMMITTED && oldKey != null) {
                safeDelete(oldKey);
            } else if (status != STATUS_COMMITTED) {
                safeDelete(newKey);
            }
            }
        });
    }

    @Transactional
    public void deleteImage(Integer userId) {
        UserProfile profile = getUserProfile(userId);
        String oldKey = profile.getImagePath();
        if (oldKey == null) return;

        profile.setImagePath(null);
        profile.setImageType(null);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() { safeDelete(oldKey); }
        });
    }


    private UserProfile getUserProfile(Integer userId) {
        return userProfileRepo.findById(userId)
                .orElseThrow(()->new BusinessLogicException(ErrorCode.PROFILE_NOT_FOUND,userId));
    }

    private void safeDelete(String key) {
        try {
            storage.delete(key);
        } catch (Exception e) {
            log.warn("Failed to delete image {}", key, e);   // a cleanup job can retry later
        }
    }

}
