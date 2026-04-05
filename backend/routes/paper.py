from flask import Blueprint, jsonify, request, send_file
from generators.question_generator import (
    test_groq_connection,
    generate_questions,
    generate_full_question_paper,
    generate_mcq_questions,
    generate_section_questions
)
from generators.paper_builder import generate_ai_question_paper
from utils.pdf_builder import build_question_paper_pdf

paper_bp = Blueprint("paper", __name__)


@paper_bp.route("/test-groq", methods=["GET"])
def test_groq():
    try:
        result = test_groq_connection()
        return jsonify({"success": True, "message": result})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@paper_bp.route("/generate-questions", methods=["POST"])
def generate_questions_api():
    data = request.get_json()

    topic = data.get("topic")
    difficulty = data.get("difficulty")
    blooms = data.get("blooms_level")
    qtype = data.get("question_type")
    num = data.get("num_questions")

    if not topic:
        return jsonify({"success": False, "message": "Topic is required"}), 400

    result = generate_questions(topic, difficulty, blooms, qtype, num)
    return jsonify({"success": True, "questions": result})


@paper_bp.route("/generate-paper", methods=["POST"])
def generate_paper_api():
    data = request.get_json()

    subject = data.get("subject")
    units = data.get("units")
    total_marks = data.get("total_marks")
    difficulty = data.get("difficulty")

    if not subject:
        return jsonify({"success": False, "message": "Subject is required"}), 400
    if not units or not isinstance(units, list):
        return jsonify({"success": False, "message": "Units must be a list"}), 400
    if not total_marks:
        return jsonify({"success": False, "message": "Total marks is required"}), 400
    if not difficulty:
        return jsonify({"success": False, "message": "Difficulty is required"}), 400

    try:
        paper = generate_full_question_paper(subject, units, total_marks, difficulty)
        return jsonify({"success": True, "paper": paper})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@paper_bp.route("/generate-ai-paper", methods=["POST"])
def generate_ai_paper():
    data = request.get_json()

    subject = data.get("subject")
    topics = data.get("topics")
    sections = data.get("sections")
    paper_type = data.get("paper_type", "MCQ+Subjective")

    if not subject:
        return jsonify({"success": False, "message": "Subject required"}), 400
    if not topics or not isinstance(topics, list):
        return jsonify({"success": False, "message": "Topics must be a list"}), 400
    if not sections or not isinstance(sections, list):
        return jsonify({"success": False, "message": "Sections must be a list"}), 400

    try:
        paper = generate_ai_question_paper(
            subject=subject,
            topics=topics,
            sections=sections,
            paper_type=paper_type
        )
        return jsonify({"success": True, "paper": paper})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@paper_bp.route("/download-question-paper", methods=["POST"])
def download_question_paper():
    data = request.get_json()

    subject = data.get("subject")
    total_marks = data.get("total_marks", 70)
    teacher = data.get("teacher", "N/A")
    date = data.get("date", "")
    paper_data = data.get("paper_data", {})
    sections = data.get("sections", [])

    if not subject:
        return jsonify({"success": False, "message": "Subject required"}), 400

    try:
        pdf_buffer = build_question_paper_pdf(
            subject=subject,
            total_marks=total_marks,
            teacher=teacher,
            date=date,
            section_a_mcqs=[],
            section_b_questions=[],
            section_c_questions=[],
            department=data.get("department", "Department of Computer Engineering"),
            academic_year=data.get("academic_year", ""),
            class_name=data.get("class_name", ""),
            div=data.get("div", ""),
            sem=data.get("sem", ""),
            exam_type=data.get("exam_type", ""),
            duration=data.get("duration", ""),
            notes=data.get("notes", ""),
            sections=sections,
            paper_data=paper_data
        )

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name="question_paper.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500