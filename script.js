// Smooth scroll
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");

    // e.preventDefault();

    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
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
const tree = document.querySelector(".skill-tree");

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

// Drag skill tree
let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

tree.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  e.preventDefault();
});

window.addEventListener("mousemove", e => {
  if (!isDragging) return;

  currentX = e.clientX - startX;
  currentY = e.clientY - startY;

  updateTransform();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mouseleave", () => {
  isDragging = false;
});

// Skill hover
const tooltip = document.getElementById("skill-tooltip");

document.querySelectorAll(".skill-node").forEach(node => {
  node.addEventListener("mouseenter", e => {
    let html = `<strong>${node.innerText}</strong><br>`;

    if (node.dataset.level) {
      html += `Level: ${node.dataset.level}<br>`;
      html += `Rating: ${node.dataset.stars}<br>`;
    }

    if (node.dataset.desc) {
      html += `<br>${node.dataset.desc}`;
    }

    tooltip.innerHTML = html;
    tooltip.style.display = "block";
  });

  node.addEventListener("mousemove", e => {
    tooltip.style.left = e.clientX + 15 + "px";
    tooltip.style.top = e.clientY + 15 + "px";
  });

  node.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});

// zoom control
let scale = 1;
const minScale = 0.8;
const maxScale = 1.2;

function updateTransform() {
  applyBounds();
  tree.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
  drawLines();
}

// Zoom with Scroll Mouse
document.querySelector(".skill-tree-container")
  .addEventListener("wheel", e => {
    e.preventDefault();

    if (e.deltaY < 0) {
      scale += 0.1;
    } else {
      scale -= 0.1;
    }

    scale = Math.min(maxScale, Math.max(minScale, scale));
    updateTransform();
  });

  // Zoom with Button
  document.getElementById("zoom-in").addEventListener("click", () => {
  scale += 0.1;
  scale = Math.min(maxScale, scale);
  updateTransform();
});

document.getElementById("zoom-out").addEventListener("click", () => {
  scale -= 0.1;
  scale = Math.max(minScale, scale);
  updateTransform();
});

// Clamp
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyBounds() {
  const container = document.querySelector(".skill-tree-container");

  const containerRect = container.getBoundingClientRect();
  const treeRect = tree.getBoundingClientRect();

  const scaledWidth = tree.offsetWidth * scale;
  const scaledHeight = tree.offsetHeight * scale;

  const margin = 200;

  const minX = containerRect.width - scaledWidth;
  const minY = containerRect.height - scaledHeight;

  const maxX = margin;
  const maxY = margin;

  currentX = clamp(currentX, minX, maxX);
  currentY = clamp(currentY, minY, maxY);
}


window.addEventListener("load", () => {
  const container = document.querySelector(".skill-tree-container");

  currentX = (container.clientWidth - tree.offsetWidth) / 2;
  currentY = 40;

  updateTransform();
});
//End Skill