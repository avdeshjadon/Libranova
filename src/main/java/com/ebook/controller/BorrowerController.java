package com.ebook.controller;

import com.ebook.entity.BookDtls;
import com.ebook.entity.Borrower;
import com.ebook.entity.User;
import com.ebook.repository.BookRepository;
import com.ebook.repository.BorrowerRepository;
import com.ebook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowerController {

    @Autowired
    private BorrowerRepository borrowerRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Borrower>> getAllBorrowers() {
        return ResponseEntity.ok(borrowerRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> addBorrower(@RequestParam int userId, @RequestParam int bookId, @RequestParam String note, @RequestParam String date, @RequestParam int rentDays, @RequestParam(required = false, defaultValue = "Cash") String paymentMode) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<BookDtls> bookOpt = bookRepository.findById(bookId);

        if (userOpt.isEmpty() || bookOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid User or Book ID");
        }

        BookDtls book = bookOpt.get();
        if (book.getAmountInStock() <= 0) {
            return ResponseEntity.badRequest().body("Book is out of stock!");
        }

        // Decrement stock
        book.setAmountInStock(book.getAmountInStock() - 1);
        if (book.getAmountInStock() == 0) {
            book.setStatus("Unavailable");
        }
        bookRepository.save(book);

        // Create Borrower record
        Borrower borrower = new Borrower();
        borrower.setMember(userOpt.get());
        borrower.setBook(book);
        borrower.setNote(note);
        borrower.setRentDays(rentDays);
        borrower.setBorrowDate(date);
        borrower.setPaymentMode(paymentMode);
        
        return ResponseEntity.ok(borrowerRepository.save(borrower));
    }
}
