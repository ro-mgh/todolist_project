// define task input and listen to button add task

let idCounter = 1
const inProgressTasks = document.querySelector('.in-progress-tasks')
const completedTasks = document.querySelector('.completed-tasks')

const newTask = document.querySelector('.input-task')
const addTaskBtn = document.querySelector('.add-to-list')
addTaskBtn.addEventListener('click', function() {
  if (newTask.value != '') {
    idCounter++
    renderNewTask(newTask.value)
    newTask.value = ''
    // refreshAddList()
  }
})

// to add task to task list

function renderNewTask(value) {
  const newTaskDiv = document.createElement('div')
  newTaskDiv.setAttribute('class', 'task-in-progress')

  const newTaskCheckbox = document.createElement('input')
  newTaskCheckbox.setAttribute('type', 'checkbox')
  newTaskCheckbox.setAttribute('id', `task ${idCounter}`)
  newTaskCheckbox.addEventListener('change', function() {
    if (this.checked) {
      // cool func
      moveTaskToComplete(newTaskCheckbox, completedTasks)
    } else {
      moveTaskToComplete(newTaskCheckbox, inProgressTasks)
    }
  })

  const newTaskLabel = document.createElement('label')
  newTaskLabel.setAttribute('for', `task ${idCounter}`)
  newTaskLabel.innerText = value

  const newDeleteTaskBtn = document.createElement('button')
  newDeleteTaskBtn.setAttribute('class', 'delete-task')
  newDeleteTaskBtn.textContent = '×'
  newDeleteTaskBtn.addEventListener('click', deleteParent)

  newTaskDiv.appendChild(newTaskCheckbox)
  newTaskDiv.appendChild(newTaskLabel)
  newTaskDiv.appendChild(newDeleteTaskBtn)

  inProgressTasks.appendChild(newTaskDiv)
}

// cool functions

function moveTaskToComplete(checkbox, path) {
  let divToMove = checkbox.parentNode
  path.appendChild(divToMove)
}

function deleteParent() {
  const parent = this.parentNode
  parent.remove()
}

// to add feature for task deletion
