from flask import Blueprint, jsonify, request
from db import execute_query

subjects_bp = Blueprint("subjects", __name__)


@subjects_bp.route("/subjects", methods=["GET"])
def get_subjects():
    subjects = execute_query("SELECT * FROM subjects ORDER BY id ASC")
    return jsonify({"success": True, "data": subjects})


@subjects_bp.route("/syllabus-units/<int:subject_id>", methods=["GET"])
def get_syllabus_units(subject_id):
    units = execute_query("""
        SELECT id, subject_id, unit_name, topic_name, weightage
        FROM syllabus_units
        WHERE subject_id = %s
        ORDER BY id ASC
    """, (subject_id,))
    return jsonify({"success": True, "data": units})


@subjects_bp.route("/add-question", methods=["POST"])
def add_question():
    data = request.get_json()

    required_fields = [
        "subject_id", "unit_id", "question_text",
        "question_type", "difficulty_level",
        "blooms_level", "marks"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return jsonify({"success": False, "message": f"{field} is required"}), 400

    execute_query("""
        INSERT INTO question_bank
        (
            subject_id, unit_id, question_text, question_type,
            difficulty_level, blooms_level, marks,
            answer_text, evaluation_scheme, keywords
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data["subject_id"],
        data["unit_id"],
        data["question_text"],
        data["question_type"],
        data["difficulty_level"],
        data["blooms_level"],
        data["marks"],
        data.get("answer_text", ""),
        data.get("evaluation_scheme", ""),
        data.get("keywords", "")
    ), fetch=False)

    return jsonify({"success": True, "message": "Question added successfully"})