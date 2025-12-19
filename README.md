# GovAssist - AI-Powered Government Scheme Platform

GovAssist is an AI-powered platform designed to simplify access to Indian government schemes. It helps citizens discover eligible schemes, analyze documents for eligibility, and provides multilingual support for wider accessibility.

## Features

- **Scheme Discovery**: Search and filter government schemes by category, ministry, and eligibility.
- **AI Eligibility Check**: Upload documents to automatically check eligibility for various schemes.
- **Multilingual Support**: Available in English, Hindi, and Marathi.
- **AI Chat Assistant**: Ask questions about schemes and get instant answers.
- **Admin Dashboard**: Manage users, schemes, and monitor platform usage.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: SQLite (SQLAlchemy)
- **AI/ML**: Google Gemini (via `google-generativeai`), LangChain

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rushikesh5102/GovAssist.git
    cd GovAssist
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup:**
    ```bash
    cd backend
    pip install -r requirements.txt
    python -m uvicorn app.main:app --reload
    ```

## License

This project is licensed under the MIT License.
