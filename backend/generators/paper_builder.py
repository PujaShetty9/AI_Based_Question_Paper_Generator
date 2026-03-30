from generators.question_generator import generate_section_questions, generate_mcq_questions


def generate_ai_question_paper(subject, topics, difficulty):
    paper = {}

    section_a = generate_mcq_questions(
        subject=subject,
        topics=topics,
        difficulty=difficulty,
        blooms_level="remember",
        count=5
    )

    section_b = generate_section_questions(
        subject=subject,
        topics=topics,
        difficulty=difficulty,
        blooms_level="understand",
        question_type="short answer",
        marks=5,
        count=4
    )

    section_c = generate_section_questions(
        subject=subject,
        topics=topics,
        difficulty=difficulty,
        blooms_level="analyze",
        question_type="long answer",
        marks=10,
        count=4
    )

    paper["Section A"] = section_a
    paper["Section B"] = section_b
    paper["Section C"] = section_c

    return paper