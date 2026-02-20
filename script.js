// Smooth scroll
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Skill
const main = document.getElementById("skill-main");
const children = [
  document.getElementById("skill-unity"),
  document.getElementById("skill-oop"),
  document.getElementById("skill-ps")
];

const svg = document.getElementById("skill-lines");

function drawLines() {
  svg.innerHTML = "";

  const mainRect = main.getBoundingClientRect();
  const containerRect = svg.getBoundingClientRect();

  children.forEach(child => {
    const childRect = child.getBoundingClientRect();

    const x1 = mainRect.left + mainRect.width / 2 - containerRect.left;
    const y1 = mainRect.bottom - containerRect.top;

    const x2 = childRect.left + childRect.width / 2 - containerRect.left;
    const y2 = childRect.top - containerRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#38bdf8");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
  });
}

window.addEventListener("load", drawLines);
window.addEventListener("resize", drawLines);

