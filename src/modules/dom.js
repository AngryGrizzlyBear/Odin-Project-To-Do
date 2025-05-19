function createProjectListContainer() {
    const container = document.createElement('div');
    container.id = 'project-list';
    return container;
}

function createTodoListContainer() {
    const container = document.createElement('div');
    container.id = 'todo-list';
    return container;
}

function renderProjects(projects, onProjectSelect, onProjectDelete) {
    const container = document.getElementById('project-list');
    if (!container) return;
    container.innerHTML = '';

    if (projects.length === 0) {
        container.textContent = 'No Projects yet.';
        return;
    }

    const fragment = document.createDocumentFragment();
    projects.forEach((project, index) => {
      const projectDiv = document.createElement('div');
  
      const btn = document.createElement('button');
      btn.textContent = project.name;
      btn.addEventListener('click', () => onProjectSelect(project.name));
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        if (typeof onProjectDelete === 'function') onProjectDelete(project.name);
      });
  
      projectDiv.appendChild(btn);
      projectDiv.appendChild(deleteBtn);
      fragment.appendChild(projectDiv);
    });
    container.appendChild(fragment);
  }

function renderTodos(todos, onDelete) {
    const container = document.getElementById('todo-list');
    if (!container) {
        console.warn('Todo list container not found');
        return;
    }
    console.log('Rendering todos:', todos); // ← Add this

    container.innerHTML = '';

    if (todos.length === 0) {
        container.textContent = 'No todos in this project';
        return;
    }

    todos.forEach((todo, index) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');

        const title = document.createElement('h3');
        title.textContent = todo.title;

        const desc = document.createElement('p');
        desc.textContent = `description: ${todo.description}`
      

        const due = document.createElement('p');
        due.textContent = `Due: ${todo.dueDate}`;

        const priority = document.createElement('p');
        priority.textContent = `Priority: ${todo.priority}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (typeof onDelete === 'function') onDelete(index);
        });

        todoDiv.appendChild(title);
          todoDiv.appendChild(desc);
        todoDiv.appendChild(due);
        todoDiv.appendChild(priority);
        todoDiv.appendChild(deleteBtn);
        container.appendChild(todoDiv);
    });
}

export {
    createProjectListContainer,
    createTodoListContainer,
    renderProjects,
    renderTodos
};