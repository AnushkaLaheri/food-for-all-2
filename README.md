# Food For All — Empowering Food Donations for a Hunger-Free Future

**Food For All** is a tech-driven food donation and redistribution platform that connects donors with NGOs and individuals in need. It minimizes food waste and tackles hunger by enabling fast, smart, and verified food donations with built-in gamification, AI-assisted features, and a robust user ecosystem.

---

## 🔗 Live Deployment

- **Frontend:** [https://food-for-all-2.vercel.app](https://food-for-all-2.vercel.app)
- **Backend API:** `https://food-for-all-2.onrender.com`

---

## 💻 Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, ShadCN UI, Lucide Icons  
- **Backend:** Node.js, Express.js, Multer  
- **Database:** MongoDB Atlas  
- **Authentication:** JSON Web Tokens (JWT)  
- **Image Uploads:** Multer with disk storage  
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## ✨ Features

### 🧾 Multi-Step Food Donation Form
- Controlled form with real-time validation
- Image upload, expiry date, quantity, dietary info
- Smart category selection and contact preferences

### 👤 User Profile
- Role-based: Donor, Consumer, NGO
- Editable profile with bio, image upload, and location
- JWT-protected access

### 🏆 Achievements & Milestones
- First Donation — Unlocked  
- Regular Donor — Donated 5 times  
- Neighborhood Hero — Helped 10 people  
- Variety Master — Donated 5+ food types  
- Silver Status — 72% progress  
- Community Champion — 64% progress

### 📜 Donation History
- Track all past donations
- Includes date, quantity, status, and category

### 📊 Impact Tracker
- View total donations made
- Number of people helped
- Rank on leaderboard

### 🏅 Leaderboard
- Displays top contributors
- Profile-linked rankings with badge indicators

---

## 🚀 Installation


### Clone the repository
git clone https://github.com/AnushkaLaheri/food-for-all-2.git

cd food-for-all-2

### Frontend setup
cd frontend

npm install

npm run dev

### Backend setup
cd ../backend

npm install

npm run dev

---

## ⚙️ Environment Variables
Create a .env file in both frontend/ and backend/ folders.

### Frontend .env
NEXT_PUBLIC_API_URL=https://food-for-all-2.onrender.com/api

### Backend .env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your_jwt_secret


## 🔒 Security Highlights
- CORS with origin whitelisting

- Multer validation for safe image uploads

- JWT-based authentication and protected routes

- Role-based access control

## 🤝 Contributions
This project is developed and maintained by:

### Anushka Laheri

📧 Email: anushkalaheri@gmail.com

🔗 LinkedIn: [Anushka Laheri](https://www.linkedin.com/in/anushka-laheri)

🐙 GitHub: [@AnushkaLaheri](https://github.com/AnushkaLaheri)

### Garima Raj

📧 Email: garimaraj536@gmail.com

🔗 LinkedIn: [Garima Raj](https://www.linkedin.com/in/garima-raj-59a654319)

🐙 GitHub: [@Garimaraj15](https://github.com/Garimaraj15)



## 🙏 Acknowledgements
Thanks to everyone supporting open innovation for social good. This project was developed with the goal of addressing real-world challenges like hunger and food waste using modern full-stack web technologies.
