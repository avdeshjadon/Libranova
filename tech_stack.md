# Libranova Technology Stack

This document outlines all the technologies, frameworks, and cloud services utilized in building and deploying the Libranova project. 

## Frontend (User Interface)
*   **React 19 (via Vite):** The core JavaScript library used for building the user interface. Vite is used as the build tool for faster development and optimized production bundles.
*   **React Router DOM:** Used for handling navigation and routing between different pages (Home, Login, Dashboard) without reloading the page.
*   **Axios:** Used for making asynchronous HTTP requests to the Spring Boot backend API.
*   **GSAP:** Used for creating smooth page transitions and micro-animations throughout the frontend.
*   **Lucide React & React Icons:** Provided the SVG iconography used in the navigation bars, buttons, and tables.

## Authentication
*   **Firebase Authentication:** Used to seamlessly integrate Google and GitHub OAuth login flows. It acts as the secure middleman between the frontend application and the OAuth providers.

## Backend (Core Services)
*   **Java 17:** The primary programming language used for the backend logic.
*   **Spring Boot (3.2.5):** The core framework used to build the RESTful API, handle business logic, and manage application configuration.
*   **Spring Data JPA & Hibernate:** Used as the Object-Relational Mapping (ORM) layer to translate Java objects into database tables and manage database queries without writing raw SQL.
*   **Embedded Tomcat:** The default web server built into Spring Boot, allowing the application to run as a standalone JAR file without needing an external web server installation.

## Database
*   **MySQL:** The relational database management system used to store all application data, including users, books, orders, and borrower records.
*   **Base64 Image Storage:** Instead of using an external bucket like AWS S3, user avatars and book cover images are converted to Base64 strings by the frontend and stored directly inside the MySQL database in a LONGTEXT column.

## Cloud Infrastructure & Deployment
*   **Vercel:** Used to deploy and host the React frontend. It automatically builds the Vite project and serves the static files on a global CDN.
*   **Render:** Used to deploy and host the Spring Boot Java backend. It runs the Maven build process and hosts the resulting JAR file as a live web service.
*   **Aiven:** Used to host the live, cloud-based MySQL database. Both the Render backend and the local development environment connect to this database via its Service URI.
