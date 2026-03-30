import re


BLOOM_KEYWORDS = {
    "remember": [
        "define", "list", "name", "identify", "state", "recall", "mention"
    ],
    "understand": [
        "explain", "describe", "summarize", "differentiate", "outline", "discuss"
    ],
    "apply": [
        "apply", "use", "solve", "demonstrate", "illustrate", "implement"
    ],
    "analyze": [
        "analyze", "compare", "contrast", "distinguish", "examine", "categorize"
    ],
    "evaluate": [
        "evaluate", "justify", "critique", "assess", "argue", "defend"
    ],
    "create": [
        "design", "develop", "create", "formulate", "construct", "propose"
    ]
}


def normalize_text(text):
    text = text.lower().strip()
    text = re.sub(r"^\d+\.\s*", "", text)   # remove numbering like 1. 2.
    text = re.sub(r"[^\w\s]", "", text)     # remove punctuation
    return text


def classify_bloom_level(question):
    """
    Classifies a question into a Bloom's taxonomy level
    using simple keyword matching.
    """
    question = normalize_text(question)

    for level, keywords in BLOOM_KEYWORDS.items():
        for keyword in keywords:
            if question.startswith(keyword) or f" {keyword} " in f" {question} ":
                return level

    return "unknown"


def is_bloom_match(question, expected_level):
    predicted = classify_bloom_level(question)
    return predicted == expected_level.lower()