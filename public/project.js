// define task input and listen to button add task

let idCounter = 1
const inProgressTasks = document.querySelector('.in-progress-tasks')
const completedTasks = document.querySelector('.completed-tasks')

const newTask = document.querySelector('.input-task')
const addTaskBtn = document.querySelector('.add-to-list')

// checking if curren URL ends up ../mytodolist

function urlCheck(url, targetLastEle) {
  const urlArr = url.split('/')
  const lastEle = urlArr[urlArr.length - 1]
  return lastEle === targetLastEle
}

addTaskBtn.addEventListener('click', async function() {
  if (newTask.value !== '') {
    idCounter++
    let taskId = idCounter
    if (urlCheck(document.URL, 'mytodolist')) {
      try {
        const response = await fetch('/mytodolist/item', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            name: newTask.value
          })
        })
        if (response.ok) {
          const jsonResponse = await response.json()
          taskId = await jsonResponse.createdId
        }
      } catch (err) {
        console.error(`Error: ${err}`)
      }
    }
    // refreshAddList()
    renderNewTask(newTask.value, taskId)
  }
  newTask.value = ''
})

// task deletion

const deletebtns = document.querySelectorAll('.delete-task')
for (let i = 0; i < deletebtns.length; i++) {
  const currentbtn = deletebtns[i]
  currentbtn.addEventListener('click', deleteParent)
}

// task completion/uncompletion

const allTasks = document.querySelectorAll('input[type=checkbox]')
for (let i = 0; i < allTasks.length; i++) {
  const currentTask = allTasks[i]
  currentTask.addEventListener('change', function() {
    if (this.checked) {
      // cool func
      moveTaskTo(currentTask, completedTasks, 'complete')
    } else {
      moveTaskTo(currentTask, inProgressTasks, 'active')
    }
  })
}

// to add task to task list

function renderNewTask(value, taskId) {
  const newTaskDiv = document.createElement('div')
  newTaskDiv.setAttribute('class', 'task-in-progress')
  newTaskDiv.setAttribute('data-index', taskId)

  const newTaskCheckbox = document.createElement('input')
  newTaskCheckbox.setAttribute('type', 'checkbox')
  newTaskCheckbox.setAttribute('id', `task_${taskId}`)
  newTaskCheckbox.addEventListener('change', function() {
    if (this.checked) {
      // cool func
      moveTaskTo(newTaskCheckbox, completedTasks, 'complete')
    } else {
      moveTaskTo(newTaskCheckbox, inProgressTasks, 'active')
    }
  })

  const newTaskLabel = document.createElement('label')
  newTaskLabel.setAttribute('for', `task_${taskId}`)
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
// '/mytodolist/item/' + taskId

async function moveTaskTo(checkbox, path, state) {
  let divToMove = checkbox.parentNode
  const taskId = divToMove.dataset.index
  path.appendChild(divToMove)
  if (urlCheck(document.URL, 'mytodolist')) {
    try {
      await fetch('/mytodolist/item/' + taskId, {
        method: 'put',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId,
          toChange: {
            status: state
          }
        })
      })
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }
}

async function deleteParent() {
  const parent = this.parentNode
  const taskId = parent.dataset.index
  parent.remove()
  if (urlCheck(document.URL, 'mytodolist')) {
    try {
      await fetch('/mytodolist/item/' + taskId, {
        method: 'delete',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId
        })
      })
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }
}
