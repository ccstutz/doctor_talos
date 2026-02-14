/**
 * Doctor Talos's Traveling Show — CYOA Engine
 * "The Play of the Sun's Last Day"
 *
 * Features:
 * - ~15 story nodes with branching paths
 * - Sun brightness meter & sanity meter
 * - Visual effects tied to meter values
 * - localStorage persistence for death count & returning player detection
 * - 5+ endings including a secret "true ending"
 * - Text distortion at low sanity
 */
(function () {
  // --- State ---
  var state = {
    sun: 100,
    sanity: 100,
    node: 'start',
    deaths: parseInt(localStorage.getItem('talos_deaths') || '0', 10),
    playthroughs: parseInt(localStorage.getItem('talos_playthroughs') || '0', 10),
    foundScript: false
  };

  // --- Story Nodes ---
  var story = {
    start: {
      text: function () {
        if (state.playthroughs > 0) {
          return [
            'The tent flap opens. You step inside, and the smell of dust and tallow fills your nostrils. The interior is larger than the outside suggested — impossibly so.',
            'Doctor Talos stands at center stage, his eyes catching the lantern light. He pauses mid-gesture and stares directly at you.',
            '"Ah," he says, and something in his voice is different now. Colder. More knowing. "You\'ve returned. I remember you, wanderer. I remember <em>all</em> of your ' + state.deaths + ' deaths. The stage remembers what the audience forgets."',
            'He sweeps his arm wide. "Shall we try again? The play is the same. But perhaps — <em>perhaps</em> — you are not."'
          ];
        }
        return [
          'You have been walking for what feels like years. The road — if it can be called a road — winds through a landscape of rust-colored grass beneath a sun that hangs too large and too red in a sky the color of a bruise.',
          'Ahead, improbably, a tent. Silk panels of burgundy and gold, patched and repatched, flutter in a wind that carries the scent of machine oil and old paper. A hand-painted sign reads:',
          '<strong style="text-align:center;display:block;font-size:1.1em;letter-spacing:0.1em;">DOCTOR TALOS\'S TRAVELING SHOW<br>&amp; THERAPEUTIC EXHIBITION<br><em>— Performances Nightly —</em></strong>',
          'A figure emerges from the tent flap. He is tall, angular, dressed in a coat that was once magnificent. His smile is the smile of a man who has rehearsed it.',
          '"Welcome, wanderer! You arrive precisely on cue. The play is about to begin, and we find ourselves short one hero. Interested?"'
        ];
      },
      choices: [
        { text: 'Enter the tent and join the show', next: 'join_troupe' },
        { text: '"I\'m just passing through."', next: 'refuse_troupe' },
        { text: 'Peer behind the tent at something glinting in the dust', next: 'find_script', condition: function () { return state.playthroughs >= 2; } }
      ]
    },

    join_troupe: {
      text: [
        'You step through the tent flap, and the world changes.',
        'The interior is a theater — a real theater, with tiered seats carved from something that might be stone or might be bone, and a stage lit by lanterns that burn with a light too steady to be flame. The seats are mostly empty, though here and there you glimpse figures in the shadows. Whether they are audience or scenery, you cannot tell.',
        'Doctor Talos claps his hands. "Excellent! Every play needs a protagonist who doesn\'t know they\'re in one. It\'s more authentic that way."',
        'He gestures to the stage. "The play is called <em>The Sun\'s Last Day</em>. You need not memorize your lines — you won\'t have any. Simply... react. The sun—" he points upward, where a great glowing orb hangs above the stage, "—is dying. As it does in life. Your role is to decide what to do about it."',
        'The orb above flickers. Was that part of the show?'
      ],
      choices: [
        { text: '"What happens when the sun goes out?"', next: 'ask_about_sun' },
        { text: 'Step onto the stage without further questions', next: 'take_stage' },
        { text: '"Who are the others in the audience?"', next: 'ask_audience' }
      ],
      effects: { sun: -5 }
    },

    refuse_troupe: {
      text: [
        '"Just passing through," you say, and you mean it. You have places to be. Probably.',
        'Doctor Talos\'s smile does not waver. "Of course, of course. Everyone is just passing through. That\'s rather the point of a dying universe — everything is in transit toward nothing."',
        'He steps aside with a theatrical bow. "But consider: the road ahead is long, and the sun—" he glances up at the swollen red disc "—is not getting any younger. We offer warmth. Light. A story to carry with you into the dark."',
        'Behind him, you hear music from inside the tent. Something played on strings that sounds like it remembers a melody from before the world got old.',
        'The road stretches on. Empty. Red. Patient.'
      ],
      choices: [
        { text: 'Keep walking into the dying light', next: 'walk_away' },
        { text: 'Turn back — enter the tent after all', next: 'join_troupe' }
      ],
      effects: { sanity: -5 }
    },

    walk_away: {
      text: [
        'You walk. The tent shrinks behind you. The music fades.',
        'The road goes on. The sun sinks lower — or does it grow larger? It is hard to tell. The grass at the roadside has turned from rust to ash. There are no birds. There is no wind now.',
        'Hours pass. Or days. Time has become unreliable.',
        'You come to a crossroads marked by a stone that bears no inscription. Beyond it, the road splits: one path leads toward the sun, which now fills half the horizon like a wound. The other descends into a valley where the shadows are absolute.',
        'You realize, with a certainty that bypasses thought entirely, that you have always been walking toward this crossroads. That the tent, the Doctor, the show — they were all intermissions.'
      ],
      choices: [
        { text: 'Walk toward the dying sun', next: 'ending_sun_walk' },
        { text: 'Descend into the dark valley', next: 'ending_dark_walk' }
      ],
      effects: { sun: -20, sanity: -10 }
    },

    ask_about_sun: {
      text: [
        'Doctor Talos tilts his head, as if the question amuses him.',
        '"What happens? My dear wanderer, what happens when <em>any</em> light goes out? The audience sits in darkness. The actors stumble. Someone knocks over a prop." He pauses. "And then, if the players are good — truly good — they continue the performance by feel. By memory. By the sheer stubborn insistence that the show matters even when no one can see it."',
        'He leans closer. His breath smells of copper.',
        '"But between you and me? I don\'t actually know. I\'ve never let it go out. <em>Something</em> has always intervened. Call it luck. Call it narrative necessity."',
        'The orb above the stage gutters again. This time, the shadows in the theater seem to lean forward.'
      ],
      choices: [
        { text: 'Step onto the stage', next: 'take_stage' },
        { text: '"Can the sun be saved?"', next: 'ask_save_sun' }
      ],
      effects: { sun: -5 }
    },

    ask_audience: {
      text: [
        'You squint into the shadows of the tiered seating. The figures are still. Too still.',
        '"Them?" Doctor Talos waves a dismissive hand. "Previous audience members. They elected to stay. The show can be... absorbing."',
        'One of the figures turns its head toward you. In the lantern light, its eyes are dark and glossy, like stones at the bottom of a well.',
        '"Don\'t worry," Talos says brightly. "Most of them are quite friendly. And the ones who aren\'t are at least quiet."',
        'You notice that the seated figures are mouthing words. All of them. The same words, in unison, though no sound emerges. It looks like: <em>the sun, the sun, the sun.</em>'
      ],
      choices: [
        { text: 'Step onto the stage — quickly, before you change your mind', next: 'take_stage' },
        { text: 'Try to speak to the silent audience', next: 'speak_to_audience' }
      ],
      effects: { sanity: -10 }
    },

    speak_to_audience: {
      text: [
        'You approach the nearest figure. Up close, it is a woman in a faded blue dress. Her skin has the texture of old paper. Her lips move ceaselessly.',
        '"Hello?" you say.',
        'She stops. Her eyes focus on you — <em>through</em> you — and she smiles.',
        '"You\'re in the wrong act," she whispers. "This scene was cut. Go back to the stage."',
        'Her lips resume their silent recitation. The other figures turn away, as if you have committed a social error so profound it cannot be acknowledged.',
        'Doctor Talos is behind you. You did not hear him approach. "I did mention they were previous audience members," he says gently. "I did not say they were previous <em>people</em>."'
      ],
      choices: [
        { text: 'Get on the stage now', next: 'take_stage' }
      ],
      effects: { sanity: -15 }
    },

    ask_save_sun: {
      text: [
        '"Saved?" Talos strokes his chin. "An interesting verb. It implies the sun is in danger, rather than simply old. Can you save an old man from being old? Can you save a candle from being burnt?"',
        'He paces. "There are stories — the old scripts, from before my time — that speak of a New Sun. A white sun to replace the red one. But to bring a new sun, one must first let the old one die. A playwright\'s trick: you cannot have a third act without ending the second."',
        'He fixes you with a look that, for the first time, seems entirely serious.',
        '"The question is not whether the sun can be saved. The question is whether you would sacrifice <em>this</em> sun — everything under it, everyone who has lived by its light — for the <em>possibility</em> of a new one."'
      ],
      choices: [
        { text: 'Step onto the stage with this weight on your mind', next: 'take_stage' }
      ],
      effects: { sun: -5, sanity: -5 }
    },

    take_stage: {
      text: [
        'You step onto the stage. The boards creak. The lanterns dim and then blaze brighter, and you realize the light is coming from the orb above — the stage sun — which pulses like a heartbeat.',
        'The theater falls silent. Even the mouthing figures in the seats have stopped.',
        'Before you, the stage is set: a painted backdrop of a city, crumbling towers silhouetted against a sky that is more black than red. In the center stands a pedestal, and on it rests two objects — a copper mirror and a dark glass lens.',
        'Doctor Talos\'s voice booms from somewhere unseen: "THE HERO ARRIVES AT THE CITY OF THE SUN. THE CITY IS DYING. THE SUN IS DYING. THE HERO MUST CHOOSE AN INSTRUMENT."',
        'The mirror catches the light of the stage-sun and throws it back as gold. The lens seems to drink the light, its surface swirling with deep colors.'
      ],
      choices: [
        { text: 'Take the copper mirror — a thing that reflects and preserves light', next: 'choose_mirror' },
        { text: 'Take the dark glass lens — a thing that transforms light', next: 'choose_lens' },
        { text: 'Take neither — refuse to play your part', next: 'refuse_instrument' }
      ]
    },

    choose_mirror: {
      text: [
        'You take the mirror. It is warm in your hand, and your reflection in its surface looks... older. Wiser, perhaps, but tired.',
        'The stage-sun flares. Doctor Talos\'s voice: "THE HERO CHOOSES TO PRESERVE. TO HOLD THE LIGHT AS IT IS. A CONSERVATIVE CHOICE. A HUMAN CHOICE."',
        'The backdrop shifts — painted panels sliding on hidden tracks — and now you stand in a street of the dying city. Paper lanterns hang from wires overhead, each one a tiny imitation sun. People move through the street like sleepwalkers.',
        'A child tugs at your sleeve. "Are you the one they sent? The one who\'s going to fix it?"',
        'Fix what? Fix the sun? Fix the city? Fix the fundamental thermodynamic decay of a universe that has been running down since before language existed to describe the process?',
        'The child\'s eyes are wide. Trusting. The mirror grows warmer in your hand.'
      ],
      choices: [
        { text: 'Try to use the mirror to reflect sunlight and brighten the city', next: 'mirror_reflect' },
        { text: '"I can\'t fix it. But I can stay."', next: 'mirror_stay' }
      ],
      effects: { sun: -10 }
    },

    choose_lens: {
      text: [
        'You take the dark glass lens. It is cold, and when you look through it, the world changes: the crumbling backdrop becomes <em>real</em>. The painted city is an actual city, vast and ancient, its towers carved from stone that remembers being mountains.',
        'Doctor Talos\'s voice: "THE HERO CHOOSES TO TRANSFORM. TO SEE DIFFERENTLY. A DANGEROUS CHOICE. A NECESSARY ONE."',
        'Through the lens, you see the stage-sun for what it really is: not a prop, but a seed. A compressed star, held in stasis by mechanisms older than the theater, older than the Doctor, older than the concept of performance.',
        'And you see something else. Behind the sun, hidden by its light, a dark machine. Gears of shadow. A device that is simultaneously keeping the sun alive and draining it.',
        'The Doctor\'s voice drops to a whisper: "You weren\'t supposed to see that."'
      ],
      choices: [
        { text: 'Approach the dark machine behind the sun', next: 'approach_machine' },
        { text: 'Confront Doctor Talos about what you\'ve seen', next: 'confront_talos' }
      ],
      effects: { sanity: -10 }
    },

    refuse_instrument: {
      text: [
        'You step back from the pedestal. "No."',
        'Silence. Then, a sound like tearing paper — the backdrop rips, revealing nothing behind it. Not darkness, not a wall. <em>Nothing.</em> An absence so complete it makes your eyes water.',
        'Doctor Talos appears at the edge of the stage, and for the first time, he is not smiling.',
        '"You refuse to play?" His voice is flat. "The sun is dying. The play requires a hero. Without a hero, there is no third act, and without a third act—"',
        'The orb above flickers violently. The nothing behind the torn backdrop begins to spread.',
        '"—there is no ending. And a story without an ending is the most dangerous thing in the universe. It just goes on. And on. And <em>on</em>. Do you understand? You must choose. Even choosing wrong is better than not choosing at all."'
      ],
      choices: [
        { text: 'Relent — take the copper mirror', next: 'choose_mirror' },
        { text: 'Relent — take the dark glass lens', next: 'choose_lens' },
        { text: 'Continue to refuse. Walk into the nothing.', next: 'ending_nothing' }
      ],
      effects: { sun: -15, sanity: -15 }
    },

    mirror_reflect: {
      text: [
        'You raise the mirror above your head. The dying light of the stage-sun catches its surface, and for a moment — one brilliant, impossible moment — the copper mirror blazes like a second sun.',
        'The street is flooded with golden light. The sleepwalkers blink, shielding their eyes. The child laughs. Somewhere, a bell rings.',
        'Then the mirror cracks. A single fracture, running from edge to edge, and the light splits into something sharp and wrong. The reflected sun is too bright, too hot. Paint blisters on the backdrop. The child\'s laughter turns to a cry.',
        '"TOO MUCH," booms Talos\'s voice, though now it sounds strained. "THE HERO LEARNS THAT PRESERVATION, TAKEN TO ITS EXTREME, BECOMES DESTRUCTION."',
        'The mirror shatters. The street goes dark. But in the darkness, you hear breathing — yours, the child\'s, the city\'s — and you realize the sun has not gone out. It has simply dimmed to its previous state. Dying, but not dead. Not yet.'
      ],
      choices: [
        { text: 'Gather the mirror shards and try to piece them together', next: 'ending_mended_sun' },
        { text: 'Let the shards fall. Accept the dimming light.', next: 'ending_acceptance' }
      ],
      effects: { sun: -20, sanity: -5 }
    },

    mirror_stay: {
      text: [
        'The child stares at you. The mirror hangs at your side, reflecting nothing but the street and its tired lanterns.',
        '"You\'ll stay?" the child says. "Even though it\'s ending?"',
        '"Especially because it\'s ending."',
        'The stage-sun gutters. The paper lanterns dim to embers. Around you, the sleepwalkers slow, then stop, then turn to face the failing light with expressions that are not fear but something older. Reverence, perhaps. Or recognition.',
        'Doctor Talos\'s voice is soft now, almost gentle: "THE HERO CHOOSES NOT TO FIX, NOT TO FIGHT. THE HERO CHOOSES TO WITNESS. AND IN WITNESSING, TO GIVE THE DYING LIGHT AN AUDIENCE."',
        'The child takes your hand. The city breathes its last painted breath. And the sun — the old, tired, beautiful sun — goes out quietly, in the company of someone who chose to watch.'
      ],
      choices: [
        { text: 'Sit with the child in the gentle dark', next: 'ending_witness' }
      ],
      effects: { sun: -30 }
    },

    approach_machine: {
      text: [
        'Through the dark glass lens, you walk toward the hidden machine. The closer you get, the louder the sound — a grinding, arrhythmic heartbeat, like gears that have been turning since before the concept of time was formalized.',
        'The machine is vast. It extends above and below the stage, into spaces that shouldn\'t exist. Its gears are made of something that is not metal — something that absorbs light and exudes cold. At its center, a single lever.',
        'You understand now. The machine is a paradox engine. It keeps the sun alive by feeding on it. Remove the machine, and the sun dies instantly. Leave it, and the sun dies slowly, its light channeled into the machine\'s incomprehensible purpose.',
        'But there is a third option. The lever. It\'s labeled, in handwriting you recognize as the Doctor\'s: <em>"REVERSE."</em>',
        'Reverse the machine. Feed the light back. But what happens to the machine? What happens to the theater? What happens to the Doctor?'
      ],
      choices: [
        { text: 'Pull the lever — reverse the machine', next: 'ending_new_sun' },
        { text: 'Destroy the machine entirely', next: 'ending_instant_dark' },
        { text: 'Leave the machine alone and walk away', next: 'ending_acceptance' }
      ],
      effects: { sanity: -10, sun: -10 }
    },

    confront_talos: {
      text: [
        '"You\'re a fraud," you say, and your voice echoes through the theater in a way that voices shouldn\'t. "This isn\'t a play. The sun — the real sun — is dying, and this machine of yours is—"',
        'Doctor Talos appears. He is not smiling. He is not frowning. His face is the face of someone who has been caught and is deciding whether to be ashamed or relieved.',
        '"A fraud? Yes, obviously. I have never claimed otherwise. But consider:" he raises one long finger, "every physician is a fraud until the patient recovers. Every playwright is a fraud until the audience weeps. I am a fraud who has kept the sun burning for—" he pauses, calculating, "—longer than you\'d believe."',
        '"The machine feeds on the sun. Yes. But without it, the sun would have gone out centuries ago. I am not killing it. I am <em>rationing</em> it. Extending the final act so that—" his voice cracks, "—so that someone might eventually find a better solution than mine."',
        'His eyes meet yours. "Have you? Found a better solution?"'
      ],
      choices: [
        { text: '"Maybe. Show me the machine."', next: 'approach_machine' },
        { text: '"No. But I\'ll help you carry this."', next: 'ending_partnership' },
        { text: '"Your show is over, Doctor."', next: 'betray_talos' }
      ],
      effects: { sanity: -5 }
    },

    betray_talos: {
      text: [
        'Something hardens in you. The lens shows you truth, and the truth is that this man — this <em>charlatan</em> — has been playing god with a dying star.',
        '"Your show is over."',
        'You reach for the lens, but it\'s no longer a lens — in your hand, it has become a blade of dark glass, sharp enough to cut light itself.',
        'Doctor Talos does not run. He does not fight. He stands very still, and when he speaks, his voice is the voice of a man who has rehearsed this scene many times, alone, in the dark.',
        '"If you end me, the machine stops. The sun goes out. Everyone in this theater — everyone the sun still touches — goes with it. You understand this?"',
        '"I know." Your hand is steady.',
        '"Then you understand that you are not the hero of this story. You are the ending."',
        'He closes his eyes.'
      ],
      choices: [
        { text: 'Strike. End the show.', next: 'ending_betrayal' },
        { text: 'Lower the blade. You can\'t do it.', next: 'ending_partnership' }
      ],
      effects: { sun: -15, sanity: -20 }
    },

    find_script: {
      text: [
        'You\'ve been here before. You know the tent, the Doctor, the show. But this time, something catches your eye — a glint in the dust behind the tent, half-buried, as if it\'s been waiting for someone who knows where to look.',
        'You kneel and brush away the dirt. It\'s a manuscript, bound in leather the color of dried blood. The title page reads:',
        '<strong style="text-align:center;display:block;font-size:1.05em;letter-spacing:0.05em;">THE PLAY OF THE SUN\'S LAST DAY<br><em>— The Complete Script —<br>Including All Endings, Revisions & Stage Directions</em></strong>',
        'You open it. The pages are filled with the Doctor\'s handwriting — frantic, dense, annotated in multiple colors of ink. And there, in the margins, notes addressed to <em>you</em>:',
        '"<em>If you are reading this, you have died enough times to look behind the scenery. Good. The play is a trap — my trap — but also a cage I built for myself. There is an ending I wrote but never performed. Page 47. It requires a hero who knows they are in a play, and chooses to rewrite it.</em>"',
        'You turn to page 47.'
      ],
      choices: [
        { text: 'Read page 47 and enter the hidden ending', next: 'ending_rewrite' }
      ],
      effects: function () { state.foundScript = true; }
    },

    // --- ENDINGS ---

    ending_sun_walk: {
      text: [
        'You walk toward the sun.',
        'It fills the world. It fills your vision. It fills the spaces between your thoughts. The heat is not painful — it is simply <em>total</em>, as if you are being translated from matter into light.',
        'In the last moment before you dissolve, you hear music. The same melody from the tent, played on strings that remember. And you understand: the sun is not dying. The sun is <em>performing</em>. Its death is the grandest show of all, and you have walked into the final scene.',
        'There is no pain. There is only light, and the light is warm, and the warmth is a kind of love, and the love is the last thing the universe has to give.'
      ],
      ending: { title: 'The Light Embraces', type: 'Ending I of VI — Communion', restart: true },
      effects: { sun: -100 }
    },

    ending_dark_walk: {
      text: [
        'You descend into the valley. The shadows close overhead like a curtain.',
        'In the dark, you find others. Travelers who chose this path before you. They sit in a circle around a fire that gives no light — a fire of pure warmth, invisible, a memory of flame.',
        '"You came from the show?" one asks. You nod. "We all did. The Doctor sends everyone here eventually. To the place where the audience goes after the final act."',
        'You sit. The warmth is enough. In the dark, without the distraction of sight, you hear the universe as it truly sounds: a low, steady hum, the resonant frequency of everything that has ever existed, singing itself to sleep.',
        'It is not a bad sound. It is not a sad sound. It is simply the sound of a story that has been told completely, with nothing left out.'
      ],
      ending: { title: 'The Dark Audience', type: 'Ending II of VI — Quietus', restart: true },
      effects: { sun: -100 }
    },

    ending_nothing: {
      text: [
        'You walk into the nothing.',
        'There is no transition. No border. One step you are on a stage in a theater under a dying sun, and the next step you are nowhere. Not darkness — darkness is something. This is the absence of the concept of something.',
        'Doctor Talos\'s voice reaches you from impossibly far away: "Please — you don\'t understand — without a hero, the story—"',
        'But you are beyond stories now. Beyond suns and stages and the desperate need of old men to keep performing for empty theaters.',
        'You are free. And freedom, it turns out, looks exactly like nothing at all.',
        '<em>The nothing grows. It swallows the theater. It swallows the sun. It swallows the Doctor and his troupe and the sleeping audience and the dying city and the rusted road and the tent and the sign. It swallows everything, because a story without a hero is a story without a shape, and a story without a shape is just... entropy.</em>',
        '<em>The show, at last, does not go on.</em>'
      ],
      ending: { title: 'No Ending', type: 'Ending III of VI — Nullity', restart: true },
      effects: { sun: -100, sanity: -100 }
    },

    ending_mended_sun: {
      text: [
        'On your knees in the dark, you gather the shards of the copper mirror. They cut your fingers. Your blood, in this light, is the same color as the dying sun.',
        'You press the pieces together. They don\'t fit — they were never meant to be reassembled — but you hold them anyway, and your grip becomes the frame, your blood the solder.',
        'The mended mirror catches something. Not the light of the stage-sun, which is almost gone, but something else — a faint glow from inside the mirror itself, as if the reflections it stored over its lifetime are now leaking out. Sunlight from better days. Light that remembers being young.',
        'It\'s not enough to save the sun. But it\'s enough to illuminate the child\'s face, and the street, and the lanterns. Enough to see by. Enough to keep going.',
        'Doctor Talos\'s voice, barely a whisper: "The hero learns that broken things still shine. That mended light is light enough. This is not the ending I wrote. It is better."',
        'The curtain falls. The applause, when it comes, is the sound of one sun dying and, somewhere, impossibly, another being born.'
      ],
      ending: { title: 'The Mended Sun', type: 'Ending IV of VI — Kintsugi', restart: true },
      effects: { sun: 10 }
    },

    ending_witness: {
      text: [
        'You sit with the child as the sun goes out. It takes a long time — longer than you expected. Dying suns are patient.',
        'The child falls asleep against your shoulder. The city is silent. The paper lanterns are dark. Above, stars emerge that have been waiting behind the sun\'s glare for millennia — and they are beautiful. More beautiful than the sun ever was, because they are unexpected.',
        'Doctor Talos sits beside you. When he arrived, you don\'t know. He is quiet for once. His theatrical voice is gone. He speaks like a person.',
        '"I wrote this ending last," he says. "I didn\'t think anyone would choose it. Who wants to watch something die?"',
        '"Someone has to."',
        '"Yes." He is silent for a while. "Yes, I suppose someone does."',
        'The stars turn overhead. The child sleeps. The show is over, and the two of you sit in the beautiful dark, and neither of you looks away.'
      ],
      ending: { title: 'The Witness', type: 'Ending V of VI — Vigil', restart: true },
      effects: { sun: -100 }
    },

    ending_new_sun: {
      text: [
        'You pull the lever.',
        'The machine screams — a sound like tearing metal and breaking glass and the cry of something that has been running for centuries finally being allowed to stop. The gears reverse. The shadow-metal glows, then whitens, then becomes translucent.',
        'Light pours back. Not into the old sun — the old sun is gone, consumed in the reversal — but into the space where it was. A new light. White, not red. Young, not dying.',
        'The theater shakes. The painted backdrop ignites and burns away, revealing a sky you have never seen — a sky with a white sun in it, small and fierce and impossibly bright.',
        'Doctor Talos staggers. The theater is dissolving around him — his life\'s work, his stage, his home — and he is laughing. Laughing and weeping in equal measure.',
        '"A new sun," he whispers. "I wrote this ending as a joke. I never thought—"',
        'He looks at you. He looks at the white sun. He bows — a real bow, not a theatrical one — and walks offstage for the last time.',
        'The light is warm. The light is new. The show is over. Something else has begun.'
      ],
      ending: { title: 'The New Sun', type: 'Ending VI of VI — Aurora', restart: true },
      effects: { sun: 100 }
    },

    ending_instant_dark: {
      text: [
        'You strike the machine. The dark glass lens shatters against the shadow-gears, and both explode into nothing.',
        'The sun dies. Not slowly, not gracefully. It simply stops. Like a heart. Like a sentence interrupted mid-',
        '',
        '',
        '<em>...there is a pause that lasts either a moment or an eternity...</em>',
        '',
        'You are in the dark. Total dark. The theater is gone. The city is gone. The sun is gone. Only you remain, and the dark, and the sound of your own breathing.',
        'From the dark, Doctor Talos\'s voice, ragged: "This is the ending I feared most. Not because it\'s dark. Because it\'s <em>boring</em>. A quick death with no poetry. No final speech. Just—"',
        'His voice cuts off. You are alone. In the dark. Forever.',
        'This is what the end of everything sounds like: nothing at all.'
      ],
      ending: { title: 'Lights Out', type: 'Ending — Oblivion', restart: true },
      effects: { sun: -100, sanity: -50 }
    },

    ending_acceptance: {
      text: [
        'You step back from the machine. From the mirror. From all of it.',
        'The sun will die on its own schedule. Not today, perhaps. Not tomorrow. But eventually, inevitably, as all suns do. And no mirror or machine or wandering hero will change the fundamental mathematics of entropy.',
        'But the show — the ridiculous, fraudulent, beautiful show — will go on for a little while longer.',
        'You find Doctor Talos in the wings, adjusting a backdrop. "Decided not to play god?" he asks. "Wise choice. Terrible reviews."',
        '"The machine. The sun. Why do you keep going?"',
        'He smiles. It is not his stage smile. It is smaller, and sadder, and more real.',
        '"Because the alternative is sitting in the dark. And I\'ve always preferred to be embarrassed in the light."',
        'You help him with the backdrop. Tomorrow there will be another show. Another audience. Another hero who doesn\'t know they\'re in a play. And the sun — the old, red, tired, beloved sun — will burn a little longer. Not because of machines or mirrors. Because someone is still watching.'
      ],
      ending: { title: 'The Show Goes On', type: 'Ending — Continuance', restart: true },
      effects: {}
    },

    ending_partnership: {
      text: [
        '"I\'ll help you carry this."',
        'Doctor Talos stares at you. For a long, strange moment, his face does something you\'ve never seen it do: it shows genuine surprise.',
        '"You — you want to stay? Not to fix the sun, not to save the world, but to help a charlatan maintain his machine and stage his plays for an audience of somnambulists?"',
        '"Someone has to hold the props."',
        'He laughs. It is the first real laugh you\'ve heard from him — not a performer\'s laugh, not a madman\'s laugh, but the laugh of a very tired person who has just been told they don\'t have to carry the weight alone.',
        '"Then welcome to the troupe," he says, extending his hand. "The pay is nonexistent. The hours are eternal. And the sun — well, the sun does what it wants. But the company—" his voice catches, "—the company is better than I deserve."',
        'You shake his hand. The machine hums. The stage-sun flickers on. And somewhere in the audience, one of the sleeping figures opens its eyes and, for the first time in centuries, smiles.'
      ],
      ending: { title: 'The New Player', type: 'Ending — Fellowship', restart: true },
      effects: { sun: 5, sanity: 10 }
    },

    ending_betrayal: {
      text: [
        'The blade falls. The Doctor falls. The machine stops.',
        'It is faster than you thought. There is no dramatic speech, no final soliloquy. Just a man on a stage, and then a man on the ground, and then a silence so complete that you can hear the sun begin to go out.',
        'The light dims. The theater collapses — not dramatically, but wearily, like a tent whose poles have been pulled. The audience crumbles. The city dissolves. The stars go out one by one, like stagehands extinguishing lanterns.',
        'You are the last thing in the universe. You and the dark glass blade and the memory of a show that once played for an audience of sleepwalkers under a sun that was always dying.',
        'Was it worth it? You ended the fraud. The deception. The grotesque pantomime of a madman pretending he could hold back entropy with pulleys and paint.',
        'The blade dissolves in your hand. The last light goes out.',
        '<em>Was it worth it?</em>',
        'In the dark, no one answers. In the dark, there is no one left to ask.'
      ],
      ending: { title: 'The Final Critic', type: 'Ending — Betrayal', restart: true },
      effects: { sun: -100, sanity: -100 }
    },

    ending_rewrite: {
      text: [
        'Page 47 is blank. No — not blank. The words appear as you read, as if the script is being written in real time by a hand you cannot see.',
        '<em>"The hero who finds this script has died, and returned, and died again. They have seen every ending. They know the sun dies. They know the Doctor is a fraud. They know the machine is a crutch and the play is a cage.</em>',
        '<em>"And yet they came back. Again and again. Not to save the sun. Not to defeat the Doctor. But because the story — this ridiculous, broken, beautiful story — matters. Even at the end of everything.</em>',
        '<em>"The true ending is not an ending at all. It is a revision."</em>',
        'The script dissolves in your hands, and its words become light — not the red light of the dying sun, but something new. Something that is neither light nor dark but the potential for both.',
        'You are standing on the stage. Doctor Talos is there. The audience is there. The sun hangs overhead. Everything is as it was.',
        'But the script is gone. There are no more predetermined endings. No more branches. No more choices laid out by a playwright who is also a fraud who is also a doctor who is also afraid of the dark.',
        'There is only you, and a stage, and a universe that is waiting — for the first time in its long, long life — to hear what you have to say.',
        'The sun flickers. You open your mouth.',
        'The show begins.',
        '<em>The real show.</em>'
      ],
      ending: { title: 'The Rewrite', type: 'The True Ending — Authorship', restart: true, secret: true },
      effects: { sun: 50, sanity: 50 }
    }
  };

  // --- DOM Elements ---
  var storyTextEl = document.getElementById('story-text');
  var choicesEl = document.getElementById('choices');
  var sunFillEl = document.getElementById('sun-fill');
  var sunValueEl = document.getElementById('sun-value');
  var sanityFillEl = document.getElementById('sanity-fill');
  var sanityValueEl = document.getElementById('sanity-value');
  var deathCounterEl = document.getElementById('death-counter');
  var deathCountEl = document.getElementById('death-count');
  var returningNoticeEl = document.getElementById('returning-notice');
  var storyFrameEl = document.getElementById('story-frame');
  var parchmentEl = document.getElementById('parchment');

  // --- Initialize ---
  function init() {
    // Show death counter if player has died before
    if (state.deaths > 0) {
      deathCounterEl.style.display = '';
      deathCountEl.textContent = state.deaths;
    }

    // Show returning player notice
    if (state.playthroughs > 0) {
      returningNoticeEl.innerHTML =
        '<div class="returning-notice">The Doctor peers at you from behind the curtain. ' +
        '"Ah, you\'ve returned. Performance number ' + (state.playthroughs + 1) +
        '. The stage remembers you, even if you wish it wouldn\'t."</div>';
    }

    renderNode('start');
  }

  // --- Render a Story Node ---
  function renderNode(nodeId) {
    var node = story[nodeId];
    if (!node) return;

    state.node = nodeId;

    // Apply effects
    if (node.effects) {
      if (typeof node.effects === 'function') {
        node.effects();
      } else {
        if (node.effects.sun !== undefined) {
          state.sun = Math.max(0, Math.min(100, state.sun + node.effects.sun));
        }
        if (node.effects.sanity !== undefined) {
          state.sanity = Math.max(0, Math.min(100, state.sanity + node.effects.sanity));
        }
      }
    }

    // Check for special meter-triggered endings
    if (!node.ending) {
      if (state.sun <= 0) {
        renderNode('ending_instant_dark');
        return;
      }
    }

    // Update gauges
    updateGauges();

    // Get text (may be function for dynamic text)
    var text = typeof node.text === 'function' ? node.text() : node.text;

    // Apply sanity distortion
    if (state.sanity <= 30 && state.sanity > 0) {
      storyFrameEl.className = 'ornate-frame-double sanity-low';
      text = text.map(function (p) { return distortText(p, 'low'); });
    } else if (state.sanity <= 0) {
      storyFrameEl.className = 'ornate-frame-double sanity-critical';
      text = text.map(function (p) { return distortText(p, 'critical'); });
    } else {
      storyFrameEl.className = 'ornate-frame-double';
    }

    // Render text
    storyTextEl.innerHTML = '';
    text.forEach(function (para, i) {
      if (para === '') {
        storyTextEl.appendChild(document.createElement('br'));
        return;
      }
      var p = document.createElement('p');
      if (i === 0) p.className = 'drop-cap';
      p.innerHTML = para;
      storyTextEl.appendChild(p);
    });

    // Render choices or ending
    choicesEl.innerHTML = '';

    if (node.ending) {
      renderEnding(node.ending);
      // Track death/playthrough
      if (node.ending.restart) {
        state.playthroughs++;
        localStorage.setItem('talos_playthroughs', state.playthroughs);
        if (nodeId.indexOf('ending_betrayal') !== -1 ||
            nodeId.indexOf('ending_nothing') !== -1 ||
            nodeId.indexOf('ending_instant_dark') !== -1 ||
            nodeId.indexOf('ending_dark_walk') !== -1) {
          state.deaths++;
          localStorage.setItem('talos_deaths', state.deaths);
          deathCounterEl.style.display = '';
          deathCountEl.textContent = state.deaths;
        }
      }
    } else {
      var choices = node.choices.filter(function (c) {
        return !c.condition || c.condition();
      });

      choices.forEach(function (choice) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.innerHTML = choice.text;
        btn.addEventListener('click', function () {
          renderNode(choice.next);
          window.scrollTo({ top: storyFrameEl.offsetTop - 100, behavior: 'smooth' });
        });
        li.appendChild(btn);
        choicesEl.appendChild(li);
      });
    }
  }

  function renderEnding(ending) {
    var div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML =
      '<div class="divider"></div>' +
      '<h2>' + ending.title + '</h2>' +
      '<div class="ending-type">' + ending.type + '</div>' +
      (ending.secret ? '<p style="color: var(--teal); font-style: italic;">You found the hidden path.</p>' : '') +
      '<button class="play-again-btn" id="play-again">Begin Again</button>';
    choicesEl.appendChild(div);

    document.getElementById('play-again').addEventListener('click', function () {
      state.sun = 100;
      state.sanity = 100;
      state.foundScript = false;
      parchmentEl.removeAttribute('data-dim');
      renderNode('start');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Update Gauge Displays ---
  function updateGauges() {
    // Sun gauge
    sunFillEl.style.width = state.sun + '%';
    sunValueEl.textContent = state.sun;

    sunFillEl.classList.remove('low', 'critical');
    if (state.sun <= 20) sunFillEl.classList.add('critical');
    else if (state.sun <= 50) sunFillEl.classList.add('low');

    // Sanity gauge
    sanityFillEl.style.width = state.sanity + '%';
    sanityValueEl.textContent = state.sanity;

    sanityFillEl.classList.remove('low', 'critical');
    if (state.sanity <= 20) sanityFillEl.classList.add('critical');
    else if (state.sanity <= 50) sanityFillEl.classList.add('low');

    // Screen dim based on sun level
    var dimLevel = 0;
    if (state.sun <= 20) dimLevel = 5;
    else if (state.sun <= 35) dimLevel = 4;
    else if (state.sun <= 50) dimLevel = 3;
    else if (state.sun <= 65) dimLevel = 2;
    else if (state.sun <= 80) dimLevel = 1;

    parchmentEl.setAttribute('data-dim', dimLevel);
  }

  // --- Text Distortion for Low Sanity ---
  function distortText(text, level) {
    if (level === 'low') {
      // Occasional word replacement
      var replacements = [
        [/\blight\b/gi, function () { return Math.random() > 0.5 ? 'l\u0336i\u0336g\u0336h\u0336t\u0336' : 'light'; }],
        [/\bsun\b/gi, function () { return Math.random() > 0.5 ? 's\u0336u\u0336n\u0336' : 'sun'; }],
        [/\bdark/gi, function () { return Math.random() > 0.6 ? 'd\u0334a\u0334r\u0334k' : 'dark'; }]
      ];
      replacements.forEach(function (r) {
        text = text.replace(r[0], r[1]);
      });
      return text;
    }

    if (level === 'critical') {
      // Heavy distortion
      var chars = text.split('');
      chars = chars.map(function (c) {
        if (Math.random() > 0.92 && c !== '<' && c !== '>' && c !== '/' && c !== '=') {
          var zalgo = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
                       '\u0308', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
                       '\u0336', '\u0337', '\u0338'];
          return c + zalgo[Math.floor(Math.random() * zalgo.length)];
        }
        return c;
      });

      // Occasional word insertion
      if (Math.random() > 0.7) {
        var insertions = [
          ' <em style="color:var(--teal)">[the sun watches]</em> ',
          ' <em style="color:var(--teal)">[was this in the script?]</em> ',
          ' <em style="color:var(--teal)">[you have been here before]</em> ',
          ' <em style="color:var(--blood)">[this is not real]</em> '
        ];
        var pos = Math.floor(Math.random() * chars.length * 0.5) + Math.floor(chars.length * 0.25);
        chars.splice(pos, 0, insertions[Math.floor(Math.random() * insertions.length)]);
      }

      return chars.join('');
    }

    return text;
  }

  // --- Start ---
  init();
})();
