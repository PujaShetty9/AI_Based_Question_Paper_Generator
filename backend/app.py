from generators.question_generator import (
    test_gemini_connection,
    generate_questions,
    generate_full_question_paper,
    generate_mcq_questions,
    generate_section_questions
)
from generators.paper_builder import generate_ai_question_paper
from generators.answer_generator import generate_answers_for_paper
from flask import Flask, jsonify, request, send_file
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)


def build_question_paper_pdf(subject, total_marks, section_a_mcqs, section_b_questions, section_c_questions):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="TitleStyle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=16,
        leading=20,
        spaceAfter=10
    )

    heading_style = ParagraphStyle(
        name="HeadingStyle",
        parent=styles["Heading2"],
        spaceBefore=10,
        spaceAfter=8
    )

    normal_style = styles["BodyText"]
    normal_style.leading = 16

    story = []

    story.append(Paragraph(subject, title_style))
    story.append(Paragraph("AI Generated Question Paper", title_style))
    story.append(Paragraph(f"Total Marks: {total_marks}", title_style))
    story.append(Spacer(1, 16))

    story.append(Paragraph("Section A (2 Marks Each)", heading_style))
    for i, q in enumerate(section_a_mcqs, start=1):
        question_text = q.get("question", "") if isinstance(q, dict) else str(q)
        options = q.get("options", {}) if isinstance(q, dict) else {}

        if not isinstance(options, dict):
            options = {}

        story.append(Paragraph(f"{i}. {question_text}", normal_style))
        story.append(Paragraph(f"A. {options.get('A', '')}", normal_style))
        story.append(Paragraph(f"B. {options.get('B', '')}", normal_style))
        story.append(Paragraph(f"C. {options.get('C', '')}", normal_style))
        story.append(Paragraph(f"D. {options.get('D', '')}", normal_style))
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Section B (5 Marks Each)", heading_style))
    for i, q in enumerate(section_b_questions, start=1):
        story.append(Paragraph(f"{i}. {str(q)}", normal_style))
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Section C (10 Marks Each)", heading_style))
    for i, q in enumerate(section_c_questions, start=1):
        story.append(Paragraph(f"{i}. {str(q)}", normal_style))
        story.append(Spacer(1, 8))

    doc.build(story)
    buffer.seek(0)
    return buffer


def build_answer_key_pdf(subject, answers_data):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="AnswerTitleStyle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=16,
        leading=20,
        spaceAfter=10
    )

    heading_style = ParagraphStyle(
        name="AnswerHeadingStyle",
        parent=styles["Heading2"],
        spaceBefore=10,
        spaceAfter=8
    )

    normal_style = styles["BodyText"]
    normal_style.leading = 16

    story = []

    story.append(Paragraph(subject, title_style))
    story.append(Paragraph("AI Generated Answer Key & Evaluation Scheme", title_style))
    story.append(Spacer(1, 16))

    if not isinstance(answers_data, dict):
        answers_data = {"Generated Answers": [{"question": "", "marks": "", "answer_data": str(answers_data)}]}

    for section_name, questions in answers_data.items():
        story.append(Paragraph(section_name, heading_style))
        story.append(Spacer(1, 8))

        for i, q in enumerate(questions, start=1):
            question_text = q.get("question", "")
            marks = q.get("marks", "")
            answer_data = q.get("answer_data", "")

            story.append(Paragraph(f"{i}. {question_text} ({marks} marks)", normal_style))
            story.append(Spacer(1, 4))

            answer_lines = str(answer_data).split("\n")
            for line in answer_lines:
                clean_line = line.strip()
                if not clean_line:
                    story.append(Spacer(1, 4))
                    continue
                story.append(Paragraph(clean_line, normal_style))

            story.append(Spacer(1, 10))

    doc.build(story)
    buffer.seek(0)
    return buffer


@app.route("/")
def home():
    return jsonify({
        "message": "AI Question Paper Generator Backend is running"
    })


@app.route("/test-db")
def test_db():
    conn = get_db_connection()

    if conn is None:
        return jsonify({
            "success": False,
            "message": "Database connection failed"
        }), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM subjects")
    subjects = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "subjects": subjects
    })


@app.route("/subjects", methods=["GET"])
def get_subjects():
    conn = get_db_connection()

    if conn is None:
        return jsonify({
            "success": False,
            "message": "Database connection failed"
        }), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM subjects ORDER BY id ASC")
    subjects = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": subjects
    })


@app.route("/syllabus-units/<int:subject_id>", methods=["GET"])
def get_syllabus_units(subject_id):
    conn = get_db_connection()

    if conn is None:
        return jsonify({
            "success": False,
            "message": "Database connection failed"
        }), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, subject_id, unit_name, topic_name, weightage
        FROM syllabus_units
        WHERE subject_id = %s
        ORDER BY id ASC
    """, (subject_id,))
    units = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": units
    })


@app.route("/add-question", methods=["POST"])
def add_question():
    conn = get_db_connection()

    if conn is None:
        return jsonify({
            "success": False,
            "message": "Database connection failed"
        }), 500

    data = request.get_json()

    required_fields = [
        "subject_id",
        "unit_id",
        "question_text",
        "question_type",
        "difficulty_level",
        "blooms_level",
        "marks"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    cursor = conn.cursor()

    query = """
        INSERT INTO question_bank
        (
            subject_id, unit_id, question_text, question_type,
            difficulty_level, blooms_level, marks,
            answer_text, evaluation_scheme, keywords
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
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
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Question added successfully"
    })


@app.route("/test-gemini", methods=["GET"])
def test_gemini():
    try:
        result = test_gemini_connection()
        return jsonify({
            "success": True,
            "message": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/generate-questions", methods=["POST"])
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

    return jsonify({
        "success": True,
        "questions": result
    })


@app.route("/generate-paper", methods=["POST"])
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

        return jsonify({
            "success": True,
            "paper": paper
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/generate-ai-paper", methods=["POST"])
def generate_ai_paper():
    data = request.get_json()

    subject = data.get("subject")
    topics = data.get("topics")
    difficulty = data.get("difficulty")

    if not subject:
        return jsonify({"success": False, "message": "Subject required"}), 400

    if not topics:
        return jsonify({"success": False, "message": "Topics required"}), 400

    if not difficulty:
        return jsonify({"success": False, "message": "Difficulty required"}), 400

    paper = generate_ai_question_paper(
        subject=subject,
        topics=topics,
        difficulty=difficulty
    )

    return jsonify({
        "success": True,
        "paper": paper
    })


@app.route("/generate-answers", methods=["POST"])
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

        return jsonify({
            "success": True,
            "answers": answers
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/download-question-paper", methods=["POST"])
def download_question_paper():
    data = request.get_json()

    subject = data.get("subject")
    topics = data.get("topics")
    difficulty = data.get("difficulty", "Medium")
    blooms_level = data.get("blooms_level", "Understand")
    total_marks = data.get("total_marks", 70)

    if not subject:
        return jsonify({"success": False, "message": "Subject required"}), 400

    if not topics or not isinstance(topics, list):
        return jsonify({"success": False, "message": "Topics must be a list"}), 400

    try:
        mcqs = generate_mcq_questions(
            subject=subject,
            topics=topics,
            difficulty=difficulty,
            blooms_level=blooms_level,
            count=5
        )

        cleaned_mcqs = []
        for q in mcqs:
            if not isinstance(q, dict):
                continue

            options = q.get("options", {})
            if not isinstance(options, dict):
                options = {}

            cleaned_mcqs.append({
                "question": q.get("question", ""),
                "options": {
                    "A": options.get("A", ""),
                    "B": options.get("B", ""),
                    "C": options.get("C", ""),
                    "D": options.get("D", "")
                },
                "correct_answer": q.get("correct_answer", "")
            })

        section_b = generate_section_questions(
            subject=subject,
            topics=topics,
            difficulty=difficulty,
            blooms_level=blooms_level,
            question_type="Short/Medium Answer",
            marks=5,
            count=4
        )

        section_c = generate_section_questions(
            subject=subject,
            topics=topics,
            difficulty=difficulty,
            blooms_level=blooms_level,
            question_type="Long Answer",
            marks=10,
            count=4
        )

        pdf_buffer = build_question_paper_pdf(
            subject=subject,
            total_marks=total_marks,
            section_a_mcqs=cleaned_mcqs,
            section_b_questions=section_b,
            section_c_questions=section_c
        )

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name="ai_question_paper.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/download-answer-key", methods=["POST"])
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
            download_name="ai_answer_key.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)