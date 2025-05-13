import { createProjectListContainer, createTodoListContainer, renderProjects, renderTodos } from "./modules/dom";
import ProjectManager from "./modules/ProjectManager";
console.log(ProjectManager); // It should log a function (the class), not `undefined` or an object


const app = document.getElementById('app') || document.body;

const projectForm = document.createElement('form');

const projectInput = document.createElement('input');
projectInput.type = 'text';
projectInput.placeholder = 'New project name';
projectInput.required = true;

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.textContent = 'Add Project';

projectForm.appendChild(projectInput);
projectForm.appendChild(addButton);


const projectListContainer = createProjectListContainer();
const todoListContainer = createTodoListContainer();

app.appendChild(projectForm);
app.appendChild(projectListContainer);
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

renderProjects(manager.getProjects(), handleProjectSelect);
if (activeProject) renderTodos(activeProject.getTodos());

