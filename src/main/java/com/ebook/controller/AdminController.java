package com.ebook.controller;

import com.ebook.entity.BookDtls;
import com.ebook.entity.User;
import com.ebook.repository.BookRepository;
import com.ebook.repository.UserRepository;
import com.ebook.repository.BorrowerRepository;
import com.ebook.repository.CartRepository;
import com.ebook.repository.OrderRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowerRepository borrowerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @DeleteMapping("/data/all")
    @Transactional
    public ResponseEntity<?> deleteAllData() {
        borrowerRepository.deleteAll();
        cartRepository.deleteAll();
        orderRepository.deleteAll();
        bookRepository.deleteAll();
        
        userRepository.findAll().forEach(user -> {
            if (!"ADMIN".equals(user.getRole())) {
                userRepository.delete(user);
            }
        });
        
        return ResponseEntity.ok().build();
    }

    // --- User Management APIs ---

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> toggleBlockUser(@PathVariable int id, @RequestParam boolean block) {
        return userRepository.findById(id).map(user -> {
            user.setBlocked(block);
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/subscription")
    public ResponseEntity<?> updateSubscription(@PathVariable int id, @RequestParam String plan) {
        return userRepository.findById(id).map(user -> {
            user.setSubscription(plan);
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Book Management APIs ---

    @PostMapping("/books")
    public ResponseEntity<?> addBook(@RequestBody BookDtls book) {
        // Force basic defaults if missing
        if (book.getStatus() == null) book.setStatus("Active");
        if (book.getPhotoName() == null) book.setPhotoName("default.jpg");
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @PostMapping("/books/with-cover")
    public ResponseEntity<?> addBookWithCover(
            @RequestParam("bookName") String bookName,
            @RequestParam("author") String author,
            @RequestParam("bookCategory") String bookCategory,
            @RequestParam("price") String price,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
        
        String fileName = "default.jpg";
        if (coverImage != null && !coverImage.isEmpty()) {
            fileName = System.currentTimeMillis() + "_" + coverImage.getOriginalFilename().replaceAll("\\s+", "_");
            try {
                Path path = Paths.get("frontend/public/books/" + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, coverImage.getBytes());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        BookDtls book = new BookDtls();
        book.setBookName(bookName);
        book.setAuthor(author);
        book.setBookCategory(bookCategory);
        book.setPrice(price);
        book.setStatus("Active");
        book.setPhotoName(fileName);
        
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<?> updateBook(@PathVariable int id, @RequestBody BookDtls bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setBookName(bookDetails.getBookName());
            book.setAuthor(bookDetails.getAuthor());
            book.setPrice(bookDetails.getPrice());
            book.setBookCategory(bookDetails.getBookCategory());
            book.setStatus(bookDetails.getStatus());
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable int id) {
        return bookRepository.findById(id).map(book -> {
            bookRepository.delete(book);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
