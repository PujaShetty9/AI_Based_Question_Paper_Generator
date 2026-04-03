import re


def normalize_text(text):
    text = text.lower().strip()
    text = re.sub(r"^\d+\.\s*", "", text)   # remove numbering like 1. 2.
    text = re.sub(r"[^\w\s]", "", text)     # remove punctuation
    return text


def text_to_word_set(text):
    return set(normalize_text(text).split())