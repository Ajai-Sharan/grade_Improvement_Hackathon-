// Local Storage Keys
const STORAGE_KEY = "todoCategories";

// Elements
const categoryContainer = document.getElementById("category-container");
const taskModal = document.getElementById("task-modal");
const taskInput = document.getElementById("task-input");
const saveTaskBtn = document.getElementById("save-task");
const closeModalBtn = document.getElementById("close-modal");
let currentCategory = null;
let currentTaskId = null;

// Load data from localStorage on page load
document.addEventListener("DOMContentLoaded", loadCategories);

// Add Category
document.getElementById("add-category").addEventListener("click", () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName) {
        const categories = getCategories();
        categories.push({ name: categoryName, tasks: [] });
        saveCategories(categories);
        renderCategories();
    }
});

// Open Task Modal
function openTaskModal(category, taskId = null) {
    currentCategory = category;
    currentTaskId = taskId;

    if (taskId !== null) {
        taskInput.value = getCategories()[category].tasks[taskId];
    } else {
        taskInput.value = "";
    }

    taskModal.style.display = "flex";
}

// Close Modal
closeModalBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
});

// Save Task
saveTaskBtn.addEventListener("click", () => {
    const taskValue = taskInput.value.trim();
    if (!taskValue) return;

    const categories = getCategories();
    if (currentTaskId !== null) {
        categories[currentCategory].tasks[currentTaskId] = taskValue;
    } else {
        categories[currentCategory].tasks.push(taskValue);
    }

    saveCategories(categories);
    renderCategories();
    taskModal.style.display = "none";
});

// Delete Task
function deleteTask(category, taskId) {
    const categories = getCategories();
    categories[category].tasks.splice(taskId, 1);
    saveCategories(categories);
    renderCategories();
}

// Drag and Drop Logic
function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.taskId);
    e.dataTransfer.setData("category-id", e.target.dataset.categoryId);
}

function handleDrop(e, categoryId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const sourceCategoryId = e.dataTransfer.getData("category-id");

    const categories = getCategories();
    const task = categories[sourceCategoryId].tasks.splice(taskId, 1)[0];
    categories[categoryId].tasks.push(task);

    saveCategories(categories);
    renderCategories();
}

function handleDragOver(e) {
    e.preventDefault();
}

// Render Categories
function renderCategories() {
    categoryContainer.innerHTML = "";
    const categories = getCategories();

    categories.forEach((category, categoryId) => {
        const categoryEl = document.createElement("div");
        categoryEl.classList.add("category");
        categoryEl.innerHTML = `
            <h3>${category.name}</h3>
            <button onclick="openTaskModal(${categoryId})">Add Task</button>
        `;

        // Render Tasks
        category.tasks.forEach((task, taskId) => {
            const taskEl = document.createElement("div");
            taskEl.classList.add("task");
            taskEl.setAttribute("draggable", true);
            taskEl.dataset.taskId = taskId;
            taskEl.dataset.categoryId = categoryId;
            taskEl.textContent = task;

            taskEl.addEventListener("dragstart", handleDragStart);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => deleteTask(categoryId, taskId));
            taskEl.appendChild(deleteBtn);

            categoryEl.appendChild(taskEl);
        });

        categoryEl.addEventListener("dragover", handleDragOver);
        categoryEl.addEventListener("drop", (e) => handleDrop(e, categoryId));

        categoryContainer.appendChild(categoryEl);
    });
}

// Local Storage Helper Functions
function getCategories() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCategories(categories) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

// Load Categories on Page Load
function loadCategories() {
    renderCategories();
}
