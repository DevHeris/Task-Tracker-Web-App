const taskForm = document.getElementById("task-form");
const inputElement = document.getElementById("new-task");
const addBtn = document.getElementById("submit");
const taskList = document.getElementById("task-list");
const TotaltaskCount = document.getElementById("total-task-count");
const completedTaskCount = document.getElementById("completed-task-count");

const addTaskToDOM = (event) => {
  event.preventDefault();
  const task = inputElement.value;

  createTaskList(task);

  addTaskToStorage(task);

  updateTaskCount();

  inputElement.value = "";
};

const getTasksFromStorage = () => {
  let tasksFromStorage;

  tasksFromStorage = localStorage.getItem("tasks");

  tasksFromStorage === null
    ? (tasksFromStorage = [])
    : (tasksFromStorage = JSON.parse(tasksFromStorage));

  return tasksFromStorage;
};

const addTaskToStorage = (task) => {
  let tasksFromStorage = getTasksFromStorage();

  tasksFromStorage.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasksFromStorage));
};

const removeTaskFromStorage = (task) => {
  let tasksFromStorage = getTasksFromStorage();
  const taskToRemoveIndex = tasksFromStorage.findIndex((tsk) => tsk === task);

  if (taskToRemoveIndex !== -1) {
    tasksFromStorage.splice(taskToRemoveIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasksFromStorage));
    return;
  }
};

const getCompletedTasksFromStorage = () => {
  let completedTasksFromStorage;

  completedTasksFromStorage = localStorage.getItem("completed tasks");

  completedTasksFromStorage === null
    ? (completedTasksFromStorage = [])
    : (completedTasksFromStorage = JSON.parse(completedTasksFromStorage));

  return completedTasksFromStorage;
};

const addCompletedTaskToStorage = (task) => {
  let completedTasksFromStorage = getCompletedTasksFromStorage();

  completedTasksFromStorage.push(task);

  localStorage.setItem(
    "completed tasks",
    JSON.stringify(completedTasksFromStorage)
  );
};

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

const rendertasksToDOM = () => {
  const tasksFromStorage = getTasksFromStorage();
  tasksFromStorage.forEach((task) => {
    createTaskList(task);
  });
};

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

  const completedTasksFromStorage = getCompletedTasksFromStorage();
  if (completedTasksFromStorage.includes(task)) {
    li.classList.add("completed");
    statusBtn.textContent = "Undo";
  }

  taskList.appendChild(li);
};

const updateTaskCount = () => {
  const tasksFromStorage = getTasksFromStorage();
  const totalTask = tasksFromStorage.length;

  TotaltaskCount.innerHTML = totalTask;

  const completedTasks = document.querySelectorAll(".completed");

  completedTaskCount.innerHTML = completedTasks.length;
};

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

taskForm.addEventListener("submit", addTaskToDOM);
taskList.addEventListener("click", editTask);
document.addEventListener("DOMContentLoaded", rendertasksToDOM);
document.addEventListener("DOMContentLoaded", updateTaskCount);
