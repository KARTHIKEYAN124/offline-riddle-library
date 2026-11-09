"""Shared content and deterministic rules for the Streamlit edition."""
import json
import re
import unicodedata
from pathlib import Path

CONTENT = json.loads((Path(__file__).parent / "content.json").read_text(encoding="utf-8"))
PUZZLES = CONTENT["puzzles"]
TEXT = CONTENT["translations"]
IDS = list(PUZZLES)
OBJECTS = IDS + ["clock", "chest"]


def fresh(lang="en"):
    return dict(version=1, lang=lang, active="desk", solved=[],
                hints=dict.fromkeys(IDS, 0), attempts=0, escaped=False)


def validate(s):
    if not isinstance(s, dict):
        return False
    try:
        return (s["version"] == 1 and s["lang"] in ("en", "de")
                and s["active"] in OBJECTS and isinstance(s["solved"], list)
                and all(isinstance(x, str) and x in IDS for x in s["solved"])
                and len(set(s["solved"])) == len(s["solved"])
                and isinstance(s["hints"], dict)
                and all(type(s["hints"][x]) is int and 0 <= s["hints"][x] <= 3 for x in IDS)
                and type(s["attempts"]) is int and s["attempts"] >= 0
                and type(s["escaped"]) is bool
                and (not s["escaped"] or len(s["solved"]) == 3))
    except (KeyError, TypeError, ValueError):
        return False


def normalize(value):
    value = unicodedata.normalize("NFKC", value).lower()
    return " ".join(re.sub(r"[.,!?;:]", "", value).split())


def answer(s, value):
    if s["active"] not in PUZZLES or s["escaped"]:
        return "invalid"
    if s["active"] in s["solved"]:
        return "already"
    if not normalize(value):
        return "empty"
    s["attempts"] += 1
    if normalize(value) not in PUZZLES[s["active"]][s["lang"]]["answers"]:
        return "wrong"
    s["solved"].append(s["active"])
    return "correct"


def unlock(s, code):
    if len(s["solved"]) != 3:
        return "locked"
    if code.strip() != "".join(PUZZLES[x]["digit"] for x in IDS):
        return "wrongCode"
    s["escaped"] = True
    return "escaped"
