/* ========================================
   Portfolio Data Layer
   Uses localStorage for project persistence
   ======================================== */

const PortfolioData = (() => {
    const STORAGE_KEY = 'uday_portfolio_projects';
    const ADMIN_KEY = 'uday_admin_password';

    // Default sample projects (shown when no projects exist)
    const defaultProjects = [
        {
            id: '1',
            title: 'Food Delivery App Redesign',
            description: 'A complete UX overhaul of a food delivery app focusing on reducing order time and improving navigation flow.',
            tags: ['UI Design', 'UX Research', 'Mobile'],
            image: '',
            link: '',
            color: '#ff6b35',
            createdAt: Date.now()
        },
        {
            id: '2',
            title: 'Student Dashboard UI',
            description: 'Designed a clean, intuitive dashboard for university students to track assignments, grades, and schedule.',
            tags: ['Dashboard', 'Web Design', 'Figma'],
            image: '',
            link: '',
            color: '#6366f1',
            createdAt: Date.now() - 1000
        },
        {
            id: '3',
            title: 'E-Commerce Landing Page',
            description: 'A modern, conversion-focused landing page design for a sneaker brand with micro-interactions.',
            tags: ['Landing Page', 'Visual Design', 'Prototype'],
            image: '',
            link: '',
            color: '#22c55e',
            createdAt: Date.now() - 2000
        },
        {
            id: '4',
            title: 'Weather App Concept',
            description: 'Minimalist weather application with beautiful gradients that change based on current conditions.',
            tags: ['Mobile App', 'UI Design', 'Concept'],
            image: '',
            link: '',
            color: '#3b82f6',
            createdAt: Date.now() - 3000
        }
    ];

    function getProjects() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with defaults on first load
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
        return defaultProjects;
    }

    function saveProjects(projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    function addProject(project) {
        const projects = getProjects();
        project.id = Date.now().toString();
        project.createdAt = Date.now();
        projects.unshift(project);
        saveProjects(projects);
        return project;
    }

    function updateProject(id, updatedData) {
        const projects = getProjects();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updatedData };
            saveProjects(projects);
            return projects[index];
        }
        return null;
    }

    function deleteProject(id) {
        const projects = getProjects().filter(p => p.id !== id);
        saveProjects(projects);
        return projects;
    }

    function getProject(id) {
        return getProjects().find(p => p.id === id) || null;
    }

    // Admin authentication
    function setupAdmin(password) {
        localStorage.setItem(ADMIN_KEY, btoa(password));
    }

    function verifyAdmin(password) {
        const stored = localStorage.getItem(ADMIN_KEY);
        if (!stored) {
            // First time — set default password
            setupAdmin('uday2026');
            return password === 'uday2026';
        }
        return btoa(password) === stored;
    }

    function changePassword(oldPass, newPass) {
        if (verifyAdmin(oldPass)) {
            setupAdmin(newPass);
            return true;
        }
        return false;
    }

    function isFirstSetup() {
        return !localStorage.getItem(ADMIN_KEY);
    }

    return {
        getProjects,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        verifyAdmin,
        changePassword,
        isFirstSetup
    };
})();
