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

        // 2. Seed 100+ Books if Library is empty
        if (bookRepository.count() == 0) {
            System.out.println("📚 Library is empty. Seeding initial catalog...");
            List<BookDtls> books = new ArrayList<>();
            
            String[] categories = {"Programming", "Fiction", "Sci-Fi", "Business", "Self-Help"};
            String[] statuses = {"Active", "Inactive"};
            
            // Generate basic famous books
            String[][] famousBooks = {
                {"Clean Code", "Robert C. Martin", "Programming"},
                {"The Pragmatic Programmer", "Andrew Hunt", "Programming"},
                {"Design Patterns", "Erich Gamma", "Programming"},
                {"Introduction to Algorithms", "Thomas H. Cormen", "Programming"},
                {"Cracking the Coding Interview", "Gayle Laakmann McDowell", "Programming"},
                
                {"1984", "George Orwell", "Sci-Fi"},
                {"Dune", "Frank Herbert", "Sci-Fi"},
                {"Foundation", "Isaac Asimov", "Sci-Fi"},
                {"Neuromancer", "William Gibson", "Sci-Fi"},
                {"The Martian", "Andy Weir", "Sci-Fi"},
                
                {"The Great Gatsby", "F. Scott Fitzgerald", "Fiction"},
                {"To Kill a Mockingbird", "Harper Lee", "Fiction"},
                {"Pride and Prejudice", "Jane Austen", "Fiction"},
                {"The Catcher in the Rye", "J.D. Salinger", "Fiction"},
                {"The Alchemist", "Paulo Coelho", "Fiction"},
                
                {"Think and Grow Rich", "Napoleon Hill", "Business"},
                {"Zero to One", "Peter Thiel", "Business"},
                {"The Lean Startup", "Eric Ries", "Business"},
                {"Good to Great", "Jim Collins", "Business"},
                {"Rich Dad Poor Dad", "Robert Kiyosaki", "Business"},
                
                {"Atomic Habits", "James Clear", "Self-Help"},
                {"Deep Work", "Cal Newport", "Self-Help"},
                {"The Power of Habit", "Charles Duhigg", "Self-Help"},
                {"Thinking, Fast and Slow", "Daniel Kahneman", "Self-Help"},
                {"Mindset", "Carol S. Dweck", "Self-Help"}
            };

            for (String[] bookInfo : famousBooks) {
                BookDtls b = new BookDtls();
                b.setBookName(bookInfo[0]);
                b.setAuthor(bookInfo[1]);
                b.setBookCategory(bookInfo[2]);
                b.setPrice(String.valueOf(400 + (Math.random() * 800))); 
                
                int stock = (int)(Math.random() * 10) + 1;
                b.setTotalCopies(stock);
                b.setAmountInStock(stock);
                
                b.setStatus("Available");
                b.setPhotoName("default.jpg");
                b.setEmail("admin@library.com");
                books.add(b);
            }
            
            // Generate more to reach ~100
            for (int i = 26; i <= 100; i++) {
                BookDtls b = new BookDtls();
                b.setBookName("Library Collection Vol " + i);
                b.setAuthor("Author " + (i % 20));
                b.setBookCategory(categories[i % categories.length]);
                b.setPrice(String.valueOf(200 + (Math.random() * 500)));
                
                int stock = (int)(Math.random() * 15) + 1;
                b.setTotalCopies(stock);
                b.setAmountInStock(stock);
                
                b.setStatus("Available");
                b.setPhotoName("default.jpg");
                b.setEmail("admin@library.com");
                books.add(b);
            }

            bookRepository.saveAll(books);
            System.out.println("✅ Seeded " + books.size() + " books into the library!");
        }
    }
}
