from utils.text_utils import normalize_text


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


def classify_bloom_level(question):
    question = normalize_text(question)

    for level, keywords in BLOOM_KEYWORDS.items():
        for keyword in keywords:
            if question.startswith(keyword) or f" {keyword} " in f" {question} ":
                return level

    return "unknown"


def is_bloom_match(question, expected_level):
    predicted = classify_bloom_level(question)
    return predicted == expected_level.lower()