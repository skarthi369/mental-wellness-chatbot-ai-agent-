# 🌿 MindfulChat – Emotion‑Aware AI Chatbot for Personalized Mental Health Support

## 📖 Abstract
Mental health support systems often face challenges in accessibility, personalization, and scalability. This project introduces **MindfulChat**, an ethically designed, emotion‑aware AI chatbot that leverages **Transformer‑based Large Language Models (LLMs)** to provide real‑time therapeutic assistance. The system integrates sentiment analysis, dynamic persona adaptation, and proactive risk assessment to deliver personalized wellness guidance. With multilingual support and structured analytics, MindfulChat aims to democratize mental health resources while maintaining ethical safeguards.

---

## 🚀 Introduction
Mental health concerns are rising globally, yet access to professional support remains limited. AI‑driven conversational agents can bridge this gap by offering immediate, empathetic, and context‑aware assistance. Unlike generic chatbots, MindfulChat is designed with **therapeutic intent**, combining natural language understanding with emotional intelligence.

**Key Objectives**
- Provide **real‑time emotional support** through adaptive dialogue.  
- Detect and categorize emotional states for **risk triaging**.  
- Ensure inclusivity with **multilingual support** (English, Tamil, Hindi).  
- Generate **structured wellness reports** for reflection and progress tracking.  

---

## 🧠 System Features

### Intelligent Core
- **Transformer LLM Integration** – nuanced therapeutic dialogue.  
- **Emotion Engine** – detects emotional states (e.g., Anxiety, Stress, Hope).  
- **Risk Assessment** – heuristic triaging (Low, Medium, High).  

### Therapeutic Toolkit
- **Guided Somatics** – breathing exercises (e.g., 4‑4‑4‑2 Box Breathing).  
- **Multilingual Inclusivity** – supports English, Tamil (தமிழ்), and Hindi (हिंदी).  
- **Session Analytics** – JSON‑based wellness reports summarizing emotional trends.  

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[User Input] --> B[Chatbot UI]
    B --> C[Service Layer: OllamaService]
    C --> D[Transformer LLM Gemma4:e2b]
    D --> E[Emotion Engine]
    E --> F{Risk Assessment}
    F -->|Low/Medium| G[Persona Adaptation: Doctor/Friend Mode]
    F -->|High| H[Crisis Trigger: Breathing + Safety Response]
    G --> I[Response Generator]
    H --> I[Response Generator]
    I --> J[Chatbot UI Output]
    I --> K[Session Report Generator]
    K --> L[PDF Service: jsPDF]
    L --> M[Downloadable Wellness Report]

<img width="653" height="760" alt="image" src="https://github.com/user-attachments/assets/a41086f4-b819-4cac-aaaa-f187e98a3375" />
<img width="1502" height="942" alt="image" src="https://github.com/user-attachments/assets/b9ff1a5d-9160-44ab-b260-21a6c345f857" />
<img width="1472" height="880" alt="image" src="https://github.com/user-attachments/assets/2bfe9a04-0950-44c5-a1e4-f4f21c7a2b29" />
