# Libranova - Library Management System

Libranova is a comprehensive Library Management System designed specifically for digital libraries. It provides a seamless platform for users to browse, rent (borrow), and manage their favorite books and e-books. It features a modern, responsive frontend and a robust backend to handle library inventory, user authentication, and book circulation/rentals.

## Tech Stack

### Frontend
- React 19 (via Vite)
- React Router DOM for navigation
- Axios for API requests
- GSAP for animations
- Recharts for data visualization
- Lucide React and React Icons for iconography

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring Web
- Spring Data JPA
- MySQL Database
- Lombok

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- Node.js (version 18 or higher)
- npm (Node Package Manager)
- Java Development Kit (JDK 17)
- Maven
- MySQL Server

## Getting Started

Follow these steps to set up the project locally.

### 1. Database Setup

Create a new MySQL database for the application. Update the database credentials in the backend configuration file (`src/main/resources/application.properties` or `application.yml`).

### 2. Backend Setup

1. Navigate to the project root directory.
2. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The backend server will start (usually on `http://localhost:8080`).

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL in your browser to view the application.

## Features

- Browse a wide collection of books and digital materials across various categories (Programming, Business, Fiction, Sci-Fi).
- User authentication (Login and Registration).
- Manage personal rentals (My Rentals).
- Interactive UI with animations using GSAP.

## Project Structure

- `frontend/`: Contains the React application code.
- `src/main/java/com/ebook/`: Contains the Spring Boot backend source code (Library Core Services).
- `pom.xml`: Maven configuration file for backend dependencies.

## License

This project is licensed under the MIT License.
