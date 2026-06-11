/* =========================================================================
   AI Medical Concierge — a guided navigation experience.

   This is not a chatbot, not a diagnosis tool, not a virtual doctor.
   It listens, asks gentle questions, reduces uncertainty and points
   toward the right kind of care. It organises; it never diagnoses.

   The conversation here is a scripted concept demonstration.
   ========================================================================= */
(function () {
  "use strict";

  const scroll  = document.getElementById("chatScroll");
  const chips   = document.getElementById("chips");
  const form    = document.getElementById("composeForm");
  const input   = document.getElementById("composeInput");
  if (!scroll || !form) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep   = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* --- Concern scripts -------------------------------------------------- */
  const ICON = {
    note:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v5h5"/><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M9 13h6M9 17h4"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
    path:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/></svg>',
    cal:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>'
  };

  const SCRIPTS = {
    neck: {
      label: "Neck pain & headaches",
      ack: "Thank you for telling me. Neck tension and headaches often travel together — let's understand it a little better so I can point you in the right direction.",
      questions: [
        { q: "How long has this been part of your days?", opts: ["A few days", "A couple of weeks", "A month or longer"] },
        { q: "Does it tend to build up with screen time, stress or poor sleep?", opts: ["Yes, often", "Sometimes", "Not that I notice"] }
      ],
      pathway: {
        intro: "Here's a calm way to think about next steps. This is guidance to help you start in the right place — not a diagnosis.",
        items: [
          { ic: "person", t: "A good place to begin", d: "An orientation consultation with a physician who can look at the whole picture." },
          { ic: "path",   t: "Where it may lead", d: "Often physiotherapy for posture and tension, with a neurology review if headaches persist." },
          { ic: "note",   t: "Worth preparing", d: "When it started, what eases it, sleep and screen habits, any past scans." }
        ]
      }
    },
    fatigue: {
      label: "Persistent tiredness",
      ack: "I hear you — lasting tiredness can quietly affect everything. Let's gently narrow down where to begin.",
      questions: [
        { q: "How long have you been feeling this way?", opts: ["A couple of weeks", "A month or two", "Longer than that"] },
        { q: "Has your sleep, appetite or mood changed alongside it?", opts: ["Yes, noticeably", "A little", "Not really"] }
      ],
      pathway: {
        intro: "Here's a clear way to move forward. This is orientation, not a diagnosis — your physician will explore the details with you.",
        items: [
          { ic: "person", t: "A good place to begin", d: "An internal-medicine consultation to review your overall health and recent changes." },
          { ic: "path",   t: "Where it may lead", d: "Often a simple set of baseline checks, with sleep or nutritional review if helpful." },
          { ic: "note",   t: "Worth preparing", d: "Energy patterns through the day, sleep, recent life changes, any current medication." }
        ]
      }
    },
    stomach: {
      label: "Recurring stomach discomfort",
      ack: "Thank you for sharing that. Recurring stomach discomfort has many gentle explanations — let's find the right starting point together.",
      questions: [
        { q: "Is it linked to meals or particular foods?", opts: ["Often after eating", "Certain foods", "No clear pattern"] },
        { q: "How long has this been happening?", opts: ["A week or two", "A few months", "On and off for a while"] }
      ],
      pathway: {
        intro: "Here's a calm next step. This is guidance to help you begin in the right place, not a diagnosis.",
        items: [
          { ic: "person", t: "A good place to begin", d: "A gastroenterology orientation, or a physician who can decide what's worth checking first." },
          { ic: "path",   t: "Where it may lead", d: "Often a review of diet and patterns, with further checks only if they're warranted." },
          { ic: "note",   t: "Worth preparing", d: "A short note of when it happens, foods involved, and anything that brings relief." }
        ]
      }
    },
    general: {
      label: "Something else",
      ack: "That's completely fine — you don't need the right words. Tell me a little more and I'll help you find a calm place to start.",
      questions: [
        { q: "Roughly how long has this been on your mind?", opts: ["Just recently", "A few weeks", "Longer than that"] },
        { q: "Is this mostly about understanding what's happening, or finding the right person to see?", opts: ["Understanding it", "Finding the right person", "Both, really"] }
      ],
      pathway: {
        intro: "Here's a reassuring way to begin. Think of this as orientation — a starting point, never a diagnosis.",
        items: [
          { ic: "person", t: "A good place to begin", d: "An orientation consultation with a physician who can listen and guide you onward." },
          { ic: "path",   t: "Where it may lead", d: "From there, the right specialist becomes clear — without you having to guess." },
          { ic: "note",   t: "Worth preparing", d: "A few sentences on what you're noticing and what matters most to you right now." }
        ]
      }
    }
  };

  const KEYWORDS = [
    [/(neck|headache|migrain|shoulder|posture|tension)/i, "neck"],
    [/(tired|fatigue|exhaust|energy|sleep|drained)/i, "fatigue"],
    [/(stomach|gut|nause|digest|belly|abdom|gastric|bloat)/i, "stomach"]
  ];
  const detect = (text) => {
    for (const [re, key] of KEYWORDS) if (re.test(text)) return key;
    return "general";
  };

  /* --- DOM helpers ------------------------------------------------------ */
  const scrollDown = () => { scroll.scrollTop = scroll.scrollHeight; };

  function addUser(text) {
    const el = document.createElement("div");
    el.className = "msg msg--user";
    el.innerHTML = `<div class="msg__bubble">${esc(text)}</div>`;
    scroll.appendChild(el);
    scrollDown();
  }

  function addBot(html, meta) {
    const el = document.createElement("div");
    el.className = "msg msg--bot";
    el.innerHTML = `<div class="msg__bubble">${html}</div>` +
      (meta ? `<div class="msg__meta">${meta}</div>` : "");
    scroll.appendChild(el);
    scrollDown();
    return el;
  }

  async function botSay(html, meta) {
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    scroll.appendChild(t);
    scrollDown();
    await sleep(360 + Math.min(html.length * 9, 900));
    t.remove();
    return addBot(html, meta);
  }

  function renderChips(items) {
    chips.innerHTML = "";
    items.forEach((it) => {
      const b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.textContent = it.label;
      b.addEventListener("click", () => it.onClick(it));
      chips.appendChild(b);
    });
  }
  const clearChips = () => (chips.innerHTML = "");

  function lockInput(locked, placeholder) {
    input.disabled = locked;
    if (placeholder) input.placeholder = placeholder;
  }

  /* --- Flow ------------------------------------------------------------- */
  let busy = false;

  async function start() {
    scroll.innerHTML = "";
    clearChips();
    lockInput(false, "Describe what you're feeling…");
    await botSay("Hello, and welcome. I'm your concierge — I'm here to help you find your bearings, not to diagnose.");
    await botSay("What's been on your mind? You can describe it in your own words, or start with one of these.");
    offerConcerns();
  }

  function offerConcerns() {
    renderChips([
      { label: "Neck pain & headaches", key: "neck" },
      { label: "Persistent tiredness", key: "fatigue" },
      { label: "Recurring stomach discomfort", key: "stomach" },
      { label: "Something else", key: "general" }
    ].map((c) => ({ ...c, onClick: () => beginScript(c.key, c.label) })));
  }

  async function beginScript(key, userText) {
    if (busy) return;
    busy = true;
    clearChips();
    addUser(userText);
    const flow = SCRIPTS[key];
    await botSay(flow.ack);
    askQuestion(flow, 0);
    busy = false;
  }

  function askQuestion(flow, i) {
    const step = flow.questions[i];
    (async () => {
      busy = true;
      await botSay(step.q);
      renderChips(step.opts.map((opt) => ({
        label: opt,
        onClick: async () => {
          if (busy) return;
          busy = true;
          clearChips();
          addUser(opt);
          await sleep(180);
          if (i + 1 < flow.questions.length) {
            busy = false;
            askQuestion(flow, i + 1);
          } else {
            await showPathway(flow);
            busy = false;
          }
        }
      })));
      busy = false;
    })();
  }

  async function showPathway(flow) {
    await botSay(flow.pathway.intro);
    const items = flow.pathway.items.map((it) => `
      <div class="pathway__item">
        <div class="pathway__ic">${ICON[it.ic]}</div>
        <div class="pathway__t"><b>${it.t}</b><span>${it.d}</span></div>
      </div>`).join("");
    addBot(`
      <div class="pathway">
        <div class="pathway__h">${ICON.path} A suggested way forward</div>
        ${items}
        <a class="pathway__cta" href="booking.html">Take the next step — book an orientation</a>
      </div>`);
    await sleep(120);
    addBot("Whenever you're ready, I can prepare everything for your visit. Or we can start again.", null);
    lockInput(true, "Choose an option below…");
    renderChips([
      { label: "↻ Start over", onClick: () => start() },
      { label: "See who could help →", onClick: () => (window.location.href = "doctors.html") }
    ]);
  }

  /* --- Free-text input -------------------------------------------------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy || input.disabled) return;
    input.value = "";
    busy = true;
    clearChips();
    addUser(text);
    const key = detect(text);
    const flow = SCRIPTS[key];
    await botSay(flow.ack);
    askQuestion(flow, 0);
    busy = false;
  });

  start();
})();
