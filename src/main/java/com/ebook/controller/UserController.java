package com.ebook.controller;

import com.ebook.entity.User;
import com.ebook.repository.UserRepository;
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
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam(value = "profilePicString", required = false) String profilePicString) {
        
        return userRepository.findById(id).map(user -> {
            if (name != null && !name.isEmpty()) user.setName(name);
            if (email != null && !email.isEmpty()) user.setEmail(email);
            if (phno != null && !phno.isEmpty()) user.setPhno(phno);
            if (password != null && !password.isEmpty()) user.setPassword(password);
            
            if (profileImage != null && !profileImage.isEmpty()) {
                if (user.getProfilePic() != null && !user.getProfilePic().equals("default-avatar.png") && !user.getProfilePic().startsWith("http")) {
                    try {
                        Files.deleteIfExists(Paths.get("frontend/public/avatars/" + user.getProfilePic()));
                    } catch (Exception e) {}
                }
                
                String fileName = System.currentTimeMillis() + "_" + profileImage.getOriginalFilename().replaceAll("\\s+", "_");
                try {
                    Path path = Paths.get("frontend/public/avatars/" + fileName);
                    Files.createDirectories(path.getParent());
                    Files.write(path, profileImage.getBytes());
                    user.setProfilePic(fileName);
                } catch (Exception e) {}
            } else if (profilePicString != null && !profilePicString.isEmpty()) {
                user.setProfilePic(profilePicString);
            }
            
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
