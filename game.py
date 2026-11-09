"""Shared content and deterministic rules for the Streamlit edition."""
import json
import re
import random
import copy
import unicodedata
from pathlib import Path

CONTENT = json.loads((Path(__file__).parent / "content.json").read_text(encoding="utf-8"))
PUZZLES = CONTENT["puzzles"]
TEXT = CONTENT["translations"]
IDS = ['desk', 'bookshelf', 'painting']
OBJECTS = IDS + ["clock", "chest"]
DIGITS = dict(zip(IDS, '472'))


def fresh(lang="en", previous=None):
    remaining = list(previous['remaining']) if previous and previous['version'] == 2 else []
    last = list(previous.get('selection', dict(zip(IDS, IDS))).values()) if previous else []
    if len(remaining) < 3:
        remaining = [x for x in PUZZLES if x not in last]
        random.shuffle(remaining)
        tail = list(last)
        random.shuffle(tail)
        remaining += tail
    chosen, remaining = remaining[:3], remaining[3:]
    return dict(version=2, lang=lang, active="desk", solved=[],
                hints=dict.fromkeys(IDS, 0), attempts=0, escaped=False,
                selection=dict(zip(IDS, chosen)), remaining=remaining)


def selected(s, obj):
    return PUZZLES[s['selection'][obj] if s['version'] == 2 else obj]


def restore(s):
    if not validate(s):
        raise ValueError('Invalid save')
    s = copy.deepcopy(s)
    if s['version'] == 1:
        s.update(version=2, selection=dict(zip(IDS, IDS)),
                 remaining=[x for x in PUZZLES if x not in IDS])
        random.shuffle(s['remaining'])
    return s


def validate(s):
    if not isinstance(s, dict):
        return False
    try:
        base = (s["version"] in (1, 2) and s["lang"] in ("en", "de")
                and s["active"] in OBJECTS and isinstance(s["solved"], list)
                and all(isinstance(x, str) and x in IDS for x in s["solved"])
                and len(set(s["solved"])) == len(s["solved"])
                and isinstance(s["hints"], dict)
                and all(type(s["hints"][x]) is int and 0 <= s["hints"][x] <= 3 for x in IDS)
                and type(s["attempts"]) is int and s["attempts"] >= 0
                and type(s["escaped"]) is bool
                and (not s["escaped"] or len(s["solved"]) == 3))
        if not base or s['version'] == 1:
            return base
        chosen = [s['selection'][x] for x in IDS]
        return (all(isinstance(x, str) and x in PUZZLES for x in chosen)
                and len(set(chosen)) == 3 and isinstance(s['remaining'], list)
                and all(isinstance(x, str) and x in PUZZLES and x not in chosen for x in s['remaining'])
                and len(set(s['remaining'])) == len(s['remaining']))
    except (KeyError, TypeError, ValueError):
        return False


def normalize(value):
    value = unicodedata.normalize("NFKC", value).lower()
    return " ".join(re.sub(r"[.,!?;:]", "", value).split())


def answer(s, value):
    if s["active"] not in IDS or s["escaped"]:
        return "invalid"
    if s["active"] in s["solved"]:
        return "already"
    if not normalize(value):
        return "empty"
    s["attempts"] += 1
    if normalize(value) not in selected(s, s["active"])[s["lang"]]["answers"]:
        return "wrong"
    s["solved"].append(s["active"])
    return "correct"


def unlock(s, code):
    if len(s["solved"]) != 3:
        return "locked"
    if code.strip() != "".join(DIGITS[x] for x in IDS):
        return "wrongCode"
    s["escaped"] = True
    return "escaped"
