const taskForm = document.querySelector('#frmTask');
const prioritySelect = document.querySelector('#selPriority');
const deadlineInput = document.querySelector('#datDeadline');
const taskTextArea = document.querySelector('#txtTask');
const tasksContainer = document.querySelector('#tasks');

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const priority = prioritySelect.value;
    const deadline = deadlineInput.value;
    const taskText = taskTextArea.value;

    let priorityClass;
    switch (priority) {
        case 'high':
            priorityClass = 'priority--high';
            break;
        case 'low':
            priorityClass = 'priority--low';
            break;
        default:
            priorityClass = 'priority--normal';
    }

    const newTaskHTML = `
        <div class="task">
            <span class="priority ${priorityClass} material-icons">assignment</span>
            <p class="tasktext">${taskText} ${deadline ? `<span class="deadline">(deadline: ${deadline})</span>` : ''}</p>
            <span class="complete material-icons">more_horiz</span>
        </div>
    `;

    tasksContainer.innerHTML += newTaskHTML;

    prioritySelect.value = 'normal';
    deadlineInput.value = '';
    taskTextArea.value = '';
    event.preventDefault();
});

tasksContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('complete')) {
        const task = event.target.closest('.task');
        task.classList.toggle('complete');
        event.target.classList.toggle('done');
    }
});
