from generators.question_generator import generate_answer_and_scheme


def generate_answers_for_paper(subject, paper):
    if isinstance(paper, str):
        sections = {}
        current_section = None

        for line in paper.split("\n"):
            line = line.strip()
            if not line:
                continue

            if line.startswith("Section A"):
                current_section = "Section A"
                sections[current_section] = []
            elif line.startswith("Section B"):
                current_section = "Section B"
                sections[current_section] = []
            elif line.startswith("Section C"):
                current_section = "Section C"
                sections[current_section] = []
            elif current_section:
                sections[current_section].append(line)

        paper = sections

    result = {}

    for section_name, questions in paper.items():
        result[section_name] = []

        for q in questions:
            question_text = q

            marks = 2
            if section_name == "Section B":
                marks = 5
            elif section_name == "Section C":
                marks = 10

            answer_data = generate_answer_and_scheme(
                question=question_text,
                subject=subject,
                marks=marks
            )

            result[section_name].append({
                "question": question_text,
                "marks": marks,
                "answer_data": answer_data
            })

    return result