import { createProjectListContainer, createTodoListContainer, renderProjects, renderTodos } from "./modules/dom";
import ProjectManager from "./modules/ProjectManager";
import Todo from './modules/Todo';

// console.log(ProjectManager); // It should log a function (the class), not `undefined` or an object


const app = document.getElementById('app') || document.body;

const projectForm = document.createElement('form');
const projectInput = document.createElement('input');
const addButton = document.createElement('button');
projectInput.type = 'text';
projectInput.placeholder = 'New project name';
projectInput.required = true;
addButton.type = 'submit';
addButton.textContent = 'Add Project';
projectForm.appendChild(projectInput);
projectForm.appendChild(addButton);


const projectListContainer = createProjectListContainer();
const todoListContainer = createTodoListContainer();
const todoForm = document.createElement('form');
const titleInput = document.createElement('input');
const dueDateInput = document.createElement('input');
const prioritySelect = document.createElement('select');
const addTodoButton = document.createElement('button');
['Low', 'Medium', 'High'].forEach(level => {
    const option = document.createElement('option');
    option.value = level.toLowerCase();
    option.textContent = level;
    prioritySelect.appendChild(option);
});
titleInput.type = 'text';
titleInput.placeholder = 'ToDo title';
titleInput.required = true;
dueDateInput.type = 'date';
dueDateInput.required = true;
addTodoButton.type = 'submit';
addTodoButton.textContent = 'Add Todo';

todoForm.appendChild(titleInput);
todoForm.appendChild(dueDateInput);
todoForm.appendChild(prioritySelect);
todoForm.appendChild(addTodoButton);

app.appendChild(projectForm);
app.appendChild(projectListContainer);
app.appendChild(todoForm);
app.appendChild(todoListContainer);

const manager = new ProjectManager();
let activeProject = manager.getProjects()[0];

function handleProjectSelect(projectName) {
    activeProject = manager.getProjectByName(projectName);
    if (activeProject) {
        renderTodos(activeProject.getTodos());
    }
}

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = projectInput.value.trim();
    if (name) {
        manager.addProject(name);
        projectInput.value = '';
        projectInput.focus();

        activeProject = manager.getProjectByName(name);
        renderProjects(manager.getProjects(), handleProjectSelect);
        renderTodos(activeProject.getTodos());
    }
});

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeProject) return;

    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;

    if (!title || !dueDate) return;

    const newTodo = new Todo(title, '', dueDate, priority);
    activeProject.addTodo(newTodo);

    manager.saveProjects();

    titleInput.value = '';
    dueDateInput.value = '';
    prioritySelect.selectedIndex = 0;

    renderTodos(activeProject.getTodos());
});

renderProjects(manager.getProjects(), handleProjectSelect);
if (activeProject) renderTodos(activeProject.getTodos());

