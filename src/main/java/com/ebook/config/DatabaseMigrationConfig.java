package com.ebook.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationConfig implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Forcefully update the columns to LONGTEXT to support Base64 images.
            // Hibernate's ddl-auto=update often fails to alter existing VARCHAR columns.
            jdbcTemplate.execute("ALTER TABLE book_dtls MODIFY COLUMN photo_name LONGTEXT");
            System.out.println("Successfully altered book_dtls.photo_name to LONGTEXT");
        } catch (Exception e) {
            System.out.println("Could not alter book_dtls.photo_name: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN profile_pic LONGTEXT");
            System.out.println("Successfully altered users.profile_pic to LONGTEXT");
        } catch (Exception e) {
            System.out.println("Could not alter users.profile_pic: " + e.getMessage());
        }
    }
}
