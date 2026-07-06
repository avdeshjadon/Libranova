package com.ebook.controller;

import com.ebook.entity.User;
import com.ebook.repository.UserRepository;
import com.ebook.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Simulated OTP storage (In-memory for demo purposes)
    private static final java.util.concurrent.ConcurrentHashMap<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isBlocked()) {
                return ResponseEntity.status(403).body("Account is blocked. Contact administrator.");
            }
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/oauth")
    public ResponseEntity<?> oauthLogin(@RequestBody User oauthRequest) {
        Optional<User> existingUser = userRepository.findByEmail(oauthRequest.getEmail());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.isBlocked()) {
                return ResponseEntity.status(403).body("Account is blocked. Contact administrator.");
            }
            return ResponseEntity.ok(user);
        } else {
            // Register new user automatically
            User newUser = new User();
            newUser.setEmail(oauthRequest.getEmail());
            newUser.setName(oauthRequest.getName());
            newUser.setProfilePic(oauthRequest.getProfilePic());
            newUser.setAuthProvider(oauthRequest.getAuthProvider());
            newUser.setPassword(""); // Empty password for OAuth users initially
            
            User savedUser = userRepository.save(newUser);
            return ResponseEntity.ok(savedUser);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable int id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            if (userDetails.getName() != null) user.setName(userDetails.getName());
            if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
            if (userDetails.getPhno() != null) user.setPhno(userDetails.getPhno());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(userDetails.getPassword());
            }
            // more fields as needed
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfileWithAvatar(
            @PathVariable int id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phno", required = false) String phno,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "landmark", required = false) String landmark,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "pincode", required = false) String pincode,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam(value = "profilePicString", required = false) String profilePicString) {
        
        return userRepository.findById(id).map(user -> {
            if (name != null && !name.isEmpty()) user.setName(name);
            if (email != null && !email.isEmpty()) user.setEmail(email);
            if (phno != null && !phno.isEmpty()) user.setPhno(phno);
            if (password != null && !password.isEmpty()) user.setPassword(password);
            if (address != null) user.setAddress(address);
            if (landmark != null) user.setLandmark(landmark);
            if (city != null) user.setCity(city);
            if (state != null) user.setState(state);
            if (pincode != null) user.setPincode(pincode);
            
            if (profileImage != null && !profileImage.isEmpty()) {
                try {
                    String base64Image = java.util.Base64.getEncoder().encodeToString(profileImage.getBytes());
                    String contentType = profileImage.getContentType();
                    if (contentType == null) contentType = "image/jpeg";
                    user.setProfilePic("data:" + contentType + ";base64," + base64Image);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (profilePicString != null && !profilePicString.isEmpty()) {
                user.setProfilePic(profilePicString);
            }
            
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not found in our system.");
        }
        
        // Generate 6 digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        otpStorage.put(email, otp);
        
        // Send actual email
        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok(java.util.Map.of("message", "OTP sent successfully to your email."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email. Please try again.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        if (email != null && otp != null && otpStorage.containsKey(email) && otpStorage.get(email).equals(otp.trim())) {
            return ResponseEntity.ok("OTP verified successfully.");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");
        
        if (email == null || otp == null || !otpStorage.containsKey(email) || !otpStorage.get(email).equals(otp.trim())) {
            return ResponseEntity.badRequest().body("Invalid session or OTP.");
        }
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            otpStorage.remove(email); // clear OTP after use
            return ResponseEntity.ok("Password reset successfully.");
        }
        return ResponseEntity.badRequest().body("User not found.");
    }
}
