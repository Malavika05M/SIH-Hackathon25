from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import docx2txt
import PyPDF2
import google.generativeai as genai
import re
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = '12345'
CORS(app, supports_credentials=True)

# === Configure Gemini API key ===
API_KEY = "AIzaSyByaN_8WxREKKumn_vnh2PEfO6tn97q0MM"
if not API_KEY:
    raise RuntimeError("Please set the GEMINI_API_KEY environment variable.")
genai.configure(api_key=API_KEY)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def clean_model_output(raw_text: str) -> str:
    """Remove common wrappers like ```json fences."""
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
    return cleaned

def append_submission_record(record: dict):
    path = os.path.join(UPLOAD_FOLDER, "submissions.jsonl")
    try:
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except Exception:
        pass  # don’t block request if logging fails

@app.route("/test")
def test():
    return jsonify({"status": "ok"})

@app.route('/analyse', methods=['POST'])
def analyse():
    """
    Analyse candidate answers against assessment.
    Returns scores, skill graph, feedback, internships, companies.
    Always returns JSON (200), even on parsing errors.
    """
    try:
        payload = request.get_json(force=True)
        assessment = payload.get("assessment")
        answers = payload.get("answers")
        meta = payload.get("meta", {})

        if not assessment or not answers:
            return jsonify({"error": "Missing assessment or answers"}), 400

        attributes = [
            "communication", "technical_ability",
            "reasoning", "creativity", "decision_making"
        ]

        prompt = f"""
You are a neutral evaluator. You are given the following assessment specification and a candidate's answers.

Assessment (JSON):
{json.dumps(assessment, indent=2)}

Candidate Answers (JSON):
{json.dumps(answers, indent=2)}

Meta:
{json.dumps(meta, indent=2)}

Task:
1) Score attributes {attributes} (0–10 each).
2) Provide skill_graph (6–10 skills, 0–100).
3) Suggest 3–5 internships.
4) Suggest 3–7 companies.
5) Write a short feedback paragraph.

Return ONLY valid JSON, nothing else.
"""

        model = genai.GenerativeModel("gemini-2.5-flash")
        resp = model.generate_content(prompt)
        raw_text = resp.text.strip()
        cleaned = clean_model_output(raw_text)

        # Try parsing JSON
        result = None
        try:
            result = json.loads(cleaned)
        except Exception as parse_err:
            # Fallback: attempt common fixes
            fixed = re.sub(r",\s*}", "}", cleaned)
            fixed = re.sub(r",\s*]", "]", fixed)
            try:
                result = json.loads(fixed)
            except Exception:
                # Return structured error instead of 500
                return jsonify({
                    "error": "Failed to parse AI JSON",
                    "parse_error": str(parse_err),
                    "raw": raw_text,
                    "cleaned": cleaned
                }), 200  # ✅ return 200 for frontend handling

        record = {
            "timestamp": datetime.utcnow().isoformat(),
            "meta": meta,
            "assessment": assessment,
            "answers": answers,
            "ai_result": result
        }
        append_submission_record(record)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Accept .docx/.pdf → extract text → generate assessment JSON using Gemini.
    """
    if "document" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["document"]
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    text = ""
    if filename.lower().endswith(".docx"):
        text = docx2txt.process(filepath)
    elif filename.lower().endswith(".pdf"):
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            pages = [page.extract_text() for page in reader.pages if page.extract_text()]
            text = " ".join(pages)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    # Prompt to generate assessment JSON
    prompt = f"""
You are given the following document text from an internship candidate:

\"\"\"
{text}
\"\"\"

Please analyse this document and produce a JSON structure for an internship candidate assessment. 

Use this JSON structure:
{{
  "rounds": [
    {{
      "name": "Round Name",
      "description": "Short purpose",
      "time_limit": "minutes",
      "questions": [
        {{
          "type": "multiple_choice | open_text | coding | scenario",
          "question": "Question text",
          "options": ["A", "B", "C"],
          "answer_type": "single | multiple | text"
        }}
      ]
    }}
  ]
}}

Guidelines:
- Round 1: Quick Profile (1 min)
- Round 2: Aptitude & Reasoning (2 min)
- Round 3: Technical (3 min)
- Round 4: Scenario Judgment (2 min)
- Round 5: Creativity & Reflection (2 min)
Each round: 3–5 questions.

Return ONLY valid JSON.
"""

    model = genai.GenerativeModel("gemini-2.5-flash")
    resp = model.generate_content(prompt)
    raw_text = resp.text.strip()
    cleaned = clean_model_output(raw_text)

    try:
        assessment_dict = json.loads(cleaned)
    except Exception as e:
        return jsonify({
            "error": "Failed to parse JSON",
            "raw": raw_text,
            "cleaned": cleaned
        }), 200  # return 200 for frontend

    return jsonify({"assessment": assessment_dict}), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
