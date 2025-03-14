const input = document.getElementById('todo-input')
const addButton = document.getElementById('add-button')
const todoListContainer = document.getElementById('todoList-container')

const ICON_CIRCLE_DASHED = '#icon-circle-dashed'
const ICON_CHECKED = '#icon-circle-check-big'
const ICON_X = '#icon-x'
const FINISHED = 'finished'

let todoList = {}
let todoListFinished = {}

document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('daily-year')
  const dateElement = document.getElementById('daily-date')

  const dateObj = new Date()
  const [day, month, date, year] = dateObj.toString().split(' ')

  yearElement.innerHTML = year
  dateElement.innerHTML = `${month} ${date} ${day}`
})

const handleAddTodo = () => {
  const task = input.value

  if (task) {
    const key = new Date().getTime()
    todoList[key] = task
    input.value = ''
    displayTodo()
  }
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo()
})

addButton.addEventListener('click', handleAddTodo)

const createSvgElement = (hrefName) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '24')

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('href', hrefName)

  svg.appendChild(use)
  return svg
}

const createTodoElement = (content, checkboxIcon) => {
  const todoItem = document.createElement('div')
  todoItem.className = 'todoItem'

  const stateDiv = document.createElement('div')
  stateDiv.className = 'state'
  const stateSvg = createSvgElement(checkboxIcon)
  stateDiv.appendChild(stateSvg)
  stateDiv.addEventListener('click', handleCheckToggle)

  const contentDiv = document.createElement('div')
  contentDiv.className = 'content'
  contentDiv.innerHTML = content

  const removeBtn = document.createElement('button')
  removeBtn.className = 'removeBtn'
  const removeSvg = createSvgElement(ICON_X)
  removeBtn.appendChild(removeSvg)
  removeBtn.addEventListener('click', handleRemoveTodo)

  todoItem.appendChild(stateDiv)
  todoItem.appendChild(contentDiv)
  todoItem.appendChild(removeBtn)

  return todoItem
}

const displayTodo = () => {
  todoListContainer.innerHTML = ''

  for (let id in todoList) {
    const content = todoList[id]
    const todoItem = createTodoElement(content, ICON_CIRCLE_DASHED)
    todoItem.id = id
    todoListContainer.appendChild(todoItem)
  }

  for (let id in todoListFinished) {
    const content = todoListFinished[id]
    const todoItem = createTodoElement(content, ICON_CHECKED)
    todoItem.id = id
    todoItem.classList.add(FINISHED)
    todoListContainer.appendChild(todoItem)
  }
}

const handleRemoveTodo = (e) => {
  const todoItem = e.target.closest('div.todoItem')
  const id = todoItem.id

  if (window.confirm(`삭제하시겠습니까? 복구되지 않습니다.`)) {
    if (id in todoList) delete todoList[id]
    else delete todoListFinished[id]
    displayTodo()
  }
}

const handleCheckToggle = (e) => {
  const todoItem = e.target.closest('div.todoItem')
  const id = todoItem.id

  if (todoItem.classList.contains(FINISHED)) {
    const { [id]: todo, ...newTodoList } = todoListFinished
    todoList[id] = todo
    todoListFinished = newTodoList
  } else {
    const { [id]: todo, ...newTodoList } = todoList
    todoListFinished[id] = todo
    todoList = newTodoList
  }
  console.log('todoList', Object.entries(todoList))
  console.log('todoList', Object.entries(todoListFinished))
  displayTodo()
}
