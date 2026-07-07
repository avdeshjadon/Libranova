# How to Run & Deploy Libranova

This guide contains everything you need to know about working on this project locally vs running it in production.

---

## 🛠️ The Local Workflow (Recommended)
You do **not** need to run the Java backend locally if you are only making changes to the UI/Frontend. Your local frontend will automatically talk to your live production database via your live Render backend!

### 1. Working on Frontend (UI/Design) Only
1. Open a terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Make sure your `frontend/.env` has the cloud URL active:
   ```env
   VITE_API_BASE_URL=https://libranova.onrender.com
   # VITE_API_BASE_URL=http://localhost:8081
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
*That's it! Any changes you make to the UI will instantly reload on `http://localhost:5173`, and it will fetch real data from the cloud.*

### 2. Working on Backend (Java/Spring Boot)
If you need to change API logic or add new Java features, you must run the backend locally to test it.
1. Make sure your backend `Libranova/.env` is set up with Aiven (so your local Java server connects to the live DB).
2. Run the Spring Boot server from the root folder:
   ```bash
   mvn spring-boot:run
   ```
3. Switch your `frontend/.env` to point to localhost:
   ```env
   # VITE_API_BASE_URL=https://libranova.onrender.com
   VITE_API_BASE_URL=http://localhost:8081
   ```
4. Now run `npm run dev` in the frontend folder. Your frontend is now talking to your local Java code.

---

## 🚀 Deployment Guide (Production)
To host this project for free for your resume, we use the **Aiven -> Render -> Vercel** stack.

### 1. Database (Aiven)
1. Create a free MySQL database on [Aiven.io](https://aiven.io/).
2. Copy the **Service URI**. 
3. *Note: Aiven uses ~300MB immediately for MySQL system files. This is normal.*

### 2. Backend (Render)
1. Push your code to GitHub.
2. Create a Web Service on [Render.com](https://render.com/).
3. Connect your repository.
4. **Build Command:** `mvn clean package -DskipTests`
5. **Start Command:** `java -jar target/ebook-backend-1.0.0-SNAPSHOT.jar`
6. Add your Environment Variables:
   - `DB_URL`: `jdbc:mysql://your-aiven-host:port/defaultdb?useSSL=true`
   - `DB_USERNAME`: (From Aiven)
   - `DB_PASSWORD`: (From Aiven)
   - `PORT`: `8080`

### 3. Frontend (Vercel)
1. Import your GitHub repo in [Vercel.com](https://vercel.com/).
2. **Crucial:** Set the **Root Directory** to `frontend`. Framework should automatically be set to `Vite`.
3. Do NOT change Build & Output settings. Vercel knows how to build Vite.
4. Add all variables from your `frontend/.env`:
   - `VITE_API_BASE_URL` (Your Render URL)
   - `VITE_FIREBASE_*` (Your Firebase keys)
5. Click **Deploy**.

### 4. GitHub & Google Auth (Firebase)
Because Firebase handles authentication, you must whitelist your Vercel domain.
1. Open the **Firebase Console** -> Authentication -> Settings.
2. Under **Authorized domains**, add your Vercel URL (e.g., `libranova.vercel.app`).
3. For GitHub Auth, go to GitHub Developer Settings -> OAuth Apps.
4. Update **Homepage URL** to your Vercel URL. Keep the **Authorization callback URL** as your Firebase handler URL.

Your project is now 100% live!
