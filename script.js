/*
  My Todo App
  Step 1: JavaScript Skeleton
  ---------------------------
  This file only defines:
  - DOM references
  - Data structure
  - Empty functions
  - Event bindings (no logic yet)
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


const assignees = ["Simon", "Roman", "Johan"];
// ==============================
// 2. APPLICATION STATE
// ==============================

let todos = []; // will store all todo objects
let filteredTodos = [];

// ==============================
// 3. EVENT LISTENERS
// ==============================

addButton?.addEventListener("click", handleAddTodo);
filterBtn?.addEventListener("click", handleFilterTodos);
sortBtn?.addEventListener("click", handleSortTodos);
/*editBtn?.addEventListener("click", handleeditTodo);
deleteBtn?.addEventListener("click", handleDeleteTodd);
markDone?.addEventListener("click", handleMarkDone);*/

// ==============================
// 4. FUNCTIONS (EMPTY FOR NOW)
// ==============================
function populateAssignees() {
  const select = document.getElementById("personInput");
  if (!select) return;

  // Reset default option
  select.innerHTML = `<option value="">-- Select Person (Optional) --</option>`;

  assignees.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function handleAddTodo() {
     //+Read form values
    const title = titleInput.value.trim();
    const description  =  descInput.value.trim();
    const dueTo = dueInput.value;
    const assignee = personInput.value;
    const attachment = filesInput.files? filesInput.files.length:0;
    if(!title) { 
         alert("Title is mandatory");
    return;
    }  
    //+Create todo object
    const todo = {
      id: crypto.randomUUID(),
      title,
      description,
      dueTo,
      assignee,
      attachment,
      createdAt: new Date().toString(),
      completed: false
    }
  // - Push into todos array
  todos.unshift(todo);
  renderTodos();
  resetForm();
}

function renderTodos(list = todos) {
  if (!todosList) return;

  // 1) Clear current UI
  todosList.innerHTML = "";

  // 2) If empty, show placeholder
  if (!list.length) {
    todosList.innerHTML = `<div class="text-secondary">No todos yet.</div>`;
    return;
  }

  // 3) Build UI for each todo
  for (const todo of list) {
    const card = document.createElement("div");
    card.className =
      "border rounded-3 p-3 bg-white d-flex justify-content-between align-items-start mb-2";

    const left = document.createElement("div");
    left.className = "me-3 flex-grow-1";

    const titleEl = document.createElement("div");
    titleEl.className = "fw-semibold";
    titleEl.textContent = todo.title;
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

    const right = document.createElement("div");
    right.className = "text-end";

    const created = document.createElement("div");
    created.className = "small text-secondary mb-2";
    created.textContent = `Created: ${todo.createdAt.slice(0, 10)}`;
    right.appendChild(created);

    // Simple buttons (we'll wire logic next)
    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const completeBtn = document.createElement("button");
    completeBtn.title = "mark done"
    completeBtn.className = "btn btn-outline-success btn-sm";
    completeBtn.innerHTML = todo.completed ? 
      `<i class="bi bi-check-circle-fill text-success"></i>` : `<i class="bi bi-circle"></i>`;
    completeBtn.addEventListener("click", () => handleMarkDone(todo.id));


    const editBtn = document.createElement("button");
    editBtn.title = "edit"
    editBtn.className = "btn btn-outline-primary btn-sm";
    editBtn.innerHTML = `<i class="bi bi-pencil"></i>`;
    editBtn.addEventListener("click", () => handleEditTodo(todo.id));


    const deleteBtn = document.createElement("button");
    deleteBtn.title = "delete"
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

function resetForm(){
  titleInput.value = "";
  descInput.value = "";
  dueInput.value = "";
  personInput.selectedIndex = 0;
  filesInput.value = "";
}

function handleFilterTodos() {
  // Step 4:
  // - Toggle filter state
  // - Re-render todos
}

function handleMarkDone(todoId) {
  const t = todos.find(x => x.id === todoId);
  if (!t) return;
  t.completed = !t.completed;
  renderTodos();
}

function handleDeleteTodo(todoId) {
  todos = todos.filter(x => x.id !== todoId);
  renderTodos();
}

function handleEditTodo(todoId) {
  const t = todos.find(x => x.id === todoId);
  if (!t) return;

  titleInput.value = t.title;
  descInput.value = t.description || "";
  dueInput.value = t.dueTo || "";
  personInput.value = t.assignee || "";
}


function handleSortTodos() {
  // Step 5:
  // - Sort todos by due date
  // - Re-render todos
}

// ==============================
// 5. INITIALIZATION
// ==============================

function init() {
  populateAssignees();
  renderTodos();
  resetForm()
}

init();
