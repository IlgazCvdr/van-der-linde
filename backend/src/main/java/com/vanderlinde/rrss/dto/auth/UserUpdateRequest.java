package com.vanderlinde.rrss.dto.auth;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserUpdateRequest {
    private int userId;
    private String firstName;
    private String lastName;
    private String password;
    private String confirmPassword;
    private MultipartFile image ;
}