package com.ebook.repository;

import com.ebook.entity.BookOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<BookOrder, Integer> {
    List<BookOrder> findByEmail(String email);
}
