/* Deterministic game rules; no model, API, or network requests. */
(function(root) {
  const puzzles = {
    desk: {digit:'4', en:{q:'I have keys, but open no locks. I have space, but no room. You can enter, but cannot go inside. What am I?',answers:['keyboard','a keyboard','computer keyboard'],hints:['You use me with a computer.','My space is a bar.','Look at what you type on.']},de:{q:'Ich habe Tasten, aber keine Schlösser. Ich habe eine Leertaste, aber keinen leeren Raum. Du kannst Enter drücken, aber nicht hineingehen. Was bin ich?',answers:['tastatur','eine tastatur','computertastatur'],hints:['Du benutzt mich mit einem Computer.','Meine Tasten enthalten Buchstaben.','Du tippst auf mir.']}},
    bookshelf:{digit:'7',en:{q:'The more you take, the more you leave behind. What are they?',answers:['footsteps','steps','footprints'],hints:['Think of a journey on foot.','Look behind you in the sand.','Each step leaves one behind.']},de:{q:'Je mehr du machst, desto mehr lässt du hinter dir. Was ist gemeint?',answers:['schritte','fußspuren','fussspuren','fuss spuren'],hints:['Denke an einen Weg zu Fuß.','Schau hinter dich in den Sand.','Jeder Schritt hinterlässt eine Spur.']}},
    painting:{digit:'2',en:{q:'I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?',answers:['map','a map','atlas'],hints:['I help you find your way.','I represent places on paper.','Travelers unfold me to plan a route.']},de:{q:'Ich habe Städte, aber keine Häuser; Wälder, aber keine Bäume; und Wasser, aber keine Fische. Was bin ich?',answers:['karte','landkarte','eine karte','eine landkarte','atlas'],hints:['Ich helfe dir, den Weg zu finden.','Ich zeige Orte auf Papier.','Reisende falten mich auf, um eine Route zu planen.']}}
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
