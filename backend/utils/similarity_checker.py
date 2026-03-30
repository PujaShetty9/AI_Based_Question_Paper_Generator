import re


def normalize_text(text):
    text = text.lower().strip()
    text = re.sub(r"^\d+\.\s*", "", text)   # remove numbering
    text = re.sub(r"[^\w\s]", "", text)     # remove punctuation
    return text


def text_to_word_set(text):
    return set(normalize_text(text).split())


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
    """
    Removes questions that are too similar to previous ones.
    """
    unique_questions = []

    for question in questions:
        is_duplicate = False

        for saved_question in unique_questions:
            similarity = jaccard_similarity(question, saved_question)
            if similarity >= threshold:
                is_duplicate = True
                break

        if not is_duplicate:
            unique_questions.append(question)

    return unique_questions