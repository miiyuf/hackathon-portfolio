# 📦 Backend - Portfolio Management System

This is the backend service for the Portfolio Management application, built with **FastAPI** and running on **Docker**. It provides a RESTful API and connects to a MySQL database.

---

## 🚀 Getting Started

### 1. Requirements

- Docker & Docker Compose
- Python (for local dev, optional)

---

### 2. Directory Structure

backend/
├── app/ # Source code
│ └── main.py # FastAPI entry point
├── requirements.txt # Python dependencies
├── Dockerfile # Docker build config
├── .env # Environment variables
└── README.md # This file

---

### 3. Environment Variables

Create a `.env` file in the `backend/` directory.

```env
ENV=development
DB_URL=mysql://user:password@db:3306/portfolio_db
