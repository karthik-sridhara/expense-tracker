package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentDto;
import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentFilter;
import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiPage;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.RecurringPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recurring-payments")
public class RecurringPaymentController {

    private final RecurringPaymentService recurringPaymentService;

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<ApiPage<RecurringPaymentDto>>> getAll(
            @AuthenticationPrincipal AppUserDetails user,
            @Valid @ModelAttribute RecurringPaymentFilter filter,
            @PageableDefault(size = 20, sort = "modifiedAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        filter.appSetUser(user.getUserId());
        return new ApiResponse<>("Recurring payments retrieved successfully",
                recurringPaymentService.getAllByUser(filter, pageable)).toResponseEntity();
    }

    @GetMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<ApiResponse<RecurringPaymentDto>> getById(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable("id") Integer id
    ) {
        return new ApiResponse<>("Recurring payment retrieved successfully",
                recurringPaymentService.getByUser(id, user.getUserId())).toResponseEntity();
    }

    @PostMapping(version = "1.0")
    public ResponseEntity<ApiResponse<RecurringPaymentDto>> create(
            @AuthenticationPrincipal AppUserDetails user,
            @RequestBody @Valid RecurringPaymentRequestDto request
    ) {
        return new ApiResponse<>("Recurring payment created successfully",
                recurringPaymentService.create(user.getUserId(), request))
                .toResponseEntity(HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<ApiResponse<RecurringPaymentDto>> update(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable("id") Integer id,
            @RequestBody @Valid RecurringPaymentRequestDto request
    ) {
        return new ApiResponse<>("Recurring payment updated successfully",
                recurringPaymentService.update(user.getUserId(), id, request)).toResponseEntity();
    }

    @PatchMapping(value = "/{id}/pause", version = "1.0")
    public ResponseEntity<ApiResponse<RecurringPaymentDto>> pause(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable("id") Integer id
    ) {
        return new ApiResponse<>("Recurring payment paused successfully",
                recurringPaymentService.pause(user.getUserId(), id)).toResponseEntity();
    }

    @PatchMapping(value = "/{id}/resume", version = "1.0")
    public ResponseEntity<ApiResponse<RecurringPaymentDto>> resume(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable("id") Integer id
    ) {
        return new ApiResponse<>("Recurring payment resumed successfully",
                recurringPaymentService.resume(user.getUserId(), id)).toResponseEntity();
    }

    @DeleteMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal AppUserDetails user,
            @PathVariable("id") Integer id
    ) {
        recurringPaymentService.delete(user.getUserId(), id);
        return new ApiResponse<Void>("Recurring payment deleted successfully", null).toResponseEntity();
    }
}