package com.ebook.controller;

import com.ebook.entity.Cart;
import com.ebook.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @GetMapping("/user/{userId}")
    public List<Cart> getCartByUser(@PathVariable int userId) {
        return cartRepository.findByUserId(userId);
    }

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        return cartRepository.save(cart);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> removeFromCart(@PathVariable int cartId) {
        return cartRepository.findById(cartId).map(cart -> {
            cartRepository.delete(cart);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable int userId) {
        List<Cart> items = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(items);
        return ResponseEntity.ok().build();
    }
}
