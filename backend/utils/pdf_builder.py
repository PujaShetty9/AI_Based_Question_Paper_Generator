from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER


def _get_styles():
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

    normal_style = ParagraphStyle(
        name="NormalStyle",
        parent=styles["BodyText"],
        leading=16
    )

    return title_style, heading_style, normal_style


def build_question_paper_pdf(subject, total_marks, section_a_mcqs, section_b_questions, section_c_questions):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )

    title_style, heading_style, normal_style = _get_styles()
    story = []

    story.append(Paragraph(subject, title_style))
    story.append(Paragraph("AI Generated Question Paper", title_style))
    story.append(Paragraph(f"Total Marks: {total_marks}", title_style))
    story.append(Spacer(1, 16))

    story.append(Paragraph("Section A — MCQs (2 Marks Each)", heading_style))
    for i, q in enumerate(section_a_mcqs, start=1):
        question_text = q.get("question", "") if isinstance(q, dict) else str(q)
        options = q.get("options", {}) if isinstance(q, dict) else {}
        if not isinstance(options, dict):
            options = {}

        story.append(Paragraph(f"{i}. {question_text}", normal_style))
        for key in ["A", "B", "C", "D"]:
            story.append(Paragraph(f"&nbsp;&nbsp;{key}. {options.get(key, '')}", normal_style))
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Section B — Short Answer (5 Marks Each)", heading_style))
    for i, q in enumerate(section_b_questions, start=1):
        story.append(Paragraph(f"{i}. {str(q)}", normal_style))
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Section C — Long Answer (10 Marks Each)", heading_style))
    for i, q in enumerate(section_c_questions, start=1):
        story.append(Paragraph(f"{i}. {str(q)}", normal_style))
        story.append(Spacer(1, 8))

    doc.build(story)
    buffer.seek(0)
    return buffer


def build_answer_key_pdf(subject, answers_data):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )

    title_style, heading_style, normal_style = _get_styles()
    story = []

    story.append(Paragraph(subject, title_style))
    story.append(Paragraph("AI Generated Answer Key & Evaluation Scheme", title_style))
    story.append(Spacer(1, 16))

    if not isinstance(answers_data, dict):
        answers_data = {
            "Generated Answers": [{"question": "", "marks": "", "answer_data": str(answers_data)}]
        }

    for section_name, questions in answers_data.items():
        story.append(Paragraph(section_name, heading_style))
        story.append(Spacer(1, 8))

        for i, q in enumerate(questions, start=1):
            question_text = q.get("question", "")
            marks = q.get("marks", "")
            answer_data = q.get("answer_data", "")

            story.append(Paragraph(f"{i}. {question_text} ({marks} marks)", normal_style))
            story.append(Spacer(1, 4))

            for line in str(answer_data).split("\n"):
                clean_line = line.strip()
                if not clean_line:
                    story.append(Spacer(1, 4))
                    continue
                story.append(Paragraph(clean_line, normal_style))

            story.append(Spacer(1, 10))

    doc.build(story)
    buffer.seek(0)
    return buffer