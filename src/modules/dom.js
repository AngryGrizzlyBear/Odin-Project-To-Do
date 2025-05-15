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

function renderProjects(projects, onProjectSelect) {
    const container = document.getElementById('project-list');
    if (!container) return;
    container.innerHTML = '';

    if (projects.length === 0) {
        container.textContent = 'No Projects yet.';
        return;
    }

    const fragment = document.createDocumentFragment();
    projects.forEach(project => {
        const btn = document.createElement('button');
        btn.textContent = project.name;
        btn.addEventListener('click', () => onProjectSelect(project.name));
        fragment.appendChild(btn);
    });
    container.appendChild(fragment);
}

function renderTodos(todos, onDelete) {
    const container = document.getElementById('todolist');
    if (!container) return;
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
        todoDiv.appendChild(due);
        todoDiv.appendChild(priority);
        todoDiv.appendChild(deleteBtn);

        container.appendChild(todoDiv);
    });
}

// function renderTodos(todos) {
//     const container = document.getElementById('todo-list');
//     if (!container) return;
//     container.innerHTML = '';

//     if (todos.length === 0) {
//         container.textContent = 'No todos in this project';
//         return;
//     }

//     todos.forEach(todo => {
//         const todoDiv = document.createElement('div');
//         todoDiv.classList.add('todo-item');
//         todoDiv.innerHTML = `
//         <h3>${todo.title}</h3>
//         <p> Due: ${todo.dueDate}</p>
//         <p>Priority: ${todo.priority}</p>
//         `;
//         container.appendChild(todoDiv);
//     });
// }

export {
    createProjectListContainer,
    createTodoListContainer,
    renderProjects,
    renderTodos
};