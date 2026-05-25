# 🎤 AI Interview Preparation Assistant

🔗 **Live Demo:** [https://ai-interview-preparation-hi3z.onrender.com](https://ai-interview-preparation-hi3z.onrender.com)

A premium, interactive web application designed to help job seekers prepare for interviews through voice-activated mock interviews, tailored AI-generated questions, and comprehensive performance feedback.

The application leverages the power of **Gemini 2.5 Flash** to extract resume details, generate hyper-relevant interview questions, evaluate answers in real-time, and create exhaustive feedback reports.

---

## 🚀 Key Features

* **AI Resume Parsing**: Instantly extracts your skills, projects, and experiences from a PDF resume.
* **Dynamic Question Generation**: Generates tailor-made technical and behavioral questions based on your background.
* **Voice-Activated Mock Interviews**: Practice speaking your answers using high-fidelity browser Speech-to-Text and Text-to-Speech synthesis.
* **Real-time Feedback**: Get direct scoring and suggestions for improvements as you answer each question.
* **Comprehensive Performance Reports**: Detailed breakdowns of your technical depth, communication skills, confidence, and recommended study topics.
* **Interview History**: Keep track of your past interview logs and monitor your progress over time (persisted locally using SQLite).

---

## 🛠️ Tech Stack

### Frontend (`/client`)
* **React 19** & **Vite** — Fast, modern component-based single-page application.
* **Web Speech API** — Integrated Speech Recognition and Synthesis for conversational interaction.
* **Vanilla CSS** — Custom-crafted modern UI with beautiful glassmorphism gradients and animations.

### Backend (`/server`)
* **Node.js** & **Express** — High-performance API server.
* **@google/genai (v2.4.0)** — Modern Google Gen AI SDK utilizing the **Gemini 2.5 Flash** model.
* **Better-SQLite3** — Embedded high-performance local database for recording interview metrics.

---

## 💻 Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* A Google Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Repository Configuration
Clone the repository and copy the environment variables template:
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 2. Install & Start Backend
```bash
cd server
npm install
npm run dev
```
The server will start running on [http://localhost:3001](http://localhost:3001).

### 3. Install & Start Frontend
```bash
cd ../client
npm install
npm run dev
```
The application will launch on [http://localhost:5173](http://localhost:5173).

---

## ☁️ Production Deployment (Render)

This project is configured for seamless deployment on **Render**.

### 1. Backend Web Service
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the following fields:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. In **Advanced -> Environment Variables**, add:
   * `GEMINI_API_KEY` = `your_gemini_api_key`
   * `NODE_ENV` = `production`

### 2. Frontend Static Site
1. Create a new **Static Site** on Render.
2. Connect your GitHub repository.
3. Configure the following fields:
   * **Root Directory**: `client`
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`
4. Add the following **Environment Variable**:
   * `VITE_API_BASE_URL` = `https://<your-backend-service-name>.onrender.com/api`

---

## 📄 License
This project is licensed under the MIT License.
