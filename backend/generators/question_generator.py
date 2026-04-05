import re
import json
from groq import Groq
from config import GROQ_API_KEY
from utils.bloom_classifier import is_bloom_match
from utils.similarity_checker import remove_similar_questions, jaccard_similarity

client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"


def call_groq(prompt, temperature=0.7):
    """Central Groq API caller."""
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature
    )
    return response.choices[0].message.content.strip()


def clean_json_response(text):
    """Strips markdown fences from JSON responses."""
    text = text.strip()
    text = re.sub(r"^```json", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()


def clean_question(q):
    return re.sub(r"^\d+\.\s*", "", q).strip()


def test_groq_connection():
    response = call_groq("Reply with exactly this text: Groq connection successful.")
    return response


def generate_questions(topic, difficulty, blooms_level, question_type, num_questions):
    prompt = f"""
Generate {num_questions} exam questions.

Topic: {topic}
Difficulty: {difficulty}
Bloom Level: {blooms_level}
Question Type: {question_type}

Rules:
- Return ONLY the questions
- Do NOT include explanations
- Do NOT include introductory sentences
- Format exactly like this:

1. Question
2. Question
3. Question
"""

    text = call_groq(prompt)
    questions = [clean_question(q) for q in text.split("\n") if q.strip()]
    questions = remove_similar_questions(questions)

    validated = [q for q in questions if is_bloom_match(q, blooms_level)]

    # Fallback if bloom filter too strict
    if len(validated) < num_questions:
        validated = questions

    return validated[:num_questions]


def generate_mcq_questions(subject, topics, difficulty, blooms_level, count):
    BATCH_SIZE = 10
    all_questions = []
    seen = []
    attempts = 0
    max_attempts = (count // BATCH_SIZE + 2) * 2  # allow retries

    while len(all_questions) < count and attempts < max_attempts:
        needed = count - len(all_questions)
        batch_count = min(BATCH_SIZE, needed + 2)  # request slightly more

        batch = _generate_mcq_batch(subject, topics, difficulty, blooms_level, batch_count)

        for q in batch:
            question_text = q.get("question", "")
            if not question_text:
                continue

            # Lower threshold to 0.85 so topic-related questions aren't wrongly filtered
            is_duplicate = any(
                jaccard_similarity(question_text, seen_q) >= 0.85
                for seen_q in seen
            )

            if not is_duplicate:
                all_questions.append(q)
                seen.append(question_text)

            if len(all_questions) >= count:
                break

        attempts += 1

    return all_questions[:count]


def _generate_mcq_batch(subject, topics, difficulty, blooms_level, count):
    """Generates a single batch of MCQs."""
    topics_text = ", ".join(topics)

    prompt = f"""
You are a university exam question generator.

Generate exactly {count} multiple choice questions for the subject: {subject}

Topics: {topics_text}
Difficulty: {difficulty}
Bloom's Taxonomy Level: {blooms_level}

Return ONLY valid JSON in this exact format with no markdown:
[
  {{
    "question": "Question text",
    "options": {{
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    }},
    "correct_answer": "A"
  }}
]

Rules:
- Generate EXACTLY {count} questions, no more no less
- Exactly 4 options per question
- Only one correct answer
- Do not include markdown or explanations
"""

    text = call_groq(prompt, temperature=0.5)
    text = clean_json_response(text)

    try:
        mcqs = json.loads(text)
    except json.JSONDecodeError:
        return []

    cleaned = []
    seen = []

    for q in mcqs:
        if not isinstance(q, dict):
            continue

        options = q.get("options", {})
        if not isinstance(options, dict):
            options = {}

        question_text = q.get("question", "")

        is_duplicate = any(
            jaccard_similarity(question_text, seen_q) >= 0.7
            for seen_q in seen
        )

        if not is_duplicate:
            cleaned.append({
                "question": question_text,
                "options": {
                    "A": options.get("A", ""),
                    "B": options.get("B", ""),
                    "C": options.get("C", ""),
                    "D": options.get("D", "")
                },
                "correct_answer": q.get("correct_answer", "")
            })
            seen.append(question_text)

    return cleaned


def generate_section_questions(subject, topics, difficulty, blooms_level, question_type, marks, count):
    topics_text = ", ".join(topics)

    prompt = f"""
You are a university exam question generator.

Subject: {subject}
Topics: {topics_text}
Difficulty: {difficulty}
Bloom's Taxonomy Level: {blooms_level}
Question Type: {question_type}
Marks per question: {marks}

Generate exactly {count + 2} questions.

Rules:
- Suitable for university exams
- No answers or explanations
- Format:

1. Question
2. Question
3. Question
"""

    text = call_groq(prompt)
    questions = [clean_question(q) for q in text.split("\n") if q.strip()]
    questions = remove_similar_questions(questions)

    # Try bloom filter first
    validated = [q for q in questions if is_bloom_match(q, blooms_level)]

    # If bloom filter removes everything, fall back to similarity-checked questions
    if len(validated) < count:
        validated = questions

    return validated[:count]


def generate_full_question_paper(subject, units, total_marks, difficulty):
    units_text = ", ".join(units)

    prompt = f"""
You are an expert university exam paper setter.

Generate a complete question paper for: {subject}
Units: {units_text}
Total Marks: {total_marks}
Difficulty: {difficulty}

Format:
QUESTION PAPER
Subject: {subject}
Total Marks: {total_marks}

Section A - Short Answer Questions
(5 questions x 2 marks = 10 marks)

Section B - Medium Answer Questions
(4 questions x 5 marks = 20 marks)

Section C - Long Answer Questions
(4 questions x 10 marks = 40 marks)

Return only the formatted question paper.
"""

    return call_groq(prompt, temperature=0.6)


def generate_answer_and_scheme(question, subject, marks):
    prompt = f"""
You are an expert university exam evaluator.

Subject: {subject}
Question: {question}
Marks: {marks}

Provide the following:

Model Answer:
- A proper exam-style answer for {marks} marks.

Key Points:
- Important points expected in the answer.

Evaluation Scheme:
- How to divide {marks} marks.

Rules:
- Return only these 3 sections
- Keep it academic and relevant
- No extra introduction
"""

    return call_groq(prompt, temperature=0.4)