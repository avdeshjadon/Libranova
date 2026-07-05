package com.ebook.repository;

import com.ebook.entity.BookDtls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<BookDtls, Integer> {
    List<BookDtls> findByBookCategoryAndStatus(String bookCategory, String status);
    List<BookDtls> findByStatus(String status);
    List<BookDtls> findByBookNameContainingIgnoreCaseOrAuthorContainingIgnoreCase(String bookName, String author);
}
