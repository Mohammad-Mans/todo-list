let addButton = document.getElementById('add-task-button');
let task = document.getElementById('task-text');
let tableBody = document.getElementById('table-body');

fetch('https://dummyjson.com/todos')
    .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return response.json();

  }).then(data => {
    const todos = data.todos;

    for (let tododata of todos) {
      let id = tododata.id;
      let task = tododata.todo;
      let status = tododata.completed;
      let userId = tododata.userId;

      addTask(id,task,userId,status);
    }

  }).catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });


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
    taskCell.innerHTML = task;
    userIdCell.innerHTML = userId;
    editButton.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';
    doneButton.innerHTML = 'Done';
    statusCell.innerHTML = status;

    row.appendChild(idCell);
    row.appendChild(taskCell);
    row.appendChild(userIdCell);
    row.appendChild(editButton);
    row.appendChild(deleteButton);
    row.appendChild(doneButton);
    row.appendChild(statusCell);

    tableBody.appendChild(row);
}


