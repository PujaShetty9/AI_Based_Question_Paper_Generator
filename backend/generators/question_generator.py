import google.generativeai as genai
from config import GEMINI_API_KEY
import json

genai.configure(api_key=GEMINI_API_KEY)


def test_gemini_connection():
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(
        "Reply with exactly this text: Gemini connection successful."
    )
    return response.text


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
4. Question
5. Question
"""

    response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

    text = response.text
    questions = [q.strip() for q in text.split("\n") if q.strip()]
    return questions


def generate_full_question_paper(subject, units, total_marks, difficulty):
    units_text = ", ".join(units)

    prompt = f"""
You are an expert university exam paper setter.

Generate a complete question paper for the subject: {subject}

Units to cover: {units_text}
Total Marks: {total_marks}
Overall Difficulty: {difficulty}

Paper Rules:
- Create a balanced university-level question paper
- Cover the given units properly
- Do not repeat similar questions
- Use clear section headings
- Include marks for each question
- Return only the final formatted question paper

Format:
QUESTION PAPER
Subject: {subject}
Total Marks: {total_marks}

Section A - Short Answer Questions
(5 questions × 2 marks = 10 marks)

Section B - Medium Answer Questions
(4 questions × 5 marks = 20 marks)

Section C - Long Answer Questions
(4 questions × 10 marks = 40 marks)

Make sure the total is exactly {total_marks} marks.
"""

    response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

    return response.text


def generate_section_questions(subject, topics, difficulty, blooms_level, question_type, marks, count):
    topics_text = ", ".join(topics)

    prompt = f"""
You are a university exam question generator.

Subject: {subject}

Topics to cover:
{topics_text}

Difficulty Level: {difficulty}
Bloom's Taxonomy Level: {blooms_level}

Question Type: {question_type}
Marks per question: {marks}

Generate exactly {count} questions.

Rules:
- Questions must be suitable for university exams
- Avoid repeating similar questions
- Ensure coverage of the given topics
- Do NOT include answers
- Do NOT include explanations

Return format:

1. Question
2. Question
3. Question
"""

    response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

    text = response.text
    questions = [q.strip() for q in text.split("\n") if q.strip()]
    return questions


def generate_answer_and_scheme(question, subject, marks):
    prompt = f"""
You are an expert university exam evaluator.

Subject: {subject}
Question: {question}
Marks: {marks}

Generate the following in a clear structured format:

Model Answer:
- Write a proper exam-style answer suitable for {marks} marks.

Key Points:
- List the important points expected in the answer.

Evaluation Scheme:
- Divide the {marks} marks into a simple marking scheme.

Rules:
- Return only these 3 sections:
  1. Model Answer
  2. Key Points
  3. Evaluation Scheme
- Keep the answer relevant and academic
- Do not add any extra introduction
"""

    response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

    return response.text


def generate_mcq_questions(subject, topics, difficulty, blooms_level, count):
    topics_text = ", ".join(topics)

    prompt = f"""
You are a university exam question generator.

Generate exactly {count} multiple choice questions for the subject: {subject}

Topics:
{topics_text}

Difficulty: {difficulty}
Bloom's Taxonomy Level: {blooms_level}

Return ONLY valid JSON in this exact format:
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
- Exactly 4 options per question
- Only one correct answer
- Options should be meaningful and non-repetitive
- Questions must be suitable for university exams
- Do not include markdown
- Do not include explanations
"""

    response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "", 1).strip()
    if text.startswith("```"):
        text = text.replace("```", "", 1).strip()
    if text.endswith("```"):
        text = text[:-3].strip()

    mcqs = json.loads(text)

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

    return cleaned_mcqs