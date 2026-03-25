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

// ================= GRID POSITIONS =================
// col: a=1, b=2, ..., l=12 | row: 1–6
const gridPositions = {
  "node-skills":                  { col: 8,  row: 1 },

  "node-tech":                    { col: 5,  row: 2 },
  "node-soft":                    { col: 11, row: 2 },

  "node-programming":             { col: 2,  row: 3 },
  "node-tools":                   { col: 5,  row: 3 },
  "node-others":                  { col: 7,  row: 3 },
  "skill-positive-attitude":      { col: 10, row: 3 },
  "skill-willingness-to-improve": { col: 11, row: 3 },
  "skill-growth":                 { col: 12, row: 3 },

  "skill-csharp":                 { col: 1,  row: 4 },
  "skill-oop":                    { col: 2,  row: 4 },
  "skill-py":                     { col: 3,  row: 4 },
  "skill-unity":                  { col: 4,  row: 4 },
  "skill-github":                 { col: 5,  row: 4 },
  "skill-notion":                 { col: 6,  row: 4 },
  "skill-math":                   { col: 7,  row: 4 },
  "skill-open-to-feedback":       { col: 10, row: 4 },
  "skill-persistence":            { col: 11, row: 4 },
  "skill-responsibility":         { col: 12, row: 4 },

  "skill-html":                   { col: 1,  row: 5 },
  "skill-css":                    { col: 2,  row: 5 },
  "skill-js":                     { col: 3,  row: 5 },
  "skill-clickup":                { col: 4,  row: 5 },
  "skill-docs":                   { col: 5,  row: 5 },
  "skill-spreadsheets":           { col: 6,  row: 5 },
  "skill-canva":                  { col: 7,  row: 5 },
  "skill-figma":                  { col: 8,  row: 5 },
  "skill-design-thinking":        { col: 10, row: 5 },
  "skill-critical-thinking":      { col: 11, row: 5 },
  "skill-patience":               { col: 12, row: 5 },

  "skill-lua":                    { col: 1,  row: 6 },
};

// ================= TREE STRUCTURE =================
const treeData = {
  "node-skills": ["node-tech", "node-soft"],

  "node-tech": ["node-programming", "node-tools", "node-others"],

  "node-programming": [
    "skill-csharp", "skill-oop", "skill-py",
    "skill-html", "skill-css", "skill-js", "skill-lua"
  ],

  "node-tools": [
    "skill-unity", "skill-github", "skill-notion",
    "skill-clickup", "skill-docs", "skill-spreadsheets",
    "skill-canva", "skill-figma"
  ],

  "node-others": ["skill-math"],

  "node-soft": [
    "skill-positive-attitude",
    "skill-willingness-to-improve",
    "skill-growth",
    "skill-open-to-feedback",
    "skill-patience",
    "skill-persistence",
    "skill-responsibility",
    "skill-design-thinking",
    "skill-critical-thinking"
  ]
};

function drawLines() {
  svg.innerHTML = "";

  const containerRect = svg.getBoundingClientRect();

  Object.keys(treeData).forEach(parentId => {
    const parent = document.getElementById(parentId);
    const children = treeData[parentId];

    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();

    children.forEach(childId => {
      const child = document.getElementById(childId);
      if (!child) return;

      const childRect = child.getBoundingClientRect();

      const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
      const y1 = parentRect.bottom - containerRect.top;

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
  });
}

window.addEventListener("load", drawLines);
window.addEventListener("resize", drawLines);

// Drag skill tree
let isDragging = false;
let hasDragged  = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

tree.addEventListener("mousedown", e => {
  isDragging = true;
  hasDragged  = false;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  e.preventDefault();
});

window.addEventListener("mousemove", e => {
  if (!isDragging) return;
  hasDragged = true;

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

// ================= SKILL PANEL =================
const GUIDE_HTML = `<span style="color:#94a3b8;font-style:italic;">
  Explore my skill tree.<br>
  Drag to move, scroll to zoom,<br>
  and <strong style="color:#38bdf8;">click on a skill</strong> to view details.
</span>`;
const FADE_MS   = 300;
const IDLE_MS   = 5000;

const panel     = document.getElementById("skill-panel");
let   idleTimer = null;

function setPanelContent(html) {
  panel.classList.add("fade-out");
  setTimeout(() => {
    panel.innerHTML = html;
    panel.classList.remove("fade-out");
  }, FADE_MS);
}

function showGuide() {
  setPanelContent(GUIDE_HTML);
}

function startIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(showGuide, IDLE_MS);
}

// Click on skill nodes that have data-desc
document.querySelectorAll(".skill-node").forEach(node => {
  node.addEventListener("mouseup", () => {
    if (hasDragged) return;           // ถ้า drag อยู่ให้ข้ามไป
    if (!node.dataset.desc) return;   // category node ไม่มี desc

    // หาชื่อ node = <p> ที่สั้นที่สุด (กัน long-text p ขึ้นมาก่อน)
    const namePara = [...node.querySelectorAll("p")]
      .find(p => p.innerText.trim().length < 50)
      || node.querySelector("p");
    const name  = namePara ? namePara.innerText.trim() : "";
    const stars = node.dataset.stars
      ? `<br><span style="color:gold;">${node.dataset.stars}</span>` : "";
    const level = node.dataset.level
      ? `<span style="color:#94a3b8;"> · ${node.dataset.level}</span>` : "";
    const desc  = `<br><br>${node.dataset.desc}`;

    setPanelContent(
      `<strong style="color:#38bdf8;">${name}</strong>${stars}${level}${desc}`
    );
    startIdleTimer();
  });
});

// กด nav ไป section อื่น → reset กลับ guide ทันที
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (link.getAttribute("href") !== "#skills") {
      clearTimeout(idleTimer);
      showGuide();
    }
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
  layoutTree();
  applyGroupClasses();

  const container = document.querySelector(".skill-tree-container");

  // จัด tree ให้อยู่กึ่งกลาง container แนวนอน (scale=1 ตอนเริ่ม)
  currentX = (container.clientWidth - tree.offsetWidth * scale) / 2;
  currentY = 0;

  updateTransform();

  // แสดง guide text ทันทีโดยไม่ fade (ครั้งแรก)
  panel.innerHTML = GUIDE_HTML;
});

// ================= GROUP COLORS =================
// assign CSS class ตาม treeData เพื่อระบุสีกลุ่ม
// (ไม่ต้องแก้ HTML ทีละ node — เพิ่ม/ลบ node ใน treeData แล้วสีตามได้เลย)
const groupMap = {
  "group-prog":   ["node-programming", ...treeData["node-programming"]],
  "group-tools":  ["node-tools",       ...treeData["node-tools"]],
  "group-others": ["node-others",      ...treeData["node-others"]],
};

function applyGroupClasses() {
  Object.entries(groupMap).forEach(([cls, ids]) => {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add(cls);
    });
  });
}

function layoutTree() {
  const colWidth  = 185;   // node width 160px + gap 25px
  const rowHeight = 200;
  const padding   = 40;

  let maxCol = 0;
  let maxRow = 0;

  Object.keys(gridPositions).forEach(id => {
    const node = document.getElementById(id);
    if (!node) return;

    const { col, row } = gridPositions[id];
    node.style.left = `${(col - 1) * colWidth + padding}px`;
    node.style.top  = `${(row - 1) * rowHeight + padding}px`;

    if (col > maxCol) maxCol = col;
    if (row > maxRow) maxRow = row;
  });

  // กำหนดขนาด tree จริง ให้ applyBounds() ทำงานถูกต้อง
  tree.style.width  = `${maxCol * colWidth + padding * 2}px`;
  tree.style.height = `${maxRow * rowHeight + padding * 2}px`;
}
//End Skill