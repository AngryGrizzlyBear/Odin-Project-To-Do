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
  
  [todoForm, [titleInput, dueDateInput, prioritySelect, addTodoButton]].forEach(el => {
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
  if (manager.getProjects().length === 0) {
    manager.addProject("Default");
    manager.saveProjects();
  }
  let activeProject = manager.getProjects()[0];
  
  function renderActiveTodos() {
    const container = document.getElementById('todo-list');
    if (!activeProject) {
      container.innerHTML = 'Select or create a project to view its todos.';
      return;
    }
  
    renderTodos(activeProject.getTodos(), index => {
      activeProject.deleteTodo(index);
      manager.saveProjects();
  
      // Check again if project still exists after deletion
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
  
    // Reset activeProject if it's the one being deleted
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
      alert("Please create and select a project before adding a ToDo.");
      console.log("No active project selected");
      return;
    }
  
    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;
  
    if (!title || !dueDate) {
      console.log("Missing title or dueDate");
      return;
    }
  
    const newTodo = new Todo(title, '', dueDate, priority);
    console.log("Created todo:", newTodo);
    activeProject.addTodo(newTodo);
    manager.saveProjects();
  
    titleInput.value = '';
    dueDateInput.value = '';
    prioritySelect.selectedIndex = 0;
  
    renderActiveTodos();
    console.log("Todos re-rendered");
  });
  
  
  // ----- Initial Render -----
  renderProjects(manager.getProjects(), handleProjectSelect, handleProjectDelete);
  
  if (!activeProject && manager.getProjects().length > 0) {
    const firstProject = manager.getProjects()[0];
    console.log("Setting active project to:", firstProject.name);
    handleProjectSelect(firstProject.name);
  } else {
    console.log("No projects found or already have active project");
    renderActiveTodos();
  }
  