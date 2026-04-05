from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def get_styles():
    styles = getSampleStyleSheet()

    normal = ParagraphStyle(
        name="Normal",
        fontName="Times-Roman",
        fontSize=10,
        leading=14,
    )
    bold = ParagraphStyle(
        name="Bold",
        fontName="Times-Bold",
        fontSize=10,
        leading=14,
    )
    center = ParagraphStyle(
        name="Center",
        fontName="Times-Bold",
        fontSize=11,
        leading=16,
        alignment=TA_CENTER,
    )
    small = ParagraphStyle(
        name="Small",
        fontName="Times-Roman",
        fontSize=9,
        leading=12,
    )
    small_bold = ParagraphStyle(
        name="SmallBold",
        fontName="Times-Bold",
        fontSize=9,
        leading=12,
    )
    return normal, bold, center, small, small_bold


def build_question_paper_pdf(
    subject, total_marks, teacher, date,
    section_a_mcqs, section_b_questions, section_c_questions,
    department="Department of Computer Engineering",
    academic_year="", class_name="", div="", sem="",
    exam_type="", duration="", notes="",
    sections=None, paper_data=None
):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=15*mm, leftMargin=15*mm,
        topMargin=15*mm, bottomMargin=15*mm
    )

    normal, bold, center, small, small_bold = get_styles()
    story = []

    # ── HEADER TABLE (PCE logo + College name) ──
    header_data = [[
        Paragraph("<b>PCE</b>", ParagraphStyle(
            name="Logo", fontName="Times-Bold",
            fontSize=16, alignment=TA_CENTER
        )),
        Paragraph(
            f"<b>MES's Pillai College of Engineering (Autonomous), New Panvel - 410206</b><br/>{department}",
            ParagraphStyle(name="CollegeName", fontName="Times-Roman",
                           fontSize=11, alignment=TA_CENTER, leading=16)
        )
    ]]
    header_table = Table(header_data, colWidths=[25*mm, None])
    header_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('LINEAFTER', (0, 0), (0, -1), 0.8, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(header_table)

    # ── META TABLE (Course, Faculty, Academic Year | Class, Div, Sem) ──
    meta_data = [
        [
            Paragraph(f"<b>Course Name:</b> {subject}", small),
            Paragraph(f"<b>Class:</b> {class_name}", small)
        ],
        [
            Paragraph(f"<b>Faculty Name:</b> {teacher}", small),
            Paragraph(f"<b>Div:</b> {div}", small)
        ],
        [
            Paragraph(f"<b>Academic Year:</b> {academic_year}", small),
            Paragraph(f"<b>Sem:</b> {sem}", small)
        ],
    ]
    meta_table = Table(meta_data, colWidths=[None, 50*mm])
    meta_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('LINEAFTER', (0, 0), (0, -1), 0.8, colors.black),
        ('LINEBEFORE', (1, 0), (1, -1), 0.8, colors.black),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.black),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)

    # ── EXAM BAR (Exam Type | Duration | Date | Max Marks) ──
    exam_data = [[
        Paragraph(f"<b>{exam_type}</b>", small),
        Paragraph(f"<b>Duration:</b> {duration}", small),
        Paragraph(f"<b>Date:</b> {date}", small),
        Paragraph(f"<b>Max. Marks:</b> {total_marks}", small),
    ]]
    exam_table = Table(exam_data, colWidths=[40*mm, 45*mm, 55*mm, None])
    exam_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('LINEBETWEEN', (0, 0), (-1, -1), 0.5, colors.black),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(exam_table)

    # ── NOTES ──
    if notes:
        notes_data = [[Paragraph(f"<b>Note:</b> {notes}", small)]]
        notes_table = Table(notes_data, colWidths=[None])
        notes_table.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(notes_table)

    # ── MAIN QUESTION TABLE ──
    # Build header row
    q_rows = []
    q_rows.append([
        Paragraph("<b>Q.</b>", small_bold),
        Paragraph("<b>Question</b>", small_bold),
        Paragraph("<b>Marks</b>", small_bold),
        Paragraph("<b>BT</b>", small_bold),
    ])

    # Helper to get bloom text
    def bloom_text(section_config):
        if not section_config:
            return "1, 2"
        bloom = section_config.get("bloom", "")
        if "Remember" in bloom or "Understand" in bloom:
            return "1, 2"
        elif "Apply" in bloom or "Analyze" in bloom:
            return "3, 4"
        elif "Evaluate" in bloom or "Create" in bloom:
            return "5, 6"
        return "1, 2"

    # Helper to get attempt text
    def attempt_text(section_config):
        if not section_config:
            return "Attempt All"
        if section_config.get("attemptType") == "Attempt Any":
            x = section_config.get("attemptX", "__")
            y = section_config.get("attemptY", "__")
            return f"Attempt Any {x} out of {y}"
        return "Attempt All"

    # Helper to find section config by name
    def get_section_config(name):
        if not sections:
            return None
        for s in sections:
            if s.get("name", "").strip().lower() == name.strip().lower():
                return s
        return None

    # Use paper_data if provided, else fall back to old sections
    if paper_data:
        paper_sections = list(paper_data.items())
    else:
        paper_sections = []
        if section_a_mcqs:
            paper_sections.append(("Section A", section_a_mcqs))
        if section_b_questions:
            paper_sections.append(("Section B", section_b_questions))
        if section_c_questions:
            paper_sections.append(("Section C", section_c_questions))

    for sec_idx, (section_name, questions) in enumerate(paper_sections):
        sec_config = get_section_config(section_name)
        marks_per_q = sec_config.get("marksPerQ", 5) if sec_config else 5
        bt = bloom_text(sec_config)
        attempt = attempt_text(sec_config)

        # Section header row
        q_rows.append([
            Paragraph(f"<b>Q.{sec_idx + 1}</b>", small_bold),
            Paragraph(f"<b>{attempt}</b>", small_bold),
            Paragraph("", small),
            Paragraph("", small),
        ])

        # Questions
        for q_idx, q in enumerate(questions):
            label = f"({chr(97 + q_idx)})"

            if isinstance(q, dict) and "options" in q:
                # MCQ
                options = q.get("options", {})
                q_text = (
                    f"{q.get('question', '')}<br/>"
                    f"<font size='8'>A. {options.get('A', '')}  "
                    f"B. {options.get('B', '')}  "
                    f"C. {options.get('C', '')}  "
                    f"D. {options.get('D', '')}</font>"
                )
                q_rows.append([
                    Paragraph(label, small_bold),
                    Paragraph(q_text, small),
                    Paragraph(str(marks_per_q), small),
                    Paragraph(bt, small),
                ])
            else:
                # Subjective
                q_text = q if isinstance(q, str) else str(q)
                q_rows.append([
                    Paragraph(label, small_bold),
                    Paragraph(q_text, small),
                    Paragraph(str(marks_per_q), small),
                    Paragraph(bt, small),
                ])

    q_table = Table(q_rows, colWidths=[15*mm, None, 18*mm, 18*mm])
    q_style = [
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (2, 0), (3, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        # Header row style
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f5f5f5')),
    ]

    # Gray background for section header rows
    row_num = 1
    for sec_idx, (section_name, questions) in enumerate(paper_sections):
        q_style.append(('BACKGROUND', (0, row_num), (-1, row_num), colors.HexColor('#fafafa')))
        row_num += len(questions) + 1

    q_table.setStyle(TableStyle(q_style))
    story.append(q_table)

    doc.build(story)
    buffer.seek(0)
    return buffer


def build_answer_key_pdf(
    subject, answers_data, teacher="", date="",
    department="Department of Computer Engineering",
    academic_year="", class_name="", div="", sem="",
    exam_type="", duration="", notes="", total_marks=""
):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=15*mm, leftMargin=15*mm,
        topMargin=15*mm, bottomMargin=15*mm
    )

    normal, bold, center, small, small_bold = get_styles()
    story = []

    # ── HEADER ──
    header_data = [[
        Paragraph("<b>PCE</b>", ParagraphStyle(
            name="Logo2", fontName="Times-Bold",
            fontSize=16, alignment=TA_CENTER
        )),
        Paragraph(
            f"<b>MES's Pillai College of Engineering (Autonomous), New Panvel - 410206</b><br/>{department}<br/><b>Answer Key & Evaluation Scheme</b>",
            ParagraphStyle(name="CollegeName2", fontName="Times-Roman",
                           fontSize=11, alignment=TA_CENTER, leading=16)
        )
    ]]
    header_table = Table(header_data, colWidths=[25*mm, None])
    header_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('LINEAFTER', (0, 0), (0, -1), 0.8, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(header_table)

    # ── META ──
    meta_data = [
        [Paragraph(f"<b>Course Name:</b> {subject}", small),
         Paragraph(f"<b>Class:</b> {class_name}", small)],
        [Paragraph(f"<b>Faculty Name:</b> {teacher}", small),
         Paragraph(f"<b>Div:</b> {div}", small)],
        [Paragraph(f"<b>Academic Year:</b> {academic_year}", small),
         Paragraph(f"<b>Sem:</b> {sem}", small)],
    ]
    meta_table = Table(meta_data, colWidths=[None, 50*mm])
    meta_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('LINEAFTER', (0, 0), (0, -1), 0.8, colors.black),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.black),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)

    # ── EXAM BAR ──
    exam_data = [[
        Paragraph(f"<b>{exam_type}</b>", small),
        Paragraph(f"<b>Duration:</b> {duration}", small),
        Paragraph(f"<b>Date:</b> {date}", small),
        Paragraph(f"<b>Max. Marks:</b> {total_marks}", small),
    ]]
    exam_table = Table(exam_data, colWidths=[40*mm, 45*mm, 55*mm, None])
    exam_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('LINEBETWEEN', (0, 0), (-1, -1), 0.5, colors.black),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(exam_table)

    # ── ANSWER SECTIONS ──
    if not isinstance(answers_data, dict):
        answers_data = {
            "Answers": [{"question": "", "marks": "", "answer_data": str(answers_data)}]
        }

    for section_name, questions in answers_data.items():
        # Section header
        sec_header = [[Paragraph(f"<b>{section_name}</b>", small_bold)]]
        sec_table = Table(sec_header, colWidths=[None])
        sec_table.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f5f5')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(sec_table)

        for i, q in enumerate(questions):
            question_text = q.get("question", "")
            marks = q.get("marks", "")
            answer_data = q.get("answer_data", "")
            label = f"({chr(97 + i)})"

            # Question row
            q_row = [[
                Paragraph(f"<b>{label}</b>", small_bold),
                Paragraph(f"<b>{question_text}</b> ({marks} marks)", small),
            ]]
            q_table = Table(q_row, colWidths=[12*mm, None])
            q_table.setStyle(TableStyle([
                ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
                ('LINEAFTER', (0, 0), (0, -1), 0.5, colors.black),
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fafafa')),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(q_table)

            # Answer row
            answer_lines = str(answer_data).strip()
            ans_row = [[Paragraph(answer_lines.replace("\n", "<br/>"), small)]]
            ans_table = Table(ans_row, colWidths=[None])
            ans_table.setStyle(TableStyle([
                ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ]))
            story.append(ans_table)

        story.append(Spacer(1, 8))

    doc.build(story)
    buffer.seek(0)
    return buffer