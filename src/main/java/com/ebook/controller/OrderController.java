package com.ebook.controller;

import com.ebook.entity.BookOrder;
import com.ebook.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<BookOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/user/{email}")
    public List<BookOrder> getOrdersByUser(@PathVariable String email) {
        return orderRepository.findByEmail(email);
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody List<BookOrder> orders) {
        List<BookOrder> savedOrders = orderRepository.saveAll(orders);
        return ResponseEntity.ok(savedOrders);
    }
}
