/* =========================================================================
   Booking Experience — the next step, without friction.
   A small interactive demonstration: choose a time, see it gathered into a
   calm summary, confirm. Concept demonstration only.
   ========================================================================= */
(function () {
  "use strict";

  const slots   = document.querySelectorAll(".slot");
  const sumWhen = document.getElementById("sumWhen");
  const confirm = document.getElementById("confirmBtn");
  const form    = document.getElementById("bookingForm");
  const done    = document.getElementById("confirmMsg");
  const step3   = document.getElementById("step3");
  const step4   = document.getElementById("step4");
  const doneWhen = document.getElementById("doneWhen");
  const foot    = document.getElementById("bookingFoot");
  if (!slots.length || !confirm) return;

  let selected = null;

  slots.forEach((slot) => {
    slot.addEventListener("click", () => {
      slots.forEach((s) => s.classList.remove("is-selected"));
      slot.classList.add("is-selected");
      selected = slot.dataset.when;
      sumWhen.textContent = selected;
      confirm.disabled = false;
      step3.classList.add("done");
      step3.classList.remove("active");
      step4.classList.add("active");
    });
  });

  confirm.addEventListener("click", () => {
    if (!selected) return;
    step4.classList.remove("active");
    step4.classList.add("done");
    if (doneWhen) doneWhen.textContent = selected;
    form.style.display = "none";
    if (foot) foot.style.display = "none";
    done.classList.add("show");
    done.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
