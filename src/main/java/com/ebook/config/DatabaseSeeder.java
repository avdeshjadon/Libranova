package com.ebook.config;

import com.ebook.entity.BookDtls;
import com.ebook.entity.User;
import com.ebook.repository.BookRepository;
import com.ebook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User
        if (userRepository.findByEmail("admin@library.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@library.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setSubscription("PREMIUM");
            userRepository.save(admin);
            System.out.println("✅ Default Admin User created: admin@library.com / admin123");
        }

        // Dummy book seeding removed per user request. 
        // Library will now remain completely empty for manual population via the Admin Panel.
    }
}
