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
    let doneButton = document.createElement('td');
    let statusCell = document.createElement('td');

    idCell.innerHTML = id;
    taskCell.textContent = task;
    userIdCell.innerHTML = userId;
    editButton.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';
    doneButton.innerHTML = 'Done';
    statusCell.innerHTML = status;

    editButton.classList.add('edit-button');
    deleteButton.classList.add('delete-button');
    doneButton.classList.add('done-button');

    row.appendChild(idCell);
    row.appendChild(taskCell);
    row.appendChild(userIdCell);
    row.appendChild(editButton);
    row.appendChild(deleteButton);
    row.appendChild(doneButton);
    row.appendChild(statusCell);

    tableBody.appendChild(row);
}


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

