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

const addBtn = document.getElementById("addBtn");
const todosList = document.getElementById("todosList");

const filterBtn = document.getElementById("filterBtn");
const sortBtn = document.getElementById("sortBtn");

// ==============================
// 2. APPLICATION STATE
// ==============================

let todos = []; // will store all todo objects

// ==============================
// 3. EVENT LISTENERS
// ==============================

addBtn?.addEventListener("click", handleAddTodo);
filterBtn?.addEventListener("click", handleFilterTodos);
sortBtn?.addEventListener("click", handleSortTodos);

// ==============================
// 4. FUNCTIONS (EMPTY FOR NOW)
// ==============================

function handleAddTodo() {
    const title = titleInput.value.trim();
    const descripion  =  descInput.value.trim;
    const dueTo = dueInput.value;
    const assigne = personInput.value.trim;
    const attachmment = filesInput.files? filesInput.files.length:0;
    if(!title) { 
         alert("Title is mandatory");
    return;
    }
  // Step 2:
  //Read form values
  //+Create todo object
  // - Push into todos array
  // - Call renderTodos()
}

function handleFilterTodos() {
  // Step 4:
  // - Toggle filter state
  // - Re-render todos
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
  // App startup logic (later)
  renderTodos();
}

init();
