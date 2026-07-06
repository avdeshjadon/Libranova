# Libranova - Full-Stack Library Management System

Libranova is a comprehensive, cloud-ready Library Management System designed specifically for digital libraries. It provides a seamless platform for users to browse, rent (borrow), and manage their favorite books and e-books, while giving administrators a powerful dashboard to manage inventory and user accounts.

Built with modern web technologies, it features a responsive frontend and a robust backend designed for easy deployment on free-tier cloud platforms.

## Tech Stack & Architecture

### Frontend (User Interface)
- **Framework:** React 19 (via Vite)
- **Routing:** React Router DOM
- **API Client:** Axios
- **Animations:** GSAP
- **Icons:** Lucide React & React Icons

### Backend (Core Services)
- **Framework:** Spring Boot 3.2.5 (Java 17)
- **Server:** Embedded Tomcat (No external setup required)
- **Data Access:** Spring Data JPA / Hibernate
- **Database:** MySQL (Configured for cloud platforms like Aiven)
- **Image Storage:** Base64 Encoding directly into MySQL (Cloud-persistent)

## Key Features

- **Role-Based Access Control:** Distinct views and permissions for Users and Administrators.
- **Admin Dashboard:** Manage book inventory, track rentals, and manage user accounts.
- **Base64 Image Uploads:** Book covers and user avatars are converted to Base64 strings and stored directly in the database, ensuring your images persist across ephemeral cloud servers.
- **Cloud-Ready Configuration:** Fully configured to use environment variables (`.env`) for database connections and API endpoints.

## Getting Started

For detailed step-by-step instructions on how to run this project locally or deploy it to the cloud (Aiven + Render + Vercel), please read the [run.md](./run.md) file.
