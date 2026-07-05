package com.ebook.controller;

import com.ebook.entity.BookDtls;
import com.ebook.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<BookDtls> getAllBooks() {
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDtls> getBookById(@PathVariable int id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recent")
    public List<BookDtls> getRecentBooks() {
        return bookRepository.findByStatus("Active"); // Simplified
    }

    @GetMapping("/new")
    public List<BookDtls> getNewBooks() {
        return bookRepository.findByBookCategoryAndStatus("New", "Active");
    }

    @GetMapping("/old")
    public List<BookDtls> getOldBooks() {
        return bookRepository.findByBookCategoryAndStatus("Old", "Active");
    }

    @PostMapping
    public BookDtls addBook(@RequestBody BookDtls book) {
        return bookRepository.save(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDtls> updateBook(@PathVariable int id, @RequestBody BookDtls bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setBookName(bookDetails.getBookName());
            book.setAuthor(bookDetails.getAuthor());
            book.setPrice(bookDetails.getPrice());
            book.setBookCategory(bookDetails.getBookCategory());
            book.setStatus(bookDetails.getStatus());
            book.setPhotoName(bookDetails.getPhotoName());
            book.setEmail(bookDetails.getEmail());
            book.setTotalCopies(bookDetails.getTotalCopies());
            book.setAmountInStock(bookDetails.getAmountInStock());
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable int id) {
        return bookRepository.findById(id).map(book -> {
            bookRepository.delete(book);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
