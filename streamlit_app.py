"""Run with: python -m streamlit run streamlit_app.py"""
import json
import streamlit as st
from game import IDS, OBJECTS, DIGITS, TEXT, answer, fresh, unlock, restore, selected

st.set_page_config(page_title="The Riddle Library", page_icon="📚", layout="wide")
st.session_state.setdefault("game", fresh())
st.session_state.setdefault("message", "")
s = st.session_state.game
st.session_state.setdefault("language", s["lang"])


def set_language():
    st.session_state.game["lang"] = st.session_state.language


def restart():
    st.session_state.game = fresh(st.session_state.language, st.session_state.game)
    st.session_state.message = ""
    for key in list(st.session_state):
        if key.startswith("answer_") or key == "exit_code":
            del st.session_state[key]


def import_save():
    file = st.session_state.upload
    if file is None:
        return
    try:
        if file.size > 10000:
            raise ValueError("Save too large")
        saved = json.loads(file.getvalue())
        st.session_state.game = restore(saved)
        st.session_state.language = saved["lang"]
        st.session_state.message = "loaded"
    except (ValueError, TypeError, UnicodeError):
        st.session_state.message = "badSave"


t = TEXT[s["lang"]]
with st.sidebar:
    st.header(t["brand"])
    st.selectbox(t["languageLabel"], ["en", "de"],
                 format_func=lambda x: {"en": "English", "de": "Deutsch"}[x],
                 key="language", on_change=set_language)
    active = st.radio(t["explore"], OBJECTS, index=OBJECTS.index(s["active"]),
                      format_func=lambda x: t["names"][OBJECTS.index(x)] + (" ✓" if x in s["solved"] else ""))
    s["active"] = active
    st.divider()
    st.caption(t["noteTitle"])
    st.write(t["note"])
    st.download_button(t["save"], json.dumps(s, ensure_ascii=False, indent=2),
                       file_name="riddle-library-save.json", mime="application/json")
    st.file_uploader(t["load"], type=["json"], key="upload", on_change=import_save)
    confirmation = st.checkbox(t["confirm"], key="restart_confirmation")
    st.button(t["restart"], disabled=not confirmation, on_click=restart)

st.title(t["title"])
st.write(t["intro"])
st.progress(len(s["solved"]) / 3, text=(f'{len(s["solved"])} / 3 · ' + t["explore"]))
attempts, hints = s["attempts"], sum(s["hints"].values())
st.caption(f'{attempts} attempts · {hints} hints used' if s["lang"] == "en" else f'{attempts} Versuche · {hints} Hinweise genutzt')
left, right = st.columns([3, 1])
with left:
    index = OBJECTS.index(active)
    st.header(t["names"][index])
    st.write(t["descriptions"][index])
    if active in IDS:
        p = selected(s, active)[s["lang"]]
        solved = active in s["solved"]
        st.markdown(f'> {p["q"]}')
        with st.form(f"riddle_{active}"):
            value = st.text_input(t["answerLabel"], key=f"answer_{active}", disabled=solved or s["escaped"], max_chars=150)
            if st.form_submit_button(t["submit"], disabled=solved or s["escaped"]):
                st.session_state.message = answer(s, value)
                st.rerun()
        if st.button(t["hintButton"], disabled=solved or s["escaped"] or s["hints"][active] >= 3):
            s["hints"][active] += 1
            st.session_state.message = ""
            st.rerun()
        st.caption(f'{s["hints"][active]} / 3')
        for i, hint in enumerate(p["hints"][:s["hints"][active]], 1):
            st.info(f"{i}. {hint}")
        if solved:
            st.success(t["already"])
    elif active == "clock":
        st.info(t["clock"])
    elif not s["escaped"]:
        with st.form("exit"):
            code = st.text_input(t["codeLabel"], key="exit_code", max_chars=3)
            if st.form_submit_button(t["unlock"]):
                st.session_state.message = unlock(s, code)
                st.rerun()
    if st.session_state.message:
        st.info(t.get(st.session_state.message, ""))

with right:
    st.subheader(t["codeTitle"])
    st.caption(t["codeHelp"])
    for i, key in enumerate(IDS, 1):
        st.metric((f"Digit {i}" if s["lang"] == "en" else f"Ziffer {i}"),
                  DIGITS[key] if key in s["solved"] else "—")
    st.caption(t["order"])
if s["escaped"]:
    st.success(t["victoryTitle"] + " " + t["victoryText"])
st.divider()
st.caption('12 riddles · Restart for a new set. No repeats until the pool is exhausted.'
           if s['lang'] == 'en' else '12 Rätsel · Neues Spiel für neue Rätsel. Keine Wiederholung, bis alle gespielt wurden.')
st.markdown('[Riddles adapted from RiddlesGo](https://riddlesgo.com/english-riddles/)'
            if s["lang"] == "en" else '[Rätsel nach RiddlesGo](https://riddlesgo.com/english-riddles/)')
st.caption("No AI or external APIs. Export your save before closing or refreshing this session."
           if s["lang"] == "en" else "Keine KI oder externen APIs. Exportiere deinen Spielstand vor dem Schließen oder Neuladen.")
