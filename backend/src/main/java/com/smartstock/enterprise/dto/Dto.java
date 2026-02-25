package com.smartstock.enterprise.dto;

import lombok.Data;

public class Dto {
    @Data
    public static class LockRequest {
        private Long userId;
        private Long productId;
        private Integer quantity;
    }

    @Data
    public static class LoginRequest {
        private String mobileNumber;
    }
}
