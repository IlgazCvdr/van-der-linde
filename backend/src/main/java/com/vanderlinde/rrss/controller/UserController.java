package com.vanderlinde.rrss.controller;

import com.vanderlinde.rrss.dto.auth.*;
import com.vanderlinde.rrss.model.UserEntity;
import com.vanderlinde.rrss.repository.PasswordRequestRepository;
import com.vanderlinde.rrss.repository.UserRepository;
import com.vanderlinde.rrss.service.UserService;
import jakarta.persistence.PostRemove;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private final UserRepository userRepository;


    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/get")
    public ResponseEntity<UserDto> getUser(@RequestParam int userId){
        return userService.getUser(userId);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {
        return userService.register(req);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        return userService.login(req);
    }

    @GetMapping("/whoami")
    public ResponseEntity<UserDto> whoami(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Optional<UserEntity> user = userRepository.findByEmail(email);
            if(user.isEmpty()) return null;
            return ResponseEntity.status(HttpStatus.OK).body(user.get().convertToUserDto());
        } else {
            return null;
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateUser(
                                             @RequestParam("userId") int userId,
                                             @RequestParam("firstName") String firstName,
                                             @RequestParam("lastName") String lastName,
                                             @RequestParam(value = "password", required = false) String password,
                                             @RequestParam(value = "confirmPassword", required = false) String confirmPassword,
                                             @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setUserId(userId);
        req.setFirstName(firstName);
        req.setLastName(lastName);
        req.setPassword(password);
        req.setConfirmPassword(confirmPassword);
        req.setImage(image);
        return userService.updateUser(req);
    }

    @GetMapping("/get-image")
    public ResponseEntity<?> getUserImage(@RequestParam int userId) {
        return userService.getUserImage(userId);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestParam int userId){
        return userService.deleteUser(userId);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email){
        return userService.sendNewPasswordRequest(email);
    }
}