# The Riddle Library / Die Rätselbibliothek

## Streamlit edition

```powershell
python -m pip install -r requirements.txt
python -m streamlit run streamlit_app.py
```

Or double-click `start_streamlit.bat` after installing dependencies. Open http://localhost:8501. This edition uses native Streamlit widgets and server-side Python rules. English/German, optional hints, validated JSON import/export and restart are supported. Progress persists during the Streamlit session; export a JSON save before refreshing or closing the browser. The original static edition below still supports browser auto-save.

### Deploy on Streamlit Community Cloud

1. Put this project in a GitHub repository, including `streamlit_app.py`, `game.py`, `content.json`, `requirements.txt` and `.streamlit/config.toml`.
2. Sign in at https://share.streamlit.io and choose **Create app**.
3. Select the repository and branch, and set the main file path to `streamlit_app.py`.
4. Choose Python 3.13 in advanced settings and deploy. No secrets or API keys are required.

Cloud hosting needs internet access to reach the app. The game itself uses no AI or external API; local Streamlit remains playable without internet once dependencies are installed. Each visitor has their own session state.

Run Streamlit interaction tests with `python -m unittest discover -s tests -p "test_*.py"`.

A complete offline escape-room riddle game in English and German. No Gemini, AI model, API key, package installation, CDN, or internet connection is required.

## Run

Install Python 3.10 or newer, then run from this folder:

```powershell
python app.py
```

Open **http://127.0.0.1:8000** in your browser. Keep the terminal running while playing. Stop with Ctrl+C. If port 8000 is busy, use `python app.py --port 8001` and open the corresponding address.

## Play

Explore five objects using the navigation. Solve the desk, bookshelf and painting riddles to collect three digits. The clock explains their order. Select the chest and enter the three-digit code to escape. Answers ignore capitalization, extra whitespace and common punctuation. Accepted answers follow the currently selected language.

Each riddle offers three optional progressive hints. Previously revealed hints remain visible. Switch English/Deutsch at any time without losing progress. There is no timer or hint penalty.

Progress automatically saves to this browser on this local address. Continue by returning to the same address with the same browser profile. Export save downloads a JSON backup; Import save validates and restores it. Damaged saves leave your current game intact. Restart asks before clearing progress. Browsers with storage disabled can still play and export saves. Changing ports uses a separate browser storage location.

## Files and architecture

```text
Browser UI (index.html + style.css + ui.js)
    → deterministic rules and bilingual riddles (engine.js)
    → browser localStorage / exported JSON save
Python standard-library server → serves local static files on 127.0.0.1
```

The project implements the improved version described in `.txt`, including structured state, validated actions, language switching and save/resume. Browser storage replaces the proposed automatic local JSON file to keep installation dependency-free; JSON files are available through export/import. All visual styling uses local CSS and system fonts. This is a local single-player game: someone inspecting the JavaScript can see the answers. It is not designed to resist source-code editing or forged saves.

## Verify

With Node.js 18+ available (needed only for these tests):

```powershell
node --test tests/engine.test.js
```

Tests cover malformed state, incorrect/empty answers, duplicate rewards, progressive hints, language changes, early unlock prevention, both language completion paths, and save roundtrips. For a manual offline check, disconnect the network, launch the local server, solve a riddle, request a hint, switch language, refresh, export/import a save and finish the game. No outgoing requests are used.
