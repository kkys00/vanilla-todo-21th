const input = document.getElementById('todo-input')
const addButton = document.getElementById('add-button')
const todoListContainer = document.getElementById('todoList-container')
const count = document.getElementById('todo-count')

const yearElement = document.getElementById('daily-year')
const dateElement = document.getElementById('daily-date')
const dateInput = document.getElementById('date-input')

const ICON_CIRCLE_DASHED = '#icon-circle-dashed'
const ICON_CHECKED = '#icon-circle-check-big'
const ICON_X = '#icon-x'
const UNFINISHED = 'pending'
const FINISHED = 'finished'

const todoData = {}

let curDate

const formatDate = (date) => {
  const year = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `${year}-${mm}-${dd}`
}

const displayDate = () => {
  const dateObj = new Date(curDate)
  const [day, month, date, year] = dateObj.toString().split(' ')

  yearElement.innerHTML = year
  dateElement.innerHTML = `${month} ${date} ${day}`
}

const createCurTodoData = () => {
  todoData[curDate] = {
    [UNFINISHED]: {},
    [FINISHED]: {},
  }
  console.log('생성', todoData)
}

document.addEventListener('DOMContentLoaded', () => {
  const date = new Date()
  curDate = formatDate(date)

  createCurTodoData()
  displayDate()
  displayTodoCount()
})

const handleDateClick = () => {
  dateInput.showPicker()
}

const handleDateSelect = (e) => {
  curDate = e.target.value

  if (curDate in todoData === false) createCurTodoData()
  displayDate()
  displayTodo()
}

yearElement.addEventListener('click', handleDateClick)
dateElement.addEventListener('click', handleDateClick)
dateInput.addEventListener('change', handleDateSelect)

const handleAddTodo = () => {
  const task = input.value

  if (task) {
    const key = new Date().getTime()

    todoData[curDate][UNFINISHED][key] = task
    console.log('추가', todoData)

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

const displayTodoCount = () => {
  const todoList = todoData[curDate][UNFINISHED]
  const todoListFinished = todoData[curDate][FINISHED]

  const todoListCount = Object.keys(todoList).length
  const todoListFinishedCount = Object.keys(todoListFinished).length

  count.innerText = `${todoListFinishedCount}/${
    todoListCount + todoListFinishedCount
  }`
}

const displayTodo = () => {
  todoListContainer.innerHTML = ''

  const todoList = todoData[curDate][UNFINISHED]
  const todoListFinished = todoData[curDate][FINISHED]

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

  console.log('표시', todoData)
  displayTodoCount()
}

const handleRemoveTodo = (e) => {
  const todoItem = e.target.closest('div.todoItem')
  const id = todoItem.id

  const todoList = todoData[curDate][UNFINISHED]
  const todoListFinished = todoData[curDate][FINISHED]

  if (window.confirm(`삭제하시겠습니까? 복구되지 않습니다.`)) {
    if (id in todoList) delete todoList[id]
    else delete todoListFinished[id]
    displayTodo()
  }
}

const handleCheckToggle = (e) => {
  const todoItem = e.target.closest('div.todoItem')
  const id = todoItem.id

  let todoList = todoData[curDate][UNFINISHED]
  let todoListFinished = todoData[curDate][FINISHED]

  if (todoItem.classList.contains(FINISHED)) {
    // const { [id]: todo, ...newTodoList } = todoListFinished
    // todoList[id] = todo
    // todoListFinished = newTodoList
    todoList[id] = todoListFinished[id]
    delete todoListFinished[id]
  } else {
    // const { [id]: todo, ...newTodoList } = todoList
    // todoListFinished[id] = todo
    // todoList = newTodoList
    todoListFinished[id] = todoList[id]
    delete todoList[id]
  }

  displayTodo()
}
