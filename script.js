/*
  My Todo App
  -----------
  Architecture:
  - "todos" is the single source of truth (app state)
  - UI is derived from state via renderTodos(...)
  - Event handlers update state, then re-render the UI
*/

// ==============================
// 1. DOM ELEMENT REFERENCES
// ==============================

const titleInput = document.getElementById("TodoTitle");
const descInput = document.getElementById("descInput");
const dueInput = document.getElementById("dueInput");
const personInput = document.getElementById("personInput");
const filesInput = document.getElementById("filesInput");

const addButton = document.getElementById("addBtn");
const todosList = document.getElementById("todosList");

const filterBtn = document.getElementById("filterBtn");
const sortBtn = document.getElementById("sortBtn");

// ==============================
// 2. APPLICATION STATE
// ==============================

// Static data that exists when the app starts
const assignees = ["Simon", "Roman", "Johan"];

// UI state (controls what the user is currently viewing)
let showOnlyOpen = false;   // filter toggle: false = all, true = only not completed
let sortMode = "created";   // "created" | "due"

// Data state (the truth)
let todos = [];             // list of todo objects (add/edit/delete changes this)

// (Not used right now, but you can remove or use later)
let filteredTodos = [];

// ==============================
// 3. EVENT LISTENERS
// ==============================

// Note: todo item buttons (done/edit/delete) are created dynamically in renderTodos(),
// so their listeners are attached inside the render loop.
addButton?.addEventListener("click", handleAddTodo);
filterBtn?.addEventListener("click", handleFilterTodos);
sortBtn?.addEventListener("click", handleSortTodos);

// ==============================
// 4. FUNCTIONS
// ==============================

/**
 * Fill the "Assignee" <select> with the predefined assignees list.
 * Runs once on app startup.
 */
function populateAssignees() {
  const select = document.getElementById("personInput");
  if (!select) return;

  // Reset dropdown so we don't duplicate options if called again
  select.innerHTML = `<option value="">-- Select Person (Optional) --</option>`;

  for (const name of assignees) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  }
}

/**
 * Read form inputs, validate, create a todo object, save to state, then re-render.
 * This is the only place that creates new todo objects.
 */
function handleAddTodo() {
  // Read form values (trim text to avoid "   " titles)
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const dueTo = dueInput.value; // "" or "YYYY-MM-DDTHH:mm"
  const assignee = personInput.value;
  const attachment = filesInput.files ? filesInput.files.length : 0;

  // Minimal validation
  if (!title) {
    alert("Title is mandatory");
    return;
  }

  // Create todo object (our state representation)
  const todo = {
    id: crypto.randomUUID(),
    title,
    description,
    dueTo,
    assignee,
    attachment,
    createdAt: new Date().toISOString(),
    completed: false,
  };

  // Update state
  todos.unshift(todo); // newest first

  // Update UI (respect current filter/sort)
  renderTodos(getVisibleTodos());

  // Reset inputs for the next todo
  resetForm();
}

/**
 * Render the provided list of todos into the DOM.
 * This function rebuilds the list from scratch so UI always matches state.
 */
function renderTodos(list = todos) {
  if (!todosList) return;

  // Clear current UI
  todosList.innerHTML = "";

  // Empty state
  if (!list.length) {
    todosList.innerHTML = `<div class="text-secondary">No todos yet.</div>`;
    return;
  }

  // Build UI for each todo
  for (const todo of list) {
    const card = document.createElement("div");
    card.className =
      "border rounded-3 p-3 bg-white d-flex justify-content-between align-items-start mb-2";

    // LEFT SIDE: title, description, badges
    const left = document.createElement("div");
    left.className = "me-3 flex-grow-1";

    const titleEl = document.createElement("div");
    titleEl.className = "fw-semibold";
    titleEl.textContent = todo.title;

    // Visual "completed" style (state -> UI)
    if (todo.completed) {
      titleEl.style.textDecoration = "line-through";
      titleEl.style.opacity = "0.6";
    }

    left.appendChild(titleEl);

    if (todo.description) {
      const descEl = document.createElement("div");
      descEl.className = "text-secondary small mt-1";
      descEl.textContent = todo.description;
      left.appendChild(descEl);
    }

    const meta = document.createElement("div");
    meta.className = "d-flex flex-wrap gap-2 mt-2";

    if (todo.dueTo) {
      const due = document.createElement("span");
      due.className = "badge text-bg-light border";
      due.textContent = `Due: ${todo.dueTo.replace("T", " ")}`;
      meta.appendChild(due);
    }

    if (todo.assignee) {
      const who = document.createElement("span");
      who.className = "badge text-bg-info";
      who.textContent = todo.assignee;
      meta.appendChild(who);
    }

    if (todo.attachment > 0) {
      const att = document.createElement("span");
      att.className = "badge text-bg-secondary";
      att.textContent = `${todo.attachment} attachment${todo.attachment > 1 ? "s" : ""}`;
      meta.appendChild(att);
    }

    left.appendChild(meta);

    // RIGHT SIDE: created date + action buttons
    const right = document.createElement("div");
    right.className = "text-end";

    const created = document.createElement("div");
    created.className = "small text-secondary mb-2";
    created.textContent = `Created: ${todo.createdAt.slice(0, 10)}`;
    right.appendChild(created);

    // Action buttons are created per todo (dynamic),
    // so we attach their listeners right here.
    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const completeBtn = document.createElement("button");
    completeBtn.title = todo.completed ? "Mark as not done" : "Mark as done";
    completeBtn.className = "btn btn-outline-success btn-sm";
    completeBtn.innerHTML = todo.completed
      ? `<i class="bi bi-check-circle-fill text-success"></i>`
      : `<i class="bi bi-circle"></i>`;
    completeBtn.addEventListener("click", () => handleMarkDone(todo.id));

    const editBtn = document.createElement("button");
    editBtn.title = "Edit";
    editBtn.className = "btn btn-outline-primary btn-sm";
    editBtn.innerHTML = `<i class="bi bi-pencil"></i>`;
    editBtn.addEventListener("click", () => handleEditTodo(todo.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.title = "Delete";
    deleteBtn.className = "btn btn-outline-danger btn-sm";
    deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;
    deleteBtn.addEventListener("click", () => handleDeleteTodo(todo.id));

    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    right.appendChild(btnGroup);

    card.appendChild(left);
    card.appendChild(right);

    todosList.appendChild(card);
  }
}

/**
 * Reset the form back to its default state after adding/editing.
 */
function resetForm() {
  titleInput.value = "";
  descInput.value = "";
  dueInput.value = "";
  personInput.selectedIndex = 0;
  filesInput.value = "";
}

/**
 * Toggle filter state (all vs only open) and re-render.
 * No data changes here; only changes what's visible.
 */
function handleFilterTodos() {
  showOnlyOpen = !showOnlyOpen;

  // Re-render based on current filter+sort state
  renderTodos(getVisibleTodos());

  // Optional: make the button reflect active/inactive state
  if (filterBtn) {
    filterBtn.classList.toggle("btn-primary", showOnlyOpen);
    filterBtn.classList.toggle("btn-outline-secondary", !showOnlyOpen);
    filterBtn.title = showOnlyOpen ? "Showing only open todos" : "Showing all todos";
  }
}

/**
 * Toggle the completed state of one todo, then re-render current view.
 */
function handleMarkDone(todoId) {
  const t = todos.find(x => x.id === todoId);
  if (!t) return;

  t.completed = !t.completed;

  // Important: keep current filter/sort applied
  renderTodos(getVisibleTodos());
}

/**
 * Remove a todo from state, then re-render current view.
 */
function handleDeleteTodo(todoId) {
  todos = todos.filter(x => x.id !== todoId);
  renderTodos(getVisibleTodos());
}

/**
 * Prefill the form with an existing todo for editing.
 * (Next step is storing an editingId so "Add" becomes "Save".)
 */
function handleEditTodo(todoId) {
  const t = todos.find(x => x.id === todoId);
  if (!t) return;

  titleInput.value = t.title;
  descInput.value = t.description || "";
  dueInput.value = t.dueTo || "";
  personInput.value = t.assignee || "";
}

/**
 * Toggle sorting mode and re-render.
 */
function handleSortTodos() {
  sortMode = sortMode === "due" ? "created" : "due";
  renderTodos(getVisibleTodos());

  if (sortBtn) {
    sortBtn.title = sortMode === "due" ? "Sorted by due date" : "Sorted by created date";
  }
}

// ======================
// Helper functions
// ======================

/**
 * Compute the list that should be displayed right now based on UI state.
 * - Starts from the source of truth (todos)
 * - Applies filter
 * - Applies sort
 * Returns a new array so we don't mutate the original order accidentally.
 */
function getVisibleTodos() {
  let list = [...todos];

  // Filter: remove completed todos when enabled
  if (showOnlyOpen) {
    list = list.filter(t => !t.completed);
  }

  // Sort: choose current sort mode
  if (sortMode === "due") {
    // Todos with no due date go to the bottom
    list.sort((a, b) => {
      const ad = a.dueTo ? new Date(a.dueTo).getTime() : Infinity;
      const bd = b.dueTo ? new Date(b.dueTo).getTime() : Infinity;
      return ad - bd;
    });
  } else {
    // Newest created first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return list;
}

// ==============================
// 5. INITIALIZATION
// ==============================

/**
 * App startup: build static UI parts and render initial empty state.
 */
function init() {
  populateAssignees();
  renderTodos(getVisibleTodos());
  resetForm();
}

init();