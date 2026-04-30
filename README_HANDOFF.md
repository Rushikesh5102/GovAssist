# GovAssist - Final Year Project Evaluation Guide

Welcome! This document outlines everything you need to successfully run, present, and evaluate the **GovAssist AI Platform**. 

This project is a complete, production-ready full-stack application built with modern architecture. It bridges the gap between citizens and government welfare schemes using AI (RAG), dynamic data scraping, and strict role-based access control (RBAC).

---

## 🚀 How to Run the Project Locally

The project has been packaged into a single, automated batch script that handles all environment variables, Python virtual environments, Node.js packages, and port allocations.

1. Double-click the **`install_and_run.bat`** file located in the root directory.
2. The script will automatically open two terminals (Frontend & Backend).
3. Once the servers have started, your browser will automatically open to:
   **👉 `http://localhost:5102`**

*(Note: The backend runs silently on `http://localhost:8001`)*

---

## 🔑 Administrative Credentials

To demonstrate the **Role-Based Access Control (RBAC)** and the DevOps Command Center, use the following pre-configured credentials:

### 1. Highest Authority (Owner / Developer)
*   **Email:** `Gundawarshashank12@gmail.com`
*   **Password:** `Gundawar24@`
*   **Role:** `Owner`
*   **Access:** Full access to the "DevOps Command Center", System Metrics, and Feature Flag toggles.

### 2. Administrator
*   **Email:** `kulkarniatharva753@gmail.com`
*   **Password:** *(Use the standard test password if set, or register a new admin)*
*   **Role:** `Admin`
*   **Access:** Access to user management and system monitoring, but restricted from DevOps feature flags.

---

## ⭐ Key "Wow Factor" Features to Show Evaluators

Make sure to highlight these specific features during your demonstration, as they represent advanced, industry-standard engineering:

### 1. The Real-Time DevOps Command Center (Owner Dashboard)
Log in with the Owner credentials and navigate to the **Dashboard**. 
*   Show them the **Live Analytics** (Active Users, Total Schemes, Database Connections) which are fetched in real-time from the backend.
*   Click the **Feature Flags** tab. Explain that the platform uses an enterprise-grade feature toggling system where you can turn live integrations (like the Web Scraper or LLM Engine) on and off without restarting the server!

### 2. Export Eligibility Report to PDF
Navigate to the **Check Eligibility** tab (`/eligibility`).
*   Fill out the form (e.g., Student, General, Male, etc.).
*   Once the system calculates the eligible schemes, click the new **"Export PDF"** button.
*   Explain that this uses a pure CSS print-media injection (`@media print`) to strip away the UI and generate a clean, professional government report dynamically without heavy external libraries.

### 3. Automated Test Suite (Code Quality)
Open the codebase in VS Code and navigate to `backend/tests/test_main.py`.
*   Explain that the platform was built using Test-Driven Development (TDD) principles.
*   You can run the tests by opening a terminal in the `backend` folder and typing `pytest`. (This proves the API routes are robust and protected against crashes).

### 4. Advanced Security & Rate Limiting
*   Show them that the API endpoints are protected using **SlowAPI** (60 requests per minute) to prevent DDoS attacks.
*   Explain that passwords are never stored in plaintext (using `bcrypt` hashing).

---

## 🛠️ Tech Stack Overview
*   **Frontend:** React 18, Vite, TailwindCSS, Framer Motion
*   **Backend:** Python 3.10+, FastAPI, SQLAlchemy, APScheduler
*   **Database:** SQLite (Local fallback for evaluation) / PostgreSQL (Production)
*   **AI / ML:** Google Gemini (LLM), FAISS (Vector DB for Document Retrieval)

**Good luck with the evaluation! You have an A+ project right here.**
