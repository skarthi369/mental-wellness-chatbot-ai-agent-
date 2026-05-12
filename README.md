# 🌿 MindfulChat – Emotion‑Aware AI Chatbot

## 📖 Overview
MindfulChat is a dual‑persona, emotion‑aware AI chatbot designed for personalized mental health support. It integrates **Ollama** with transformer‑based LLMs, sentiment analysis, and structured reporting to provide real‑time therapeutic assistance.  

---

## 🚀 Features
- **Dual Personas**
  - **Doctor Mode** – Structured, clinical, evidence‑based guidance.
  - **Friend Mode** – Casual, supportive, conversational tone.
- **Emotion Engine** – Detects emotional states and adapts responses.
- **Safety Trigger** – Crisis detection with guided breathing exercises.
- **Multilingual Support** – English, Tamil (தமிழ்), Hindi (हिंदी).
- **Session Reports** – JSON analytics converted into professional PDF.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A[User Input] --> B[Chatbot UI]
    B --> C[OllamaService]
    C --> D[Transformer LLM Gemma4:e2b]
    D --> E[Emotion Engine]
    E --> F{Risk Assessment}
    F -->|Low/Medium| G[Doctor/Friend Persona]
    F -->|High| H[Crisis Trigger: Breathing + Safety Response]
    G --> I[Response Generator]
    H --> I[Response Generator]
    I --> J[Chatbot UI Output]
    I --> K[Session Report Generator]
    K --> L[PDF Service: jsPDF]
    L --> M[Downloadable Wellness Report]
