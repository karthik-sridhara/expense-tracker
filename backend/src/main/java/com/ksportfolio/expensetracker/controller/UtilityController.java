package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/utilities")
public class UtilityController {

    @GetMapping("/{password}/password-hash")
    public ResponseEntity<ApiResponse<String>> getUser(@PathVariable String password) {
        String hash = new BCryptPasswordEncoder().encode(password);
        ApiResponse<String> response = new ApiResponse<>(
                "Generated password hash successfully for: "+password,hash
        );
        return response.toResponseEntity();
    }

}
