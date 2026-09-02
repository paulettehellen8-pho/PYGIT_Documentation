// Typing simulation for the demo terminal
const lines = [
   { text: "$ pygit-tui", cls: "" },
   { text: "> [space] stage app.py", cls: "accent" },
   { text: "> [c] open commit modal", cls: "accent" },
   { text: "Commit message: fix: handle empty stash list", cls: "" },
   { text: "[Enter] committed 1 file", cls: "accent" },
   { text: "> [Ctrl+P] push", cls: "accent" },
   { text: "Pushing to origin/main... done.", cls: "" },
];

const target = document.getElementById("typed");
let lineIndex = 0;
let charIndex = 0;

function typeNext() {
   if (lineIndex >= lines.length) {
      target.innerHTML += '<span class="cursor">&nbsp;</span>';
      return;
   }
   const line = lines[lineIndex];
   if (charIndex === 0) {
      target.innerHTML += `<div class="line-${lineIndex} ${line.cls}"></div>`;
   }
   const el = target.querySelector(`.line-${lineIndex}`);
   el.textContent = line.text.slice(0, charIndex + 1);
   charIndex++;

   if (charIndex >= line.text.length) {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 400);
   } else {
      setTimeout(typeNext, 22);
   }
}

// Respect reduced motion: just show all lines instantly
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) {
   target.innerHTML = lines
      .map((l, i) => `<div class="${l.cls}">${l.text}</div>`)
      .join("");
} else {
   typeNext();
}
