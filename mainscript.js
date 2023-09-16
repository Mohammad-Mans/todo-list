let idCount = 0;
let taskCount = 0;

function updateTaskCount() {
  taskCount = document.querySelectorAll('tbody tr').length;
  document.getElementById('task-count').textContent = taskCount;
}


function saveTasksToLocalStorage() {
  const tasks = [];
  let rows = document.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    let id = row.querySelector('td:nth-child(1)').textContent;
    let task = row.querySelector('td:nth-child(2)').textContent;
    let userId = row.querySelector('td:nth-child(3)').textContent;
    let statusIcon = row.querySelector('td:nth-child(7) i');
    let status = statusIcon.classList.contains('fa-circle-check');

    tasks.push({ id, task, userId, status });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  let savedTasks = localStorage.getItem('tasks');
  let tasksFetched = localStorage.getItem('tasksFetched');

  if (tasksFetched && savedTasks) {
    let tasks = JSON.parse(savedTasks);

    tasks.forEach((task) => {
      idCount = Math.max(idCount, parseInt(task.id));
      addTask(task.id, task.task, task.userId, task.status);
    });

    updateTaskCount();

  } else {

    fetch('https://dummyjson.com/todos')

    .then(response => {
      if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return response.json();

    }).then(data => {
      const todos = data.todos;

      for (let todoData of todos) {
        idCount++;
        let id = todoData.id;
        let task = todoData.todo;
        let status = todoData.completed;
        let userId = todoData.userId;

        addTask(id,task,userId,status);
      }

      localStorage.setItem('tasksFetched', 'true');

    }).catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
}

window.addEventListener('load', () => {
  loadTasksFromLocalStorage();
});

document.addEventListener('click', () => {
  saveTasksToLocalStorage();
});

//----Add tasks

let addButton = document.getElementById('add-task-button');
let task = document.getElementById('task-text');
let tableBody = document.getElementById('table-body');

addButton.addEventListener('click', (event) =>{
  event.preventDefault();

  let newTask = task.value;

  if(newTask.trim() !== ''){
    idCount++;
    let userId = Math.floor(Math.random() * 100) + 1;
    addTask(idCount,newTask,userId,'false');
    showToast('Task added successfully!');

  }else{
    task.classList.add('shake');
    setTimeout(() => {
      task.classList.remove('shake');
    }, 500);
  }
  
  task.value = '';

} );

function showToast(message) {
  let toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.top = '20px';
  }, 10);

  setTimeout(() => {
    toast.style.top = '-100px';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 500); 
  }, 3000);
}

function addTask(id,task,userId,status){

    let row = document.createElement('tr');
    let idCell = document.createElement('td');
    let taskCell = document.createElement('td');
    let userIdCell = document.createElement('td');
    let editButton = document.createElement('td');
    let deleteButton = document.createElement('td');
    let ToggleStatusButton = document.createElement('td');
    let statusCell = document.createElement('td');

    idCell.textContent = id;
    taskCell.textContent = task;
    userIdCell.textContent = userId;
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Delete';

    if(status === true){
      let completedIcon = document.createElement('i');
      completedIcon.classList.add('fa-solid','fa-circle-check','fa-lg');
      statusCell.appendChild(completedIcon);
      ToggleStatusButton.textContent = 'Revert';
    }else{
      let hourGlassIcon = document.createElement('i');
      hourGlassIcon.classList.add('fa-regular','fa-hourglass-half','fa-lg');
      statusCell.appendChild(hourGlassIcon);
      ToggleStatusButton.textContent = 'Done';
    }

    editButton.classList.add('edit-button');
    deleteButton.classList.add('delete-button');
    ToggleStatusButton.classList.add('toggle-status-button');

    editButton.setAttribute('data-action', 'edit');
    deleteButton.setAttribute('data-action', 'delete');
    ToggleStatusButton.setAttribute('data-action', 'toggle-status');

    row.appendChild(idCell);
    row.appendChild(taskCell);
    row.appendChild(userIdCell);
    row.appendChild(editButton);
    row.appendChild(deleteButton);
    row.appendChild(ToggleStatusButton);
    row.appendChild(statusCell);

    tableBody.appendChild(row);
    updateTaskCount();
}

tableBody.addEventListener('click', (event) => {
  let clickedButton = event.target;

  if (clickedButton.tagName === 'TD' && clickedButton.getAttribute('data-action')) {
    let action = clickedButton.dataset.action;

    if (action === 'edit') {
      editTask(event);
    } else if (action === 'delete') {
      deleteTask(event);
    } else if (action === 'toggle-status') {
      toggleStatus(event);
    }
  }
});

//----edit

function editTask (event){
  let rowToEdit = event.target.closest('tr');
  let taskCell = rowToEdit.querySelector('td:nth-child(2)');
  let taskText = taskCell.textContent;

  let editInput = document.createElement('input');
  editInput.classList.add('edit-input');

  editInput.type = 'text';
  editInput.value = taskText;

  taskCell.textContent = '';
  taskCell.appendChild(editInput);

  let textCellWidth = getComputedStyle(taskCell).width;
  editInput.style.width = textCellWidth;

  editInput.focus();
  
  editInput.addEventListener('blur', () => {
    saveEditedTask(taskCell, editInput);
  });

  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveEditedTask(taskCell, editInput);
    }
  });

}

function saveEditedTask(taskCell, editInput) {
  let editedTask = editInput.value;
  taskCell.textContent = editedTask;
  editInput.remove();
}

//----delete

let confirmationDialog = document.getElementById('confirmation-dialog');
let dialogOverlay = document.getElementById('dialog-overlay');
let confirmDeleteButton = document.getElementById('confirm-delete-button');
let cancelDeleteButton = document.getElementById('cancel-delete-button');
let deleteTaskID = document.getElementById('delete-task-id');
let rowToDelete = null;

function showConfirmationDialog(){
  confirmationDialog.style.display = 'block';
  dialogOverlay.style.display = 'block';

}

function hideConfirmationDialog(){
  confirmationDialog.style.display = 'none';
  dialogOverlay.style.display = 'none';
}

function deleteTask(event){
  
  rowToDelete = event.target.closest('tr');
  showConfirmationDialog();
  deleteTaskID.textContent = rowToDelete.querySelector('td:first-child').textContent;
  
}

confirmationDialog.addEventListener('click', (event)=> {
  let clickedButton = event.target;

  if(clickedButton.getAttribute('data-action')){

    let action = clickedButton.dataset.action;

    if (action === 'confirm') {
      rowToDelete.remove();
      updateTaskCount();

    } else if (action === 'cancle') {
      rowToDelete = null;
    }

    hideConfirmationDialog();
  }
});

//----Toggle

function toggleStatus(event){
  let row = event.target.closest('tr');
  let currentButton = row.querySelector('td:nth-child(6)');
  let currentStatus = row.querySelector('i');

  if(currentButton.textContent === 'Done'){
    currentButton.textContent = 'Revert';
    currentStatus.classList.remove('fa-regular','fa-hourglass-half','fa-lg');
    currentStatus.classList.add('fa-solid','fa-circle-check','fa-lg');
  }else{
    currentButton.textContent = 'Done';
    currentStatus.classList.remove('fa-solid','fa-circle-check','fa-lg');
    currentStatus.classList.add('fa-regular','fa-hourglass-half','fa-lg');
  }
}

//----Search

let searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', (event) => {
  let searchTerm = event.target.value.toLowerCase();

  const taskRows = tableBody.querySelectorAll('tr');

  taskRows.forEach((row) => {
    const taskDescription = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

    if (taskDescription.includes(searchTerm)) {
      row.style.display = 'table-row';

    } else {
      row.style.display = 'none';

    }

  });
});

