from flask import Blueprint, jsonify, request, send_file
from generators.answer_generator import generate_answers_for_paper
from utils.pdf_builder import build_answer_key_pdf

answers_bp = Blueprint("answers", __name__)


@answers_bp.route("/generate-answers", methods=["POST"])
def generate_answers():
    data = request.get_json()

    subject = data.get("subject")
    paper = data.get("paper")

    if not subject:
        return jsonify({"success": False, "message": "Subject required"}), 400
    if not paper:
        return jsonify({"success": False, "message": "Paper required"}), 400

    try:
        answers = generate_answers_for_paper(subject, paper)
        return jsonify({"success": True, "answers": answers})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@answers_bp.route("/download-answer-key", methods=["POST"])
def download_answer_key():
    data = request.get_json()

    subject = data.get("subject")
    paper = data.get("paper")

    if not subject:
        return jsonify({"success": False, "message": "Subject required"}), 400
    if not paper:
        return jsonify({"success": False, "message": "Paper required"}), 400

    try:
        answers = generate_answers_for_paper(subject, paper)
        pdf_buffer = build_answer_key_pdf(subject, answers)

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name="answer_key.pdf",
            mimetype="application/pdf"
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500