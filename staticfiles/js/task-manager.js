// Task Manager JavaScript

class TaskManager {
    constructor() {
        this.initializeEventListeners();
        this.setupFilterAndSort();
        this.setupTaskActions();
        this.setupDragAndDrop();
    }

    initializeEventListeners() {
        // Task status toggle
        document.querySelectorAll('.task-status-toggle').forEach(button => {
            button.addEventListener('click', (e) => this.handleStatusToggle(e));
        });

        // Task priority change
        document.querySelectorAll('.task-priority-select').forEach(select => {
            select.addEventListener('change', (e) => this.handlePriorityChange(e));
        });

        // Search functionality
        const searchInput = document.getElementById('task-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => this.handleSearch(e), 300));
        }
    }

    setupFilterAndSort() {
        // Filter button click handler
        const filterButton = document.querySelector('.filter-button');
        if (filterButton) {
            filterButton.addEventListener('click', () => {
                const filterMenu = document.getElementById('filter-menu');
                filterMenu.classList.toggle('hidden');
            });
        }

        // Sort button click handler
        const sortButton = document.querySelector('.sort-button');
        if (sortButton) {
            sortButton.addEventListener('click', () => {
                const sortMenu = document.getElementById('sort-menu');
                sortMenu.classList.toggle('hidden');
            });
        }

        // Apply filters
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', (e) => this.applyFilter(e));
        });

        // Apply sort
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => this.applySort(e));
        });
    }

    setupTaskActions() {
        // Delete confirmation
        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!confirm('Are you sure you want to delete this task?')) {
                    e.preventDefault();
                }
            });
        });

        // Quick edit functionality
        document.querySelectorAll('.quick-edit-task').forEach(button => {
            button.addEventListener('click', (e) => this.handleQuickEdit(e));
        });
    }

    setupDragAndDrop() {
        const taskItems = document.querySelectorAll('.task-item');
        const taskLists = document.querySelectorAll('.task-list');

        taskItems.forEach(task => {
            task.setAttribute('draggable', true);
            task.addEventListener('dragstart', (e) => this.handleDragStart(e));
            task.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        taskLists.forEach(list => {
            list.addEventListener('dragover', (e) => this.handleDragOver(e));
            list.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    async handleStatusToggle(e) {
        const taskId = e.currentTarget.dataset.taskId;
        const currentStatus = e.currentTarget.dataset.status;
        const newStatus = this.getNextStatus(currentStatus);

        try {
            const response = await fetch(`/tasks/${taskId}/update-status/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken(),
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                this.updateTaskStatusUI(e.currentTarget, newStatus);
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }

    async handlePriorityChange(e) {
        const taskId = e.currentTarget.dataset.taskId;
        const newPriority = e.currentTarget.value;

        try {
            const response = await fetch(`/tasks/${taskId}/update-priority/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken(),
                },
                body: JSON.stringify({ priority: newPriority }),
            });

            if (response.ok) {
                this.updateTaskPriorityUI(e.currentTarget, newPriority);
            }
        } catch (error) {
            console.error('Error updating task priority:', error);
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll('.task-item');

        tasks.forEach(task => {
            const title = task.querySelector('.task-title').textContent.toLowerCase();
            const description = task.querySelector('.task-description').textContent.toLowerCase();
            const matches = title.includes(searchTerm) || description.includes(searchTerm);
            task.style.display = matches ? '' : 'none';
        });
    }

    applyFilter(e) {
        const filterType = e.currentTarget.dataset.filter;
        const filterValue = e.currentTarget.dataset.value;
        const tasks = document.querySelectorAll('.task-item');

        tasks.forEach(task => {
            const matches = task.dataset[filterType] === filterValue;
            task.style.display = filterValue === 'all' || matches ? '' : 'none';
        });
    }

    applySort(e) {
        const sortType = e.currentTarget.dataset.sort;
        const taskList = document.querySelector('.task-list');
        const tasks = Array.from(document.querySelectorAll('.task-item'));

        tasks.sort((a, b) => {
            const aValue = a.dataset[sortType];
            const bValue = b.dataset[sortType];
            return this.compareValues(aValue, bValue);
        });

        tasks.forEach(task => taskList.appendChild(task));
    }

    handleQuickEdit(e) {
        const taskId = e.currentTarget.dataset.taskId;
        const taskElement = document.querySelector(`#task-${taskId}`);
        const title = taskElement.querySelector('.task-title').textContent;
        const description = taskElement.querySelector('.task-description').textContent;

        // Show quick edit modal
        const modal = document.getElementById('quick-edit-modal');
        const titleInput = modal.querySelector('#quick-edit-title');
        const descriptionInput = modal.querySelector('#quick-edit-description');

        titleInput.value = title;
        descriptionInput.value = description;
        modal.dataset.taskId = taskId;
        modal.classList.remove('hidden');
    }

    // Drag and Drop handlers
    handleDragStart(e) {
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.currentTarget.id);
    }

    handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    async handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = e.currentTarget.dataset.status;
        const taskElement = document.getElementById(taskId);

        if (taskElement && newStatus) {
            try {
                const response = await fetch(`/tasks/${taskId}/update-status/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCsrfToken(),
                    },
                    body: JSON.stringify({ status: newStatus }),
                });

                if (response.ok) {
                    e.currentTarget.appendChild(taskElement);
                    this.updateTaskStatusUI(taskElement, newStatus);
                }
            } catch (error) {
                console.error('Error updating task status:', error);
            }
        }
    }

    // Utility functions
    getNextStatus(currentStatus) {
        const statusFlow = {
            'Todo': 'In Progress',
            'In Progress': 'Completed',
            'Completed': 'Todo'
        };
        return statusFlow[currentStatus] || 'Todo';
    }

    updateTaskStatusUI(element, newStatus) {
        const statusBadge = element.querySelector('.status-badge');
        const statusIcon = element.querySelector('.status-icon');
        
        // Update status text and classes
        statusBadge.textContent = newStatus;
        statusBadge.className = `status-badge ${this.getStatusClass(newStatus)}`;
        
        // Update icon
        statusIcon.className = `status-icon ${this.getStatusIcon(newStatus)}`;
    }

    updateTaskPriorityUI(element, newPriority) {
        const priorityBadge = element.closest('.task-item').querySelector('.priority-badge');
        priorityBadge.textContent = newPriority;
        priorityBadge.className = `priority-badge ${this.getPriorityClass(newPriority)}`;
    }

    getStatusClass(status) {
        const statusClasses = {
            'Todo': 'bg-gray-100 text-gray-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'Completed': 'bg-green-100 text-green-800'
        };
        return statusClasses[status] || statusClasses['Todo'];
    }

    getStatusIcon(status) {
        const statusIcons = {
            'Todo': 'fas fa-clock',
            'In Progress': 'fas fa-spinner fa-spin',
            'Completed': 'fas fa-check'
        };
        return statusIcons[status] || statusIcons['Todo'];
    }

    getPriorityClass(priority) {
        const priorityClasses = {
            'High': 'bg-red-100 text-red-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'Low': 'bg-green-100 text-green-800'
        };
        return priorityClasses[priority] || priorityClasses['Low'];
    }

    getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    compareValues(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize TaskManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
