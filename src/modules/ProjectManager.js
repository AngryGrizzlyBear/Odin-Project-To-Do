import Project from './Project.js';

export default class ProjectManager {
    constructor() {
        this.projects = [];
        this.loadProjects();
    }

    addProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        this.saveProjects();
    }

    getProjects() {
        return this.projects;
    }

    getProjectByName(name) {
        return this.projects.find(project => project.name === name);
    }

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    loadProjects() {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            const parsed = JSON.parse(storedProjects);
            this.projects = parsed.map(p => {
                const project = new Project(p.name);
                // Manually copy todos (which are plain objects)
                project.todos = p.todos || [];
                return project;
            });
        }
    }
}