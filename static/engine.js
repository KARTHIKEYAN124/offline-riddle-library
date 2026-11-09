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
  },
  "bookmark": {
    "en": {
      "q": "I sleep between pages and remember where you stopped, although I cannot read. What am I?",
      "answers": [
        "bookmark",
        "a bookmark"
      ],
      "hints": [
        "I belong in a book.",
        "I mark a place.",
        "I save your reading position."
      ]
    },
    "de": {
      "q": "Ich schlafe zwischen Seiten und merke mir, wo du aufgehört hast, obwohl ich nicht lesen kann. Was bin ich?",
      "answers": [
        "lesezeichen",
        "ein lesezeichen"
      ],
      "hints": [
        "Ich gehöre in ein Buch.",
        "Ich markiere eine Stelle.",
        "Ich bewahre deine Leseposition."
      ]
    }
  },
  "dictionary": {
    "en": {
      "q": "Ask me about a word and I explain it. My answers are arranged from A to Z. What am I?",
      "answers": [
        "dictionary",
        "a dictionary"
      ],
      "hints": [
        "I am a reference book.",
        "I explain meanings.",
        "Look up a word in me."
      ]
    },
    "de": {
      "q": "Frage mich nach einem Wort und ich erkläre es. Meine Antworten sind von A bis Z geordnet. Was bin ich?",
      "answers": [
        "wörterbuch",
        "woerterbuch",
        "ein wörterbuch"
      ],
      "hints": [
        "Ich bin ein Nachschlagewerk.",
        "Ich erkläre Bedeutungen.",
        "Schlage ein Wort in mir nach."
      ]
    }
  },
  "shelves": {
    "en": {
      "q": "Three shelves each hold four books. You borrow two books from each shelf. How many books remain altogether?",
      "answers": [
        "6",
        "six"
      ],
      "hints": [
        "Count all books first.",
        "Twelve books minus the borrowed books.",
        "You borrow six books."
      ]
    },
    "de": {
      "q": "Drei Regale tragen jeweils vier Bücher. Du leihst aus jedem Regal zwei Bücher aus. Wie viele Bücher bleiben insgesamt?",
      "answers": [
        "6",
        "sechs"
      ],
      "hints": [
        "Zähle zuerst alle Bücher.",
        "Zwölf Bücher minus die ausgeliehenen.",
        "Du leihst sechs Bücher aus."
      ]
    }
  },
  "page": {
    "en": {
      "q": "A bookmark is on page 24. Move it forward seven pages, then back four. Which page is it on?",
      "answers": [
        "27",
        "twenty seven",
        "twenty-seven",
        "page 27"
      ],
      "hints": [
        "Start at 24.",
        "Moving forward adds; moving back subtracts.",
        "Calculate 24 + 7 − 4."
      ]
    },
    "de": {
      "q": "Ein Lesezeichen liegt auf Seite 24. Schiebe es sieben Seiten vor und dann vier zurück. Auf welcher Seite liegt es?",
      "answers": [
        "27",
        "siebenundzwanzig",
        "seite 27"
      ],
      "hints": [
        "Beginne bei 24.",
        "Vorwärts addiert, rückwärts subtrahiert.",
        "Rechne 24 + 7 − 4."
      ]
    }
  },
  "chairs": {
    "en": {
      "q": "Four square tables each have four chairs. Two chairs break, and three new chairs arrive. How many usable chairs are there?",
      "answers": [
        "17",
        "seventeen"
      ],
      "hints": [
        "Start with the chairs at all four tables.",
        "There are sixteen before any changes.",
        "Calculate 16 − 2 + 3."
      ]
    },
    "de": {
      "q": "Vier quadratische Tische haben jeweils vier Stühle. Zwei Stühle gehen kaputt, drei neue kommen hinzu. Wie viele nutzbare Stühle gibt es?",
      "answers": [
        "17",
        "siebzehn"
      ],
      "hints": [
        "Beginne mit allen Stühlen an den vier Tischen.",
        "Vor den Änderungen sind es sechzehn.",
        "Rechne 16 − 2 + 3."
      ]
    }
  },
  "sequence": {
    "en": {
      "q": "The shelf labels read 2, 5, 8, 11. What number belongs on the next shelf?",
      "answers": [
        "14",
        "fourteen"
      ],
      "hints": [
        "Compare neighboring labels.",
        "The increase is always the same.",
        "Add three to eleven."
      ]
    },
    "de": {
      "q": "Die Regalschilder lauten 2, 5, 8, 11. Welche Zahl gehört auf das nächste Regal?",
      "answers": [
        "14",
        "vierzehn"
      ],
      "hints": [
        "Vergleiche benachbarte Schilder.",
        "Der Abstand ist immer gleich.",
        "Addiere drei zu elf."
      ]
    }
  },
  "drawer": {
    "en": {
      "q": "A drawer code is a two-digit number. Its digits add up to nine, and the first digit is twice the second. What is the code?",
      "answers": [
        "63",
        "sixty three",
        "sixty-three"
      ],
      "hints": [
        "Let the second digit be x.",
        "Then the first digit is 2x, so 3x = 9.",
        "The second digit is three."
      ]
    },
    "de": {
      "q": "Ein Schubladencode ist zweistellig. Die Ziffernsumme ist neun, die erste Ziffer ist doppelt so groß wie die zweite. Wie lautet der Code?",
      "answers": [
        "63",
        "dreiundsechzig"
      ],
      "hints": [
        "Nenne die zweite Ziffer x.",
        "Dann ist die erste 2x, also gilt 3x = 9.",
        "Die zweite Ziffer ist drei."
      ]
    }
  },
  "ink": {
    "en": {
      "q": "A bottle holds 50 milliliters of ink. Each letter uses 5 milliliters. After writing six letters, how much ink remains? Answer in milliliters.",
      "answers": [
        "20",
        "twenty",
        "20 ml",
        "20 milliliters"
      ],
      "hints": [
        "Find the ink used by six letters.",
        "Six times five is thirty.",
        "Subtract thirty from fifty."
      ]
    },
    "de": {
      "q": "Eine Flasche enthält 50 Milliliter Tinte. Jeder Brief braucht 5 Milliliter. Wie viel Tinte bleibt nach sechs Briefen? Antworte in Millilitern.",
      "answers": [
        "20",
        "zwanzig",
        "20 ml",
        "20 milliliter"
      ],
      "hints": [
        "Berechne die Tinte für sechs Briefe.",
        "Sechs mal fünf ist dreißig.",
        "Ziehe dreißig von fünfzig ab."
      ]
    }
  },
  "order": {
    "en": {
      "q": "The red book is left of the blue book. The green book is right of the blue book. There are only these three books. Which color is in the middle?",
      "answers": [
        "blue",
        "blue book",
        "the blue book"
      ],
      "hints": [
        "Arrange the books in a row.",
        "Red comes first and green comes last.",
        "Which color lies between red and green?"
      ]
    },
    "de": {
      "q": "Das rote Buch steht links vom blauen. Das grüne steht rechts vom blauen. Es gibt nur diese drei Bücher. Welche Farbe steht in der Mitte?",
      "answers": [
        "blau",
        "das blaue buch",
        "blaues buch"
      ],
      "hints": [
        "Ordne die Bücher in einer Reihe.",
        "Rot steht zuerst und Grün zuletzt.",
        "Welche Farbe liegt zwischen Rot und Grün?"
      ]
    }
  }
};
  const ids=['desk','bookshelf','painting'], objects=[...ids,'clock','chest'], bank=Object.keys(puzzles);
  const digits={desk:'4',bookshelf:'7',painting:'2'};
  function shuffled(values){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
  function fresh(previous=null){
    let remaining=previous?.version===2?[...previous.remaining]:[];
    const last=previous?.selection?Object.values(previous.selection):previous?ids:[];
    if(remaining.length<3)remaining=[...shuffled(bank.filter(x=>!last.includes(x))),...shuffled(last)];
    const chosen=remaining.splice(0,3);
    return {version:2,lang:previous?.lang||'en',active:'desk',solved:[],hints:{desk:0,bookshelf:0,painting:0},attempts:0,escaped:false,selection:Object.fromEntries(ids.map((id,i)=>[id,chosen[i]])),remaining};
  }
  const selected=(s,id)=>puzzles[s.version===2?s.selection[id]:id];
  const normalize=s=>s.normalize('NFKC').toLocaleLowerCase().replace(/[.,!?;:]/g,'').trim().replace(/\s+/g,' ');
  function valid(s){
    if(!s||![1,2].includes(s.version)||!['en','de'].includes(s.lang)||!objects.includes(s.active)||!Array.isArray(s.solved)||new Set(s.solved).size!==s.solved.length||!s.solved.every(x=>ids.includes(x))||!s.hints||!ids.every(x=>Number.isInteger(s.hints[x])&&s.hints[x]>=0&&s.hints[x]<=3)||!Number.isInteger(s.attempts)||s.attempts<0||typeof s.escaped!=='boolean'||(s.escaped&&s.solved.length!==3))return false;
    if(s.version===1)return true;
    if(!s.selection||!ids.every(x=>bank.includes(s.selection[x])))return false;
    const chosen=ids.map(x=>s.selection[x]);
    return new Set(chosen).size===3&&Array.isArray(s.remaining)&&new Set(s.remaining).size===s.remaining.length&&s.remaining.every(x=>bank.includes(x)&&!chosen.includes(x));
  }
  function restore(s){if(!valid(s))throw Error('Invalid save');const copy=JSON.parse(JSON.stringify(s));if(copy.version===1){copy.version=2;copy.selection=Object.fromEntries(ids.map(id=>[id,id]));copy.remaining=shuffled(bank.filter(x=>!ids.includes(x)));}return copy;}
  function answer(s,value){if(!ids.includes(s.active)||s.escaped)return 'invalid';if(s.solved.includes(s.active))return 'already';if(!normalize(value))return 'empty';s.attempts++;if(!selected(s,s.active)[s.lang].answers.includes(normalize(value)))return 'wrong';s.solved.push(s.active);return 'correct';}
  function hint(s){if(!ids.includes(s.active)||s.escaped||s.solved.includes(s.active))return false;if(s.hints[s.active]>=3)return false;s.hints[s.active]++;return true;}
  function unlock(s,code){if(s.solved.length!==3)return 'locked';if(code.trim()!==ids.map(x=>digits[x]).join(''))return 'wrongCode';s.escaped=true;return 'escaped';}
  const api={puzzles,ids,objects,bank,digits,selected,fresh,valid,restore,normalize,answer,hint,unlock};
  if(typeof module!=='undefined')module.exports=api;else root.Game=api;
})(globalThis);
