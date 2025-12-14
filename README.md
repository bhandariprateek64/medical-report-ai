# 🏥 AI‑Powered Medical Report Simplifier

## ✨ What is this?
This project is a **backend service** that helps people understand medical reports easily.

You upload a **medical report** (image or text), and the system:
- Extracts the data using **OCR**
- Cleans noisy or broken text
- Uses **Generative AI** to understand test results
- Returns a **clean, structured JSON** with
  - Normalized test values
  - High / Low status
  - Simple, patient‑friendly explanations

The main focus is **accuracy**, **no hallucinations**, and **easy‑to‑understand medical insights**.

---

## 🎯 Problem Statement
**Goal:**
Build a backend service that accepts medical reports (images or text), extracts medical data, validates it strictly, and explains results in simple language for patients.

---

## 🚀 Live Demo
**Base URL:**
```
https://medical-report-ai-v8ph.onrender.com
```

⚠️ **Note:** This is deployed on Render’s free tier. The first request may take **30–50 seconds** to wake up the server.

---

## 🧠 How It Works (Simple Flow)

1. **Input**
   - Image upload (`multipart/form-data`) **OR**
   - Raw medical text (`JSON`)

2. **OCR (Tesseract.js)**
   - Extracts text from images
   - Fixes common OCR mistakes like:
     - `11 200` → `11200`
     - `g / dL` → `g/dL`

3. **AI Processing (Gemini 1.5 Flash)**
   - Identifies test names, values, and units
   - Determines whether results are **Normal / High / Low**
   - Adds missing reference ranges (when safe)
   - Generates **easy explanations** for abnormal values

4. **Safety Guardrails**
   - Removes non‑medical data (IDs, barcodes, headers)
   - Prevents hallucinated tests
   - Validates extracted data against the original report text

5. **Final Output**
   - Returns a **strictly structured JSON response**

---

## 🛠️ Tech Stack
- **Backend:** Node.js + Express
- **OCR:** Tesseract.js
- **AI Model:** Google Gemini 1.5 Flash
- **Validation:** Custom regex rules + hallucination checks
- **Deployment:** Render / ngrok

---

## ⚙️ Setup Instructions

### ✅ Prerequisites
- Node.js (v14 or higher)
- Google Gemini API Key

---

### 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/bhandariprateek64/medical-report-ai.git
cd medical-report-ai
npm install

```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file in the root folder:
```ini
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key
```

4. **Run the server**
```bash
node server.js
```

Server will start at:
```
http://localhost:3000
```

---

## 🔌 API Usage

### Endpoint: Simplify Medical Report
**POST** `/api/simplify-report`

---

### 🖼️ Option 1: Upload Image (cURL)
```bash
curl -X POST https://medical-report-ai-v8ph.onrender.com/api/simplify-report \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/report.jpg"
```

---

### 📝 Option 2: Send Raw Text (JSON)
```json
{
  "text": "Hemoglobin 11.2 g/dL, WBC 11200 cells/mm3"
}
```

---

## 📤 Sample Response (JSON)
```json
{
  "patientSummary": "Some blood values are outside the normal range.",
  "tests": [
    {
      "name": "Hemoglobin",
      "value": "11.2",
      "unit": "g/dL",
      "status": "Low",
      "referenceRange": "13.5–17.5",
      "explanation": "Low hemoglobin may indicate anemia, which can cause fatigue and weakness."
    }
  ]
}
```

---

## 🛡️ Key Design Principles
- ❌ No hallucinated medical tests
- ✅ Only extract data present in the report
- 🧹 OCR noise handling
- 👩‍⚕️ Patient‑friendly explanations
- 📦 Clean, consistent JSON output

---

## 📌 Use Cases
- Patient medical report explanation
- Health apps & dashboards
- Telemedicine platforms
- Medical data preprocessing pipelines

---

## ⚠️ Disclaimer
This project is **not a medical diagnosis tool**.
It is intended for **educational and informational purposes only**.
Always consult a qualified medical professional for health decisions.

---

## 🙌 Final Note
This project focuses on **real‑world robustness**, not just AI output.
The goal is to bridge the gap between **complex medical reports** and **human understanding**.

If you like it, feel free to ⭐ the repo!

