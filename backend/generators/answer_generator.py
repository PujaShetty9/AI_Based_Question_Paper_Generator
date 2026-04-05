import re
from generators.question_generator import generate_answer_and_scheme


def clean_markdown(text):
    text = re.sub(r'##\s*', '', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'^\s*[-•]\s*', '• ', text, flags=re.MULTILINE)
    return text.strip()


def get_marks_for_section(section_name, sections):
    if not sections:
        return 5
    for s in sections:
        if s.get("name", "").strip().lower() == section_name.strip().lower():
            return int(s.get("marksPerQ", 5))
    return 5


def generate_answers_for_paper(subject, paper, sections=None):
    if isinstance(paper, str):
        parsed = {}
        current_section = None
        for line in paper.split("\n"):
            line = line.strip()
            if not line:
                continue
            if line.startswith("Section"):
                current_section = line
                parsed[current_section] = []
            elif current_section:
                parsed[current_section].append(line)
        paper = parsed

    result = {}

    for section_name, questions in paper.items():
        result[section_name] = []
        marks = get_marks_for_section(section_name, sections)

        for q in questions:
            if isinstance(q, dict) and "options" in q:
                question_text = q.get("question", "")
            elif isinstance(q, dict):
                question_text = q.get("question", "")
            else:
                question_text = str(q)

            answer_data = generate_answer_and_scheme(
                question=question_text,
                subject=subject,
                marks=marks
            )

            answer_data = clean_markdown(answer_data)

            result[section_name].append({
                "question": question_text,
                "marks": marks,
                "answer_data": answer_data
            })

    return result