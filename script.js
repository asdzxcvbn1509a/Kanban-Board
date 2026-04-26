const STORAGE_KEY = "kanban-board-data";

const columns = ["backlog", "progress", "complete", "reject"];
const lists = Object.fromEntries(
  columns.map((c) => [c, document.querySelector(`[data-list="${c}"]`)])
);
const counts = Object.fromEntries(
  columns.map((c) => [c, document.querySelector(`[data-count="${c}"]`)])
);

let draggedItem = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    columns.forEach((col) => {
      lists[col].innerHTML = "";
      (data[col] || []).forEach((text) => lists[col].appendChild(createCard(text)));
    });
  } catch {
    /* ignore corrupt storage */
  }
}

function save() {
  const data = Object.fromEntries(
    columns.map((col) => [
      col,
      [...lists[col].querySelectorAll(".drag-item-text")].map((el) =>
        el.textContent.trim()
      ),
    ])
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updateCounts() {
  columns.forEach((col) => {
    counts[col].textContent = lists[col].children.length;
  });
}

function createCard(text = "New task") {
  const li = document.createElement("li");
  li.className = "drag-item";
  li.draggable = true;

  const span = document.createElement("span");
  span.className = "drag-item-text";
  span.contentEditable = "true";
  span.spellcheck = false;
  span.textContent = text;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-btn";
  del.setAttribute("aria-label", "Delete task");
  del.textContent = "×";

  li.append(span, del);
  attachCardEvents(li);
  return li;
}

function attachCardEvents(item) {
  item.addEventListener("dragstart", () => {
    draggedItem = item;
    item.classList.add("dragging");
  });
  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
    draggedItem = null;
    document
      .querySelectorAll(".drag-column.over")
      .forEach((c) => c.classList.remove("over"));
    updateCounts();
    save();
  });

  const text = item.querySelector(".drag-item-text");
  text.addEventListener("blur", () => {
    if (!text.textContent.trim()) text.textContent = "Untitled";
    save();
  });
  text.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      text.blur();
    }
  });
  text.addEventListener("dragstart", (e) => e.preventDefault());

  item.querySelector(".delete-btn").addEventListener("click", () => {
    item.style.transition = "opacity 150ms, transform 150ms";
    item.style.opacity = "0";
    item.style.transform = "scale(0.9)";
    setTimeout(() => {
      item.remove();
      updateCounts();
      save();
    }, 150);
  });
}

function getDragAfterElement(list, y) {
  const items = [...list.querySelectorAll(".drag-item:not(.dragging)")];
  return items.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

function attachListEvents(list) {
  const column = list.closest(".drag-column");

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    column.classList.add("over");
    const after = getDragAfterElement(list, e.clientY);
    if (after == null) {
      list.appendChild(draggedItem);
    } else {
      list.insertBefore(draggedItem, after);
    }
  });

  list.addEventListener("dragleave", (e) => {
    if (!column.contains(e.relatedTarget)) column.classList.remove("over");
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("over");
  });
}

function attachAddButtons() {
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const col = btn.dataset.add;
      const card = createCard("");
      lists[col].appendChild(card);
      updateCounts();
      const text = card.querySelector(".drag-item-text");
      text.focus();
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function init() {
  load();
  Object.values(lists).forEach(attachListEvents);
  document.querySelectorAll(".drag-item").forEach(attachCardEvents);
  attachAddButtons();
  updateCounts();
}

init();
