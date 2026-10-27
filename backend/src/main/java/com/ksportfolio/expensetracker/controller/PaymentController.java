package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.payment.PaymentDto;
import com.ksportfolio.expensetracker.dto.payment.PaymentFilter;
import com.ksportfolio.expensetracker.dto.payment.PaymentRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiMessage;
import com.ksportfolio.expensetracker.dto.response.ApiPage;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<ApiPage<PaymentDto>>> getAll(
        @Valid @ModelAttribute PaymentFilter filter,
        @PageableDefault(size = 20, sort = "dueDate", direction = Sort.Direction.ASC)
        Pageable pageable
    ) {
        return new ApiResponse<>("Payments retrieved successfully", paymentService.getAll(filter, pageable))
                .toResponseEntity();
    }


    @GetMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<ApiResponse<PaymentDto>> getById(
        @PathVariable("id") Integer id
    ) {
        return new ApiResponse<>("Payment retrieved successfully",
                paymentService.getByIdAndUserId(id)).toResponseEntity();
    }

    @PostMapping(version = "1.0")
    public ResponseEntity<ApiResponse<Void>> create(
        @RequestBody @Valid PaymentRequestDto request
    ) {
        paymentService.create(request);
        return new ApiResponse<Void>("Payment added successfully", null)
                .toResponseEntity(HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<ApiResponse<Void>> update(
        @PathVariable("id") Integer id,
        @RequestBody @Valid PaymentRequestDto request
    ) {
        paymentService.update(id, request);
        return new ApiResponse<Void>("Payment updated successfully", null).toResponseEntity();
    }

    @DeleteMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") Integer id) {
        ApiMessage message = paymentService.delete(id);
        return new ApiResponse<Void>("Payment deleted successfully", null,List.of(message),null).toResponseEntity();
    }

    @PostMapping(value = "/{id}/complete", version = "1.0")
    public ResponseEntity<ApiResponse<Void>> complete(
        @PathVariable("id") Integer id,
        @RequestParam(required = false) Instant transactionDate
    ) {
        paymentService.complete(id, transactionDate != null ? transactionDate : Instant.now());
        return new ApiResponse<Void>("Payment completed successfully", null).toResponseEntity();
    }
}