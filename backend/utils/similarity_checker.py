from utils.text_utils import normalize_text, text_to_word_set


def jaccard_similarity(text1, text2):
    words1 = text_to_word_set(text1)
    words2 = text_to_word_set(text2)

    if not words1 and not words2:
        return 1.0
    if not words1 or not words2:
        return 0.0

    intersection = words1.intersection(words2)
    union = words1.union(words2)

    return len(intersection) / len(union)


def remove_similar_questions(questions, threshold=0.7):
    unique_questions = []

    for question in questions:
        is_duplicate = any(
            jaccard_similarity(question, saved) >= threshold
            for saved in unique_questions
        )

        if not is_duplicate:
            unique_questions.append(question)

    return unique_questions