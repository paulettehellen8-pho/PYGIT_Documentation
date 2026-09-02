const container = document.getElementById("scrollContainer");
const pages = Array.from(document.querySelectorAll(".page"));
const upArrow = document.getElementById("upArrow");
const downArrow = document.getElementById("downArrow");
const curPageEl = document.getElementById("curPage");
const totalPagesEl = document.getElementById("totalPages");

let currentIndex = 0;
totalPagesEl.textContent = String(pages.length).padStart(2, "0");

function pad(n) {
   return String(n).padStart(2, "0");
}

function updateUI() {
   curPageEl.textContent = pad(currentIndex + 1);
   upArrow.disabled = currentIndex === 0;
   downArrow.disabled = currentIndex === pages.length - 1;
}

function goToPage(index) {
   if (index < 0 || index >= pages.length) return;
   pages[index].scrollIntoView({ behavior: "smooth", block: "start" });
}

// Track current page as the user scrolls / swipes
const observer = new IntersectionObserver(
   (entries) => {
      entries.forEach((entry) => {
         if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            currentIndex = pages.indexOf(entry.target);
            updateUI();
         }
      });
   },
   { root: container, threshold: [0.6] },
);

pages.forEach((p) => observer.observe(p));

// Arrow buttons
upArrow.addEventListener("click", () => goToPage(currentIndex - 1));
downArrow.addEventListener("click", () => goToPage(currentIndex + 1));

// Keyboard navigation
window.addEventListener("keydown", (e) => {
   if (["ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      goToPage(currentIndex + 1);
   } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      goToPage(currentIndex - 1);
   }
});

updateUI();
