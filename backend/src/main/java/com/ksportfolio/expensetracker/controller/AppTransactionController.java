package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionDto;
import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionFilter;
import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionRequestDto;
import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.AppTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class AppTransactionController {

    private final AppTransactionService appTransactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppTransactionDto>>> fetchAll(
        @AuthenticationPrincipal AppUserDetails appUserDetails,
        @Valid AppTransactionFilter filter
    ) {
        filter.setCurrentlyLoggedInUser(appUserDetails.getUserId());
        return new ApiResponse<>(
            "User Transaction List",
            appTransactionService.fetchAll(filter)
        ).toResponseEntity();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppTransactionDto>> fetchOne(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable Integer id
    ) {
        return new ApiResponse<>(
                "Transaction Details",
                appTransactionService.fetchOne(id,user.getUserId())
        ).toResponseEntity();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppTransactionDto>> create(
            @AuthenticationPrincipal AppUserDetails user,
            @Valid @RequestBody AppTransactionRequestDto request
    ) {
        return new ApiResponse<>(
                "Transaction Created",
                appTransactionService.create(user.getUserId(), request)
        ).toResponseEntity(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AppTransactionDto>> update(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable Integer id,
            @Valid @RequestBody AppTransactionRequestDto request
    ) {
        return new ApiResponse<>(
                "Transaction Updated",
                appTransactionService.update(user.getUserId(), id, request)
        ).toResponseEntity();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable Integer id
    ) {
        appTransactionService.delete(user.getUserId(), id);
        return new ApiResponse<Void>("Transaction Deleted", null).toResponseEntity();
    }

}
