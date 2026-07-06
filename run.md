# How to Run & Deploy Libranova

This guide contains everything you need to run the project locally on your machine or deploy it live on the internet.

## Part 1: Running Locally (Development)

### Prerequisites
- Java 17
- Node.js (v18+)
- Maven
- MySQL

### 1. Database Setup
You can use a local MySQL server or a cloud database like **Aiven**.
1. Create a database named `ebook` (if running locally).
2. The project uses a `.env` file for configuration. Create a file named `.env` in the root folder of the backend (`/Libranova/.env`) and add your credentials:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/ebook?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   DB_USERNAME=root
   DB_PASSWORD=your_password
   PORT=8081
   ```

### 2. Start the Backend
1. Open a terminal in the root `Libranova/` folder.
2. Run the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on `http://localhost:8081`. 
*Note: The embedded Tomcat server will automatically handle requests. No external Tomcat installation is needed. The `DatabaseMigrationConfig` will automatically adjust table schemas for Base64 images on startup.*

### 3. Start the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

---

## Part 2: Deployment Guide (Production)

To host this project for free for your resume, follow these steps:

### 1. Database Setup (Aiven)
1. Go to [Aiven.io](https://aiven.io/) and create a free MySQL database.
2. Copy the **Service URI** provided in the Aiven dashboard.

### 2. Backend Deployment (Render)
1. Push your complete code to GitHub.
2. Go to [Render.com](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Build Command: `mvn clean package -DskipTests`
5. Set the Start Command: `java -jar target/ebook-backend-1.0.0-SNAPSHOT.jar`
6. Under **Environment Variables**, add the following:
   - `DB_URL`: The JDBC version of your Aiven URI (It should look like: `jdbc:mysql://your-aiven-host:port/defaultdb?useSSL=true`)
   - `DB_USERNAME`: Your Aiven username
   - `DB_PASSWORD`: Your Aiven password
   - `PORT`: `8080` (Render requires 8080 or port matching)
7. Deploy the backend and copy its live URL (e.g., `https://libranova-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and import your GitHub repository.
2. Important: Set the **Root Directory** to `frontend`.
3. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The live URL of your Render backend you copied in the previous step.
4. Click **Deploy**.

Your project is now completely live and ready to be linked on your resume!
