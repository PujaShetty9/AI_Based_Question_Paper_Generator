from flask import Blueprint, jsonify, request
from db import get_supabase

subjects_bp = Blueprint("subjects", __name__)


@subjects_bp.route("/subjects", methods=["GET"])
def get_subjects():
    supabase = get_supabase()
    response = supabase.table("subjects").select("*").order("id").execute()
    return jsonify({"success": True, "data": response.data})


@subjects_bp.route("/syllabus-units/<int:subject_id>", methods=["GET"])
def get_syllabus_units(subject_id):
    supabase = get_supabase()
    response = supabase.table("syllabus_units").select("*").eq("subject_id", subject_id).order("id").execute()
    return jsonify({"success": True, "data": response.data})


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

    supabase = get_supabase()
    supabase.table("question_bank").insert({
        "subject_id": data["subject_id"],
        "unit_id": data["unit_id"],
        "question_text": data["question_text"],
        "question_type": data["question_type"],
        "difficulty_level": data["difficulty_level"],
        "blooms_level": data["blooms_level"],
        "marks": data["marks"],
        "answer_text": data.get("answer_text", ""),
        "evaluation_scheme": data.get("evaluation_scheme", ""),
        "keywords": data.get("keywords", "")
    }).execute()

    return jsonify({"success": True, "message": "Question added successfully"})