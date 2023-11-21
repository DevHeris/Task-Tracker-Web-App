import "./css/style.css";

// Get references to HTML elements
const taskForm = document.getElementById("task-form");
const inputElement = document.getElementById("new-task");
const addBtn = document.getElementById("submit");
const taskList = document.getElementById("task-list");
const TotaltaskCount = document.getElementById("total-task-count");
const completedTaskCount = document.getElementById("completed-task-count");

// Function to add a task to the DOM
const addTaskToDOM = (event) => {
  event.preventDefault();
  const task = inputElement.value;

  createTaskList(task); // Create a new task list item
  addTaskToStorage(task); // Add the task to local storage
  updateTaskCount(); // Update the task counts

  inputElement.value = ""; // Clear the input field after adding the task
};

// Function to get tasks from local storage
const getTasksFromStorage = () => {
  let tasksFromStorage;

  tasksFromStorage = localStorage.getItem("tasks");

  // If there are no tasks in storage, initialize an empty array
  tasksFromStorage === null
    ? (tasksFromStorage = [])
    : (tasksFromStorage = JSON.parse(tasksFromStorage));

  return tasksFromStorage;
};

// Function to add a task to local storage
const addTaskToStorage = (task) => {
  let tasksFromStorage = getTasksFromStorage();

  tasksFromStorage.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasksFromStorage));
};

// Function to remove a task from local storage
const removeTaskFromStorage = (task) => {
  let tasksFromStorage = getTasksFromStorage();
  const taskToRemoveIndex = tasksFromStorage.findIndex((tsk) => tsk === task);

  if (taskToRemoveIndex !== -1) {
    tasksFromStorage.splice(taskToRemoveIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasksFromStorage));
    return;
  }
};

// Function to get completed tasks from local storage
const getCompletedTasksFromStorage = () => {
  let completedTasksFromStorage;

  completedTasksFromStorage = localStorage.getItem("completed tasks");

  // If there are no completed tasks in storage, initialize an empty array
  completedTasksFromStorage === null
    ? (completedTasksFromStorage = [])
    : (completedTasksFromStorage = JSON.parse(completedTasksFromStorage));

  return completedTasksFromStorage;
};

// Function to add a completed task to local storage
const addCompletedTaskToStorage = (task) => {
  let completedTasksFromStorage = getCompletedTasksFromStorage();

  completedTasksFromStorage.push(task);

  localStorage.setItem(
    "completed tasks",
    JSON.stringify(completedTasksFromStorage)
  );
};

// Function to remove a completed task from local storage
const removeCompletedTaskFromStorage = (task) => {
  let completedTasksFromStorage = getCompletedTasksFromStorage();
  const taskToRemoveIndex = completedTasksFromStorage.findIndex(
    (tsk) => tsk === task
  );

  if (taskToRemoveIndex !== -1) {
    completedTasksFromStorage.splice(taskToRemoveIndex, 1);
    localStorage.setItem(
      "completed tasks",
      JSON.stringify(completedTasksFromStorage)
    );
    return;
  }
};

// Function to render tasks to the DOM
const rendertasksToDOM = () => {
  const tasksFromStorage = getTasksFromStorage();
  tasksFromStorage.forEach((task) => {
    createTaskList(task);
  });
};

// Function to create a task list item
const createTaskList = (task) => {
  const li = document.createElement("li");
  const span = document.createElement("span");

  span.textContent = task;
  li.appendChild(span);

  const statusBtn = document.createElement("button");
  statusBtn.classList.add("toggle-completed");
  statusBtn.textContent = "Complete";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  li.appendChild(statusBtn);
  li.appendChild(deleteBtn);

  // Check if the task is completed and update the UI accordingly
  const completedTasksFromStorage = getCompletedTasksFromStorage();
  if (completedTasksFromStorage.includes(task)) {
    li.classList.add("completed");
    statusBtn.textContent = "Undo";
  }

  taskList.appendChild(li);
};

// Function to update the task counts on the UI
const updateTaskCount = () => {
  const tasksFromStorage = getTasksFromStorage();
  const totalTask = tasksFromStorage.length;

  TotaltaskCount.innerHTML = totalTask;

  const completedTasks = document.querySelectorAll(".completed");

  completedTaskCount.innerHTML = completedTasks.length;
};

// Function to handle task editing (completion, deletion)
const editTask = (event) => {
  const task = event.target.closest("li");
  if (event.target.classList.contains("toggle-completed")) {
    task.classList.toggle("completed");
    if (task.classList.contains("completed")) {
      task.querySelector(".toggle-completed").textContent = "Undo";
      addCompletedTaskToStorage(task.firstElementChild.textContent);
    } else {
      task.querySelector(".toggle-completed").textContent = "Complete";
      removeCompletedTaskFromStorage(task.firstElementChild.textContent);
    }

    updateTaskCount();
    return;
  }

  if (event.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this task?")) {
      task.remove();
      removeTaskFromStorage(task.firstElementChild.textContent);
      updateTaskCount();
    }
  }
};

// Event listeners
taskForm.addEventListener("submit", addTaskToDOM);
taskList.addEventListener("click", editTask);
document.addEventListener("DOMContentLoaded", rendertasksToDOM);
document.addEventListener("DOMContentLoaded", updateTaskCount);
