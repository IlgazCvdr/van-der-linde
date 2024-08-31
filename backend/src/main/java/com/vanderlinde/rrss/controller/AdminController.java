package com.vanderlinde.rrss.controller;


import com.vanderlinde.rrss.dto.auth.ResponseRequest;
import com.vanderlinde.rrss.dto.auth.UserDto;
import com.vanderlinde.rrss.model.PasswordRequestEntity;
import com.vanderlinde.rrss.model.UserEntity;
import com.vanderlinde.rrss.repository.UserRepository;
import com.vanderlinde.rrss.service.EmailService;
import com.vanderlinde.rrss.service.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.vanderlinde.rrss.repository.RoleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/approve")
    public ResponseEntity<String> approveUserRegistration(@RequestBody ResponseRequest req) {
        return userService.approveRegisterRequest(req.getUserId());
    }

    @PostMapping("/reject")
    public ResponseEntity<String> rejectUserRegistration(@RequestBody ResponseRequest req) {
        return userService.rejectRegisterRequest(req.getUserId());
    }

    @GetMapping("/pending-users")
    public ResponseEntity<List<UserDto>> pendingUsers() {
        return userService.getUsersWithPendingRole();
    }

    @PostMapping("/ban")
    public ResponseEntity<String> banUser(@RequestBody ResponseRequest req) {
        return userService.banUser(req.getUserId());
    }

    @PostMapping("/send-new-password")
    public ResponseEntity<String> sendNewPassword(@RequestParam int requestId) {
        String newPassword = userService.generatePassword();
        emailService.sendEmail(requestId, "New Password for RRSS", newPassword);
        return userService.updatePassword(requestId, newPassword);
    }

    @GetMapping("/password-requests")
    public ResponseEntity<List<PasswordRequestEntity>> getPasswordRequests() {
        return userService.getAllPasswordRequests();
    }

}
