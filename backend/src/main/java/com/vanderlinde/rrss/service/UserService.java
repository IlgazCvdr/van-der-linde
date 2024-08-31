package com.vanderlinde.rrss.service;

import com.vanderlinde.rrss.dto.auth.UserUpdateRequest;
import com.vanderlinde.rrss.dto.auth.*;
import com.vanderlinde.rrss.model.*;
import com.vanderlinde.rrss.repository.*;
import com.vanderlinde.rrss.security.JwtGenerator;
import jakarta.annotation.PostConstruct;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordRequestRepository passwordRequestRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    JwtGenerator jwtGenerator;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void init() {
        if (userRepository.existsByEmail("admin1@admin.com")) return;
        String hashedPassword = encoder.encode("admin");
        List<Role> roles = new ArrayList<>();
        roles.add(roleRepository.findByName("USER"));
        roles.add(roleRepository.findByName("MERCHANT"));
        roles.add(roleRepository.findByName("ADMIN"));
        UserEntity admin = new UserEntity();
        admin.setEmail("admin1@admin.com");
        admin.setFirstName("admin");
        admin.setLastName("admin");
        admin.setPassword(hashedPassword);
        admin.setRoles(roles);
        userRepository.save(admin);
    }

    public ResponseEntity<UserDto> getUser(@RequestParam int userId){
        Optional<UserEntity> user = userRepository.findById(userId);
        if(user.isEmpty()) return null;
        return new ResponseEntity<>(user.get().convertToUserDto(), HttpStatus.OK);
    }

    public Optional<UserEntity> getUser(Authentication authentication){
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail);
    }

    public ResponseEntity<String> register(@RequestBody RegisterRequest req){
        if(!req.getConfirmPassword().equals(req.getPassword()))
            return ResponseEntity.badRequest().body("Passwords do not match");
        if(userRepository.existsByEmail(req.getEmail()))
            return ResponseEntity.badRequest().body("User already exists");
        String hashedPassword = encoder.encode(req.getPassword());
        List<Role> roles = new ArrayList<>();
        roles.add(roleRepository.findByName("USER"));
        roles.add(roleRepository.findByName("PENDING"));
        if(req.getAccountType().equalsIgnoreCase("merchant")) roles.add(roleRepository.findByName("MERCHANT"));
        UserEntity newUser = new UserEntity();
        newUser.setEmail(req.getEmail());
        newUser.setFirstName(req.getFirstName());
        newUser.setLastName(req.getLastName());
        newUser.setPassword(hashedPassword);
        newUser.setRoles(roles);
        userRepository.save(newUser);
        return ResponseEntity.ok("User register request sent successfully");
    }

    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try{
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail(),
                            req.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtGenerator.generateToken(auth);
            Optional<UserEntity> user = userRepository.findByEmail(auth.getName());
            if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            if(user.get().checkRole("PENDING")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Your account have not approved yet");
            }
            if(user.get().checkRole("REJECTED") || user.get().checkRole("BANNED"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You have been rejected/banned");
            UserDto userDto = user.get().convertToUserDto();
            AuthResponse response = new AuthResponse(token);
            response.setUser(userDto);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch(AuthenticationException e){
            Optional<UserEntity> user = userRepository.findByEmail(req.getEmail());
            if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            if(user.get().checkRole("REJECTED") || user.get().checkRole("BANNED"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You have been rejected/banned");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong username or password");
        }
    }

    public ResponseEntity<String> approveRegisterRequest(int userId){
        Optional<UserEntity> pendingUser = userRepository.findById(userId);
        if(pendingUser.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        if(!pendingUser.get().checkRole("PENDING")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is already registered");
        pendingUser.get().removeRole("PENDING");
        userRepository.save(pendingUser.get());
        return ResponseEntity.status(HttpStatus.OK).body("User approved");
    }

    public ResponseEntity<String> rejectRegisterRequest(int userId){
        Optional<UserEntity> pendingUser = userRepository.findById(userId);
        if(pendingUser.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        if(!pendingUser.get().checkRole("PENDING")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is already registered");
        pendingUser.get().removeRole("PENDING");
        if(pendingUser.get().checkRole("USER")) pendingUser.get().removeRole("USER");
        if(pendingUser.get().checkRole("MERCHANT")) pendingUser.get().removeRole("MERCHANT");
        pendingUser.get().getRoles().add(roleRepository.findByName("REJECTED"));
        userRepository.save(pendingUser.get());
        return ResponseEntity.status(HttpStatus.OK).body("User rejected");
    }

    public ResponseEntity<List<UserDto>> getUsersWithPendingRole() {
        List<UserEntity> users = userRepository.findUsersWithPendingRole();
        List<UserDto> userDtos = new ArrayList<>();
        for(UserEntity user : users){
            userDtos.add(user.convertToUserDto());
        }
        return ResponseEntity.status(HttpStatus.OK).body(userDtos);
    }

    public ResponseEntity<String> banUser(int userId){
        Optional<UserEntity> banned = userRepository.findById(userId);
        if(banned.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        UserEntity bannedUser = banned.get();
        List<Review> userReviews = reviewRepository.findAllByUserId(userId);
        if(!userReviews.isEmpty())
            reviewRepository.deleteAll(userReviews);
        if(bannedUser.checkRole("USER")) bannedUser.removeRole("USER");
        if(bannedUser.checkRole("MERCHANT")) {
            List<Product> merchantProducts = productRepository.findAllByMerchantId(userId);
            if(!merchantProducts.isEmpty())
                productRepository.deleteAll(merchantProducts);
            bannedUser.removeRole("MERCHANT");
        }
        if(bannedUser.checkRole("PENDING")) bannedUser.removeRole("PENDING");
        if(bannedUser.checkRole("REJECTED")) bannedUser.removeRole("REJECTED");
        bannedUser.getRoles().add(roleRepository.findByName("BANNED"));
        userRepository.save(bannedUser);
        return ResponseEntity.status(HttpStatus.OK).body("User banned");
    }

    public ResponseEntity<String> updatePassword(int id, String password){
        Optional<PasswordRequestEntity> passwordRequest = passwordRequestRepository.findById(id);
        if(passwordRequest.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        Optional<UserEntity> user = userRepository.findByEmail(passwordRequest.get().getEmail());
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        UserEntity userEntity = user.get();
        String hashedPassword = encoder.encode(password);
        userEntity.setPassword(hashedPassword);
        userRepository.save(userEntity);
        passwordRequestRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("User updated");
    }


    public ResponseEntity<String> updateUser(@RequestBody UserUpdateRequest req) throws IOException {
        Optional<UserEntity> optionalUserEntity = userRepository.findById(req.getUserId());
        if(optionalUserEntity.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        UserEntity userEntity = optionalUserEntity.get();

        if (req.getFirstName() != null && !req.getFirstName().equals("")) {
            userEntity.setFirstName(req.getFirstName());
        }
        if (req.getLastName() != null && !req.getLastName().equals("")) {
            userEntity.setLastName(req.getLastName());
        }

        if (req.getPassword() != null && !req.getPassword().equals("") && req.getConfirmPassword() != null && !req.getConfirmPassword().equals("")) {
            if(!req.getPassword().equals(req.getConfirmPassword())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Passwords do not match");
            String hashedPassword = encoder.encode(req.getPassword());
            userEntity.setPassword(hashedPassword);
        }

        if (req.getImage() != null && !req.getImage().isEmpty()) {
            userEntity.setImage(req.getImage().getBytes());
        }

        userRepository.save(userEntity);
        return ResponseEntity.ok("User updated successfully");
    }

    public ResponseEntity<?> getUserImage(int userId){
        Optional<UserEntity> optionalUser = userRepository.findById(userId);
        if(optionalUser.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        UserEntity user = optionalUser.get();
        byte[] image = user.getImage();
        if(image == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User image not found");
        return ResponseEntity.status(HttpStatus.OK).body(image);
    }

    public ResponseEntity<String> deleteUser(int userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserEntity> user = getUser(authentication);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        UserEntity userEntity = user.get();
        if(!userEntity.checkRole("ADMIN") && userEntity.getId() != userId) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorized");
        Optional<UserEntity> userToDelete = userRepository.findById(userId);
        if(userToDelete.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        userRepository.delete(userToDelete.get());
        return ResponseEntity.ok("User deleted successfully");
    }

    public ResponseEntity<String> sendNewPasswordRequest(String email){
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        PasswordRequestEntity req = new PasswordRequestEntity();
        req.setEmail(email);
        passwordRequestRepository.save(req);
        return ResponseEntity.ok("New password request sent");
    }

    public ResponseEntity<List<PasswordRequestEntity>> getAllPasswordRequests() {
        List<PasswordRequestEntity> requests = passwordRequestRepository.findAll();
        if(requests.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(requests);
        return ResponseEntity.status(HttpStatus.OK).body(requests);
    }

    public String generatePassword(){
        final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        int length = 9;
        Random random = new Random();

        StringBuilder stringBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            stringBuilder.append(CHARACTERS.charAt(randomIndex));
        }
        return stringBuilder.toString();

    }

}
