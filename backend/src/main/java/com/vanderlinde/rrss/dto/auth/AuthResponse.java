package com.vanderlinde.rrss.dto.auth;

import lombok.Data;

@Data
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer ";

    private UserDto user;

    public AuthResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}
