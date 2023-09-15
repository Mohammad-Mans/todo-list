let idCount = 0;

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

  }).catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  }
);

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

  }else{
    task.classList.add('shake');
    setTimeout(() => {
      task.classList.remove('shake');
    }, 500);
  }
  
  task.value = '';

} );

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
}

tableBody.addEventListener('click', (event) => {
  let clickedButton = event.target;

  if (clickedButton.tagName === 'TD' && clickedButton.getAttribute('data-action')) {
    let action = clickedButton.dataset.action;

    if (action === 'edit') {
      alert('edit');
    } else if (action === 'delete') {
      deleteTask(event);
    } else if (action === 'toggle-status') {
      toggleStatus(event);
    }
  }
});

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

