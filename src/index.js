import { createProjectListContainer, createTodoListContainer, renderProjects, renderTodos } from "./dom";
import ProjectManager from "./ProjectManager";

const app = document.getElementById('app') || document.body;

const projectListContainer = createProjectListContainer();
const todoListContainer = createTodoListContainer();

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

renderProjects(manager.getProjects(), handleProjectSelect);
if (activeProject) renderTodos(activeProject.getTodos());

