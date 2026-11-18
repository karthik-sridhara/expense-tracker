package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.profile.ProfileImageData;
import com.ksportfolio.expensetracker.dto.profile.UserProfileResponse;
import com.ksportfolio.expensetracker.dto.profile.UserProfileUpdateRequest;
import jakarta.validation.Valid;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<UserProfileResponse>> get(
        @AuthenticationPrincipal AppUserDetails user
    ) {
        return new ApiResponse<>("Successfully fetched profile",
                userProfileService.get(user.getUserId())).toResponseEntity();
    }

    @PutMapping(version = "1.0")
    public ResponseEntity<ApiResponse<Void>> update(
        @AuthenticationPrincipal AppUserDetails user,
        @RequestBody @Valid UserProfileUpdateRequest request
    ) {
        userProfileService.update(user.getUserId(), request);
        return new ApiResponse<Void>("Successfully updated profile", null).toResponseEntity();
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,version = "1.0")
    public ResponseEntity<ApiResponse<Void>> uploadImage(
        @AuthenticationPrincipal AppUserDetails user,
        @RequestPart("file") MultipartFile file
    ) throws IOException {
        userProfileService.updateImage(user.getUserId(), file);
        return new ApiResponse<Void>("Successfully uploaded profile image",null).toResponseEntity();
    }

    @DeleteMapping("/image")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<ApiResponse<Void>> deleteImage(
        @AuthenticationPrincipal AppUserDetails user
    ) {
        userProfileService.deleteImage(user.getUserId());
        return new ApiResponse<Void>("Successfully deleted profile image",null).toResponseEntity();
    }

    @GetMapping("/image")
    public ResponseEntity<Resource> getImage(
        @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
        @AuthenticationPrincipal AppUserDetails user
    ) {
        Integer userId = user.getUserId();
        ProfileImageData img = userProfileService.loadImage(userId, ifNoneMatch);

        if (img.etagMatched()) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).eTag(img.etag()).build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePrivate())
                .eTag(img.etag())
                .header("X-Content-Type-Options", "nosniff")
                .body(img.resource());
    }

}
