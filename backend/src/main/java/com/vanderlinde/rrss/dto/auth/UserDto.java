package com.vanderlinde.rrss.dto.auth;

import com.vanderlinde.rrss.model.Role;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> roleNames;
}
