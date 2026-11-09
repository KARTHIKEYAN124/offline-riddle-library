import unittest
from pathlib import Path
from streamlit.testing.v1 import AppTest
from game import fresh, validate, selected, restore

ROOT = Path(__file__).resolve().parents[1]


class StreamlitTests(unittest.TestCase):
    def app(self):
        app = AppTest.from_file(str(ROOT / "streamlit_app.py"), default_timeout=15).run()
        self.assertFalse(app.exception)
        return app

    def test_complete_english_flow(self):
        app = self.app()
        for obj in ['desk', 'bookshelf', 'painting']:
            value = selected(app.session_state.game, obj)['en']['answers'][0]
            app.radio[0].set_value(obj).run()
            app.text_input(key=f"answer_{obj}").set_value(value)
            next(b for b in app.button if b.label == "Check answer").click().run()
            self.assertFalse(app.exception)
        app.radio[0].set_value("chest").run()
        app.text_input(key="exit_code").set_value("472")
        next(b for b in app.button if b.label == "Unlock exit").click().run()
        self.assertTrue(app.session_state.game["escaped"])
        self.assertFalse(app.exception)

    def test_hint_language_and_restart(self):
        app = self.app()
        next(b for b in app.button if b.label == "Reveal a hint").click().run()
        app.selectbox(key="language").set_value("de").run()
        self.assertEqual(app.session_state.game["hints"]["desk"], 1)
        self.assertEqual(app.title[0].value, "Jede Antwort öffnet eine Tür.")
        app.text_input(key="answer_desk").set_value(selected(app.session_state.game, 'desk')['de']['answers'][0])
        next(b for b in app.button if b.label == "Antwort prüfen").click().run()
        self.assertIn("desk", app.session_state.game["solved"])
        old_selection = set(app.session_state.game['selection'].values())
        app.checkbox[0].check().run()
        next(b for b in app.button if b.label == "Neues Spiel").click().run()
        state = app.session_state.game
        self.assertTrue(validate(state))
        self.assertEqual(state['lang'], 'de')
        self.assertEqual(state['solved'], [])
        self.assertTrue(old_selection.isdisjoint(state['selection'].values()))
        self.assertFalse(app.exception)

    def test_invalid_saves(self):
        for data in [None, {}, {**fresh(), "solved": [{}]}, {**fresh(), "escaped": True}]:
            self.assertFalse(validate(data))

    def test_rotation_and_save_restore(self):
        state = None
        for cycle in range(4):
            seen = set()
            for round_number in range(4):
                state = fresh('en', state)
                chosen = set(state['selection'].values())
                self.assertTrue(seen.isdisjoint(chosen))
                seen.update(chosen)
                self.assertEqual(restore(state), state)
            self.assertEqual(len(seen), 12)


if __name__ == "__main__":
    unittest.main()
