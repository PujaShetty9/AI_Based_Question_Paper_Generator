from flask import Blueprint, jsonify, request
from groq import Groq
from config import GROQ_API_KEY
import json
import re

edit_bp = Blueprint("edit", __name__)
client = Groq(api_key=GROQ_API_KEY)


def clean_json_response(text):
    text = text.strip()
    text = re.sub(r"^```json", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()


@edit_bp.route("/edit-paper", methods=["POST"])
def edit_paper():
    data = request.get_json()

    instruction = data.get("instruction")
    paper = data.get("paper")
    subject = data.get("subject")
    sections = data.get("sections", [])

    if not instruction:
        return jsonify({"success": False, "message": "Instruction required"}), 400
    if not paper:
        return jsonify({"success": False, "message": "Paper required"}), 400

    # Build a readable version of the paper for Groq
    paper_text = ""
    for section_name, questions in paper.items():
        paper_text += f"\n{section_name}:\n"
        for idx, q in enumerate(questions):
            label = chr(97 + idx)
            if isinstance(q, dict) and "options" in q:
                paper_text += f"  ({label}) [MCQ] {q.get('question', '')}\n"
                opts = q.get("options", {})
                paper_text += f"      A. {opts.get('A','')} B. {opts.get('B','')} C. {opts.get('C','')} D. {opts.get('D','')}\n"
                paper_text += f"      Correct: {q.get('correct_answer','')}\n"
            elif isinstance(q, dict):
                paper_text += f"  ({label}) {q.get('question', '')}\n"
            else:
                paper_text += f"  ({label}) {q}\n"

    prompt = f"""
You are an expert university exam paper editor.

Subject: {subject}

Current Question Paper:
{paper_text}

Teacher's Instruction: {instruction}

Apply the instruction to the paper and return the COMPLETE updated paper as JSON.

Rules:
- Keep all sections and questions exactly as they are EXCEPT the ones mentioned in the instruction
- For MCQ questions, return this format:
  {{"question": "...", "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}}, "correct_answer": "A"}}
- For subjective questions, return this format:
  {{"question": "..."}}
- Return ONLY valid JSON in this exact structure with no markdown:
{{
  "Section A": [
    {{"question": "...", "options": {{"A":"...","B":"...","C":"...","D":"..."}}, "correct_answer":"A"}},
    ...
  ],
  "Section B": [
    {{"question": "..."}},
    ...
  ]
}}

Important:
- Preserve the original section names exactly
- Preserve all images field if present
- Only modify what the teacher asked
- If asked to make harder/easier, rewrite just that question accordingly
- If asked to replace, write a completely new question on the same topic
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )

        text = response.choices[0].message.content.strip()
        text = clean_json_response(text)
        updated_paper = json.loads(text)

        # Preserve any images from original paper
        for section_name, questions in paper.items():
            if section_name in updated_paper:
                for idx, original_q in enumerate(questions):
                    if idx < len(updated_paper[section_name]):
                        if isinstance(original_q, dict) and original_q.get("image"):
                            updated_paper[section_name][idx]["image"] = original_q["image"]

        return jsonify({"success": True, "paper": updated_paper})

    except json.JSONDecodeError:
        return jsonify({"success": False, "message": "AI returned invalid format. Try again."}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500