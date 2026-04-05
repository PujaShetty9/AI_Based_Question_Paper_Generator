from generators.question_generator import generate_section_questions, generate_mcq_questions


def normalize_bloom(bloom_str):
    """
    Converts frontend bloom values to backend expected values.
    'Remember/Understand' -> 'understand'
    'Apply/Analyze'       -> 'apply'
    'Evaluate/Create'     -> 'evaluate'
    'Mixed Coverage'      -> 'understand'
    """
    bloom_str = bloom_str.lower()

    if "remember" in bloom_str or "understand" in bloom_str:
        return "understand"
    elif "apply" in bloom_str or "analyze" in bloom_str:
        return "apply"
    elif "evaluate" in bloom_str or "create" in bloom_str:
        return "evaluate"
    else:
        return "understand"


def get_section_type(section, paper_type):
    """
    Determines if a section should generate MCQ or Subjective questions.
    """
    if paper_type == "MCQ":
        return "MCQ"
    elif paper_type == "Subjective":
        return "Subjective"
    else:
        # MCQ+Subjective — use per-section type set by teacher
        return section.get("type", "Subjective")


def generate_ai_question_paper(subject, topics, sections, paper_type="MCQ+Subjective"):
    """
    Generates a full question paper based on teacher-configured sections.

    sections = [
        {
            "name": "Section A",
            "questions": 5,
            "marksPerQ": 2,
            "bloom": "Remember/Understand",
            "diff": "Easy",
            "type": "MCQ"         ← used when paper_type is MCQ+Subjective
        },
        ...
    ]
    """
    paper = {}

    for section in sections:
        name = section.get("name", "Section")
        count = int(section.get("questions", 2))
        marks = int(section.get("marksPerQ", 5))
        bloom = normalize_bloom(section.get("bloom", "understand"))
        difficulty = section.get("diff", "Medium")
        section_type = get_section_type(section, paper_type)

        if section_type == "MCQ":
            questions = generate_mcq_questions(
                subject=subject,
                topics=topics,
                difficulty=difficulty,
                blooms_level=bloom,
                count=count
            )
        else:
            question_type = "Short Answer" if marks <= 5 else "Long Answer"
            questions = generate_section_questions(
                subject=subject,
                topics=topics,
                difficulty=difficulty,
                blooms_level=bloom,
                question_type=question_type,
                marks=marks,
                count=count
            )

        paper[name] = questions

    return paper