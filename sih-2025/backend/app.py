from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import docx2txt
import PyPDF2
import google.generativeai as genai

app = Flask(__name__)
app.secret_key = '12345'
CORS(app, supports_credentials=True)

# configure your Gemini / GenAI API key (e.g. set environment variable GEMINI_API_KEY)
genai.configure(api_key="AIzaSyByaN_8WxREKKumn_vnh2PEfO6tn97q0MM")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST','GET'])
def upload_file():
    if "document" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["document"]
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    text = ""
    if filename.endswith(".docx"):
        text = docx2txt.process(filepath)
    elif filename.endswith(".pdf"):
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            pages = []
            for page in reader.pages:
                ptext = page.extract_text()
                if ptext:
                    pages.append(ptext)
            text = " ".join(pages)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    # Now prompt Gemini to analyse the document and produce assessment JSON
    prompt = f"""
You are given the following document text from an internship candidate:

\"\"\"
{text}
\"\"\"

Please analyse this document and produce a JSON structure for an internship candidate assessment. The JSON should be divided into rounds, each containing questions. The assessment must take about 10 minutes in total and should evaluate multiple dimensions of the candidate without being a strict pass/fail test.  

Use the following JSON structure:

{{
  "rounds": [
    {{
      "name": "Round Name",
      "description": "Short purpose of this round",
      "time_limit": "minutes",
      "questions": [
        {{
          "type": "multiple_choice | open_text | coding | scenario",
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C"],
          "answer_type": "single | multiple | text"
        }}
      ]
    }}
  ]
}}

Follow these content guidelines:
- Round 1: Quick Profile (1 min) — Multiple choice self-reflection questions.
- Round 2: Aptitude & Reasoning (2 min) — Logical / quantitative MCQs.
- Round 3: Technical Round (3 min) — Domain-specific (if candidate is CS, include coding / output prediction; if non-tech, use case-based MCQs).
- Round 4: Scenario-Based Judgment (2 min) — Situational decision-making questions.
- Round 5: Creativity & Reflection (2 min) — Open text prompts (short written responses).
Ensure each round has 3–5 questions. Keep wording simple, clear, and concise.

Return only valid JSON (no extra commentary).
"""

    # send to Gemini
    model = genai.GenerativeModel("gemini-2.5-flash")
    resp = model.generate_content(prompt)
    # resp.text should be the JSON

    # Optionally you could attempt to parse the JSON here to ensure it's valid
    try:
        assessment_json = resp.text
        # If wanted: json.loads(assessment_json) to verify  
    except Exception as e:
        return jsonify({"error": "Failed to parse Gemini response", "response": resp.text}), 500

   
    return jsonify({"assessment": assessment_json})

if __name__ == '__main__':
    app.run(debug=True)
