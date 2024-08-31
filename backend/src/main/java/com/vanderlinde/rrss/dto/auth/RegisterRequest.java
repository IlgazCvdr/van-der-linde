package com.vanderlinde.rrss.dto.auth;

import com.vanderlinde.rrss.model.UserEntity;
import lombok.Data;

@Data
public class RegisterRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String confirmPassword;

    private String accountType;
}
