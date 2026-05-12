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






## demo <img width="1502" height="942" alt="image" src="https://github.com/user-attachments/assets/9ef01d7f-8416-4834-b7d8-57af9224e194" />

<img width="1472" height="880" alt="image" src="https://github.com/user-attachments/assets/6b2b1be8-ebce-4fd7-93e6-772d84e50dcc" />


<img width="653" height="760" alt="image" src="https://github.com/user-attachments/assets/bd97f6d3-f415-4bc0-b58b-408b2f428e54" />



##Setup Instructions
Install and run Ollama locally.

Pull the required model:

bash
ollama pull gemma4:e2b
Add environment variables in .env:

env
VITE_OLLAMA_API_URL=http://localhost:11434
VITE_OLLAMA_MODEL=gemma4:e2b
Install dependencies:

bash
npm install
Run development server:

bash
npm run dev
