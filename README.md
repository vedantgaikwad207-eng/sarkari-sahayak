# 🏛️ Sarkari Sahayak (सरकारी सहायक) — Scheme Journey Agent

> 🚀 **Live Working Demo**: [https://vedantgaikwad207-eng.github.io/sarkari-sahayak/](https://vedantgaikwad207-eng.github.io/sarkari-sahayak/)  
> **Multimodal Civic Welfare Agent for Bharat powered by Sarvam AI**  
> *Identifies eligible government welfare schemes through official RAG retrieval, parses applicant KYC documents via Sarvam Vision, highlights missing items, and guides citizens step-by-step with spoken field confirmation via Bulbul.*

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-success.svg)](https://vedantgaikwad207-eng.github.io/sarkari-sahayak/)
[![Sarvam AI](https://img.shields.io/badge/Powered%20By-Sarvam%20AI-orange.svg)](https://sarvam.ai)
[![Sarvam-105B](https://img.shields.io/badge/Model-Sarvam--105B%20Conversations-blue.svg)](https://docs.sarvam.ai)
[![Bulbul TTS](https://img.shields.io/badge/TTS-Bulbul%20v3-green.svg)](https://docs.sarvam.ai)
[![Saaras STT](https://img.shields.io/badge/STT-Saaras%20v3-purple.svg)](https://docs.sarvam.ai)
[![Sarvam Vision](https://img.shields.io/badge/OCR-Sarvam%20Vision-red.svg)](https://docs.sarvam.ai)

---

## 🌟 The Problem
Over ₹3.5 Lakh Crore ($42B+) in direct government welfare subsidies remain unclaimed or delayed in India every year due to three critical friction points:
1. **Information Asymmetry**: Millions of small farmers, artisans, and unorganized workers do not know which central schemes they qualify for.
2. **Rejection via Missing Documents**: Over 40% of scheme applications are rejected at the Tehsil/Gram Panchayat level because the applicant missed an ancillary certificate (e.g. Land Khasra, NPCI Aadhaar seeding, BPL Antyodaya proof).
3. **Language & Literacy Barriers**: Complex bureaucratic application portals with English/formal Hindi forms intimidate rural citizens who cannot read dense text.

---

## 💡 The Solution: Sarkari Sahayak
**Sarkari Sahayak** is a complete, voice-first, multimodal scheme journey agent built using the full sovereign AI suite from **Sarvam AI**:

| Sarvam Product | Role in Sarkari Sahayak |
| :--- | :--- |
| **🧠 Sarvam-105B** | **Official Scheme RAG Reasoning**: Context-aware conversational agent that understands citizen circumstances (land size, trade, income, age) and reasons over official central scheme rules. |
| **👁️ Sarvam Vision** | **KYC Document Extraction & Gap Analysis**: Parses citizen identity documents (Aadhaar, Land Khasra, Ration Cards, Income Certificates) into structured data and flags missing items with actionable instructions on where to get them. |
| **🔊 Bulbul v3** | **Spoken Field Confirmation & Voice Guidance**: Speaks out verified eligibility verdicts and provides field-by-field auditory confirmation (*"पुष्टि: आवेदक का नाम रमेश कुमार दर्ज किया गया है"*) in natural Indian voices. |
| **🎙️ Saaras v3** | **Voice-First Input**: Allows citizens to speak in Hindi or Indian English through the microphone to search schemes or dictate queries without typing. |

---

## 🚀 Key Features

### 1. 🔍 Scheme Finder & Official RAG Knowledge Base
- Curated, verified database of major Indian welfare schemes:
  - **PM-Kisan Samman Nidhi** (₹6,000/yr for landholding farmers)
  - **Ayushman Bharat PM-JAY** (₹5,00,000/yr health cover for BPL/SECC families)
  - **PM Vishwakarma Scheme** (₹3,00,000 collateral-free credit @ 5% + ₹15,000 tool kit grant for artisans)
  - **PM Awas Yojana (PMAY)** (Housing construction grant up to ₹2,50,000)
  - **Sukanya Samriddhi Yojana (SSY)** (8.2% tax-free compound savings for girl child)
  - **Atal Pension Yojana (APY)** (₹1,000–₹5,000 guaranteed lifetime monthly pension)
- Real-time voice search powered by **Saaras v3**.
- Instant voice overview powered by **Bulbul v3**.

### 2. 📑 Sarvam Vision KYC Scanner & Missing Item Highlighter
- Ingests official citizen documents via file upload or realistic 1-click test personas:
  - *Ramesh Kumar* (Farmer with 1.8 Acres cultivable land)
  - *Mohammad Rafiq* (Master Woodworker / Carpenter, 14 years experience)
  - *Sunita Devi* (BPL Antyodaya household with 6-year-old daughter)
- Cross-checks extracted data against target scheme criteria.
- **Missing Document Detection**: Flags missing prerequisites (e.g. *Missing Land Khasra*, *Missing NPCI Seeding*) and tells citizens exactly which office or portal to visit to obtain them.
- Auditory verification readout powered by **Bulbul v3**.

### 3. 📝 Step-by-Step Guided Form Completion
- Pre-populates verified attributes from Sarvam Vision directly into scheme application forms.
- Interactive 🔊 **Speak** button on every input field for auditory reassurance before submitting.
- Generates an official DBT Acknowledgement Slip with a unique reference number (`SS-2026-XXXX`).

### 4. 💬 Conversational Scheme Advisor
- Powered by **`sarvam-105b-conversations`**.
- Multilingual support (हिंदी & English).
- Responds with grounded, legal criteria rather than generic AI advice.

---

## 🛠️ Architecture & Tech Stack

```
[ Citizen (Voice / Text / Document Upload) ]
                      │
     ┌────────────────┴────────────────┐
     ▼                                 ▼
[ Saaras v3 STT ]             [ Sarvam Vision OCR ]
(Voice to Text)                (Aadhaar/Khasra/Ration)
     │                                 │
     └────────────────┬────────────────┘
                      ▼
         [ Express Server (Node.js) ]
                      │
     ┌────────────────┴────────────────┐
     ▼                                 ▼
[ Sarvam-105B Reasoning ]       [ Bulbul v3 TTS ]
 (RAG Scheme Eligibility)       (Spoken Confirmations)
                      │
                      ▼
        [ React 19 + Tailwind CSS UI ]
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js 22, Express, Multer, Native Fetch
- **AI Models & SDK**: `sarvamai` SDK, `sarvam-105b-conversations`, `bulbul:v3`, `saaras:v3`, `sarvam-doc-ai`

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js 18+ or 20+
- Python 3.10+ (for Sarvam AI Python scripts)
- Sarvam AI API Key (from [dashboard.sarvam.ai](https://dashboard.sarvam.ai))

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/sarkari-sahayak.git
   cd sarkari-sahayak
   ```

2. **Install dependencies**:
   ```bash
   npm install
   pip install sarvamai python-dotenv
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Sarvam AI API Key in `.env`:
   ```env
   SARVAM_API_KEY="sk_zmu4v1b5_..."
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run the standalone Sarvam-105B test script**:
   ```bash
   python3 main.py
   ```

---

## 🏆 Hackathon Submission Highlights
- **Impact**: Solves last-mile delivery of Indian Direct Benefit Transfer (DBT) welfare schemes.
- **Multimodal Innovation**: Unifies Voice In (Saaras), Vision (KYC OCR), Reasoning (Sarvam-105B), and Voice Out (Bulbul).
- **Inclusivity**: Designed specifically for rural and unorganized sector citizens with low digital literacy.
- **Security & Privacy**: Zero hardcoded secrets, server-side credential proxies, masked document numbers.

---

## 📜 License
Apache-2.0 License. Built with ❤️ for Bharat.
