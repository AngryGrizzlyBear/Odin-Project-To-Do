import {
  createProjectListContainer,
  createTodoListContainer,
  renderProjects,
  renderTodos
} from "./modules/dom";
import ProjectManager from "./modules/ProjectManager";
import Todo from './modules/Todo';

// ----- DOM Setup -----
const app = document.getElementById('app') || document.body;

const projectForm = document.createElement('form');
projectForm.id = 'project-form';
const projectInput = document.createElement('input');
projectInput.type = 'text';
projectInput.placeholder = 'New project name';
projectInput.required = true;

const addProjectButton = document.createElement('button');
addProjectButton.type = 'submit';
addProjectButton.textContent = 'Add Project';

projectForm.appendChild(projectInput);
projectForm.appendChild(addProjectButton);

const todoForm = document.createElement('form');
todoForm.id = 'todo-form';
const titleInput = document.createElement('input');
titleInput.type = 'text';
titleInput.placeholder = 'ToDo title';
titleInput.required = true;

const descriptionInput = document.createElement('textarea');
descriptionInput.placeholder = 'Description';
descriptionInput.rows = 3;
descriptionInput.required = false;

const dueDateInput = document.createElement('input');
dueDateInput.type = 'date';
dueDateInput.required = true;

const prioritySelect = document.createElement('select');
['Low', 'Medium', 'High'].forEach(level => {
  const option = document.createElement('option');
  option.value = level.toLowerCase();
  option.textContent = level;
  prioritySelect.appendChild(option);
});

const addTodoButton = document.createElement('button');
addTodoButton.type = 'submit';
addTodoButton.textContent = 'Add Todo';

[todoForm, [titleInput, descriptionInput, dueDateInput, prioritySelect, addTodoButton]].forEach(el => {
  if (Array.isArray(el)) el.forEach(item => todoForm.appendChild(item));
});

const projectListContainer = createProjectListContainer();
const todoListContainer = createTodoListContainer();

app.appendChild(projectForm);
app.appendChild(projectListContainer);
app.appendChild(todoForm);
app.appendChild(todoListContainer);

// ----- App Logic -----
const manager = new ProjectManager();
let activeProject = manager.getProjects()[0];

// ✅ NEW: Helper function to enable/disable the todo form
function setTodoFormEnabled(enabled) {
  [titleInput, descriptionInput, dueDateInput, prioritySelect, addTodoButton].forEach(el => {
    el.disabled = !enabled;
  });
}

// ✅ Initially disable if no project exists
setTodoFormEnabled(!!activeProject);

function renderActiveTodos() {
  const container = document.getElementById('todo-list');

  if (!activeProject) {
    setTodoFormEnabled(false);
    container.innerHTML = 'Select or create a project to view its todos.';
    return;
  }

  setTodoFormEnabled(true);

  renderTodos(activeProject.getTodos(), index => {
    activeProject.deleteTodo(index);
    manager.saveProjects();

    // ✅ If current project still exists, re-render, otherwise clear it
    if (manager.getProjectByName(activeProject.name)) {
      renderActiveTodos();
    } else {
      activeProject = null;
      renderActiveTodos();
    }
  });
}

function handleProjectSelect(projectName) {
  activeProject = manager.getProjectByName(projectName);
  renderActiveTodos();
}

function handleProjectDelete(projectName) {
  manager.projects = manager.projects.filter(p => p.name !== projectName);
  manager.saveProjects();

  if (activeProject && activeProject.name === projectName) {
    activeProject = manager.getProjects()[0] || null;
  }

  renderProjects(manager.getProjects(), handleProjectSelect, handleProjectDelete);
  renderActiveTodos();
}

// ----- Event Listeners -----
projectForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = projectInput.value.trim();
  if (!name) return;
  if (manager.getProjectByName(name)) {
    alert('Project already exists!');
    return;
  }

  manager.addProject(name);
  manager.saveProjects();
  projectInput.value = '';
  projectInput.focus();

  activeProject = manager.getProjectByName(name);
  renderProjects(manager.getProjects(), handleProjectSelect, handleProjectDelete);
  renderActiveTodos();
});

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log('Submit event fired');

  if (!activeProject) {
    console.log("No active project selected");
    return;
  }

  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;
  const description = descriptionInput.value.trim();

  console.log("Inputs:", { title, dueDate, priority });

  if (!title || !dueDate) {
    console.log("Missing title or dueDate");
    return;
  }

  const newTodo = new Todo(title, description, dueDate, priority);
  console.log("Created todo:", newTodo);
  activeProject.addTodo(newTodo);
  manager.saveProjects();

  titleInput.value = '';
  dueDateInput.value = '';
  descriptionInput.value = '';
  prioritySelect.selectedIndex = 0;

  renderActiveTodos();
  console.log("Todos re-rendered");
});

// ----- Initial Render -----
renderProjects(manager.getProjects(), handleProjectSelect, handleProjectDelete);
renderActiveTodos();
