/* Deterministic game rules; no model, API, or network requests. */
(function(root) {
  const puzzles = {
  "desk": {
    "digit": "4",
    "en": {
      "q": "My keys make music, yet none can turn a lock. Name the instrument.",
      "answers": [
        "piano",
        "a piano",
        "grand piano",
        "a grand piano"
      ],
      "hints": [
        "Think of an instrument.",
        "Its keys are black and white.",
        "A pianist plays it."
      ]
    },
    "de": {
      "q": "Meine Tasten machen Musik, doch keine öffnet ein Schloss. Welches Instrument bin ich?",
      "answers": [
        "klavier",
        "ein klavier",
        "piano",
        "flügel",
        "fluegel",
        "ein flügel"
      ],
      "hints": [
        "Denke an ein Instrument.",
        "Seine Tasten sind schwarz und weiß.",
        "Ein Pianist spielt darauf."
      ]
    }
  },
  "bookshelf": {
    "digit": "7",
    "en": {
      "q": "With every step forward, more of these remain behind you. What are they?",
      "answers": [
        "footsteps",
        "steps",
        "footprints"
      ],
      "hints": [
        "Think of a journey on foot.",
        "Look behind you in the sand.",
        "Each step leaves one behind."
      ]
    },
    "de": {
      "q": "Mit jedem Schritt nach vorn bleiben mehr davon hinter dir. Was ist gemeint?",
      "answers": [
        "schritte",
        "fußspuren",
        "fussspuren",
        "fuss spuren"
      ],
      "hints": [
        "Denke an einen Weg zu Fuß.",
        "Schau hinter dich in den Sand.",
        "Jeder Schritt hinterlässt eine Spur."
      ]
    }
  },
  "painting": {
    "digit": "2",
    "en": {
      "q": "My cities contain no actual buildings, and my mountains have no living trees. What am I?",
      "answers": [
        "map",
        "a map",
        "atlas"
      ],
      "hints": [
        "I help you find your way.",
        "I represent places on paper.",
        "Travelers unfold me to plan a route."
      ]
    },
    "de": {
      "q": "Meine Städte enthalten keine echten Gebäude, und auf meinen Bergen wachsen keine lebenden Bäume. Was bin ich?",
      "answers": [
        "karte",
        "landkarte",
        "eine karte",
        "eine landkarte",
        "atlas"
      ],
      "hints": [
        "Ich helfe dir, den Weg zu finden.",
        "Ich zeige Orte auf Papier.",
        "Reisende falten mich auf, um eine Route zu planen."
      ]
    }
  }
};
  const ids=Object.keys(puzzles), objects=[...ids,'clock','chest'];
  const fresh=()=>({version:1,lang:'en',active:'desk',solved:[],hints:{desk:0,bookshelf:0,painting:0},attempts:0,escaped:false});
  const normalize=s=>s.normalize('NFKC').toLocaleLowerCase().replace(/[.,!?;:]/g,'').trim().replace(/\s+/g,' ');
  function valid(s){return !!s && s.version===1 && ['en','de'].includes(s.lang) && objects.includes(s.active) && Array.isArray(s.solved) && new Set(s.solved).size===s.solved.length && s.solved.every(x=>ids.includes(x)) && s.hints && ids.every(x=>Number.isInteger(s.hints[x])&&s.hints[x]>=0&&s.hints[x]<=3) && Number.isInteger(s.attempts)&&s.attempts>=0 && typeof s.escaped==='boolean' && (!s.escaped||s.solved.length===3);}
  function answer(s,value){if(!puzzles[s.active]||s.escaped)return 'invalid';if(s.solved.includes(s.active))return 'already';if(!normalize(value))return 'empty';s.attempts++;if(!puzzles[s.active][s.lang].answers.includes(normalize(value)))return 'wrong';s.solved.push(s.active);return 'correct';}
  function hint(s){if(!puzzles[s.active]||s.escaped||s.solved.includes(s.active))return false;if(s.hints[s.active]>=3)return false;s.hints[s.active]++;return true;}
  function unlock(s,code){if(s.solved.length!==3)return 'locked';if(code.trim()!==ids.map(x=>puzzles[x].digit).join(''))return 'wrongCode';s.escaped=true;return 'escaped';}
  const api={puzzles,ids,objects,fresh,valid,normalize,answer,hint,unlock};
  if(typeof module!=='undefined')module.exports=api;else root.Game=api;
})(globalThis);
