from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import docx2txt
import PyPDF2
import google.generativeai as genai
import re
import json

app = Flask(__name__)
app.secret_key = '12345'
CORS(app, supports_credentials=True)

# configure your Gemini / GenAI API key (e.g. set environment variable GEMINI_API_KEY)
genai.configure(api_key="AIzaSyByaN_8WxREKKumn_vnh2PEfO6tn97q0MM")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
text = ""

@app.route("/test")
def test():
    return jsonify({"Res":text})

@app.route('/analyse', methods=['POST'])
def analyse():
    try:
        data = request.get_json()
        assessment = data.get("assessment")
        answers = data.get("answers")

        if not assessment or not answers:
            return jsonify({"error": "Missing assessment or answers"}), 400

        # Define the attributes to score
        attributes = [
            "communication",
            "technical_ability",
            "reasoning",
            "creativity",
            "decision_making"
        ]

        # Build the prompt for Gemini
        prompt = f"""
You are an evaluator. You are given:

Assessment:
{json.dumps(assessment, indent=2)}

Candidate's Answers:
{json.dumps(answers, indent=2)}

Evaluate the candidate and assign a score (0-10) for each of these attributes:
{attributes}

Also, recommend 3-5 suitable internship roles based on their performance and profile. For each internship, provide:
- Role title
- Organization/Department
- Brief description (1-2 sentences)
- Match score (percentage)

Guidelines:
- Be fair and objective.
- Consider multiple choice correctness, open_text expression, coding quality, and scenario decisions.
- If an answer is missing, give 0 for that part.
- Return valid JSON only, structured like this:

{{
  "scores": {{
    "communication": 0-10,
    "technical_ability": 0-10,
    "reasoning": 0-10,
    "creativity": 0-10,
    "decision_making": 0-10
  }},
  "feedback": "One short paragraph of constructive feedback",
  "internships": [
    {{
      "role": "Role title",
      "organization": "Organization/Department",
      "description": "Brief description",
      "match_score": 85
    }},
    // more internships...
  ]
}}
"""

        # Send to Gemini
        model = genai.GenerativeModel("gemini-2.5-flash")
        resp = model.generate_content(prompt)

        raw_text = resp.text.strip()
        cleaned = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()

        result = json.loads(cleaned)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
Ensure each round has 3-5 questions. Keep wording simple, clear, and concise.

Return only valid JSON (no extra commentary).
"""

    # send to Gemini
    model = genai.GenerativeModel("gemini-2.5-flash")
    resp = model.generate_content(prompt)
    # resp.text should be the JSON
    
    raw_text = resp.text.strip()

    # 🧹 Remove ```json ... ``` wrappers if present
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()

    try:
        assessment_dict = json.loads(cleaned)
    except Exception as e:
        return jsonify({"error": "Failed to parse JSON", "raw": raw_text}), 500

    return jsonify({"assessment": assessment_dict})

if __name__ == '__main__':
    app.run(debug=True)