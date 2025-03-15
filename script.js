const input = document.getElementById('todo-input')
const addButton = document.getElementById('add-button')
const todoListContainer = document.getElementById('todoList-container')
const count = document.getElementById('todo-count')

const yearElement = document.getElementById('daily-year')
const dateElement = document.getElementById('daily-date')
const dateInput = document.getElementById('date-input')
const weeklyElement = document.getElementById('weekly-week')

const ICON_CIRCLE_DASHED = '#icon-circle-dashed'
const ICON_CHECKED = '#icon-circle-check-big'
const ICON_X = '#icon-x'
const UNFINISHED = 'pending'
const FINISHED = 'finished'

const KEY = 'kysJSTodoList'

let todoData = {}
let curDate

let weekDate = []
const dateElements = document.getElementsByClassName('weekly-date')
const stateElements = document.getElementsByClassName('weekly-state')
const weeklyDataItems = document.getElementsByClassName('weeklyDataItem')

const saveTodoDataInLocalStorage = () => {
  localStorage.setItem(KEY, JSON.stringify(todoData))
}

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
  if (curDate in todoData === false)
    todoData[curDate] = {
      [UNFINISHED]: {},
      [FINISHED]: {},
    }
}

const calcTodoCount = (targetDate) => {
  const todoList = todoData[targetDate][UNFINISHED]
  const todoListFinished = todoData[targetDate][FINISHED]

  const todoListCount = Object.keys(todoList).length
  const todoListFinishedCount = Object.keys(todoListFinished).length

  return [todoListFinishedCount, todoListFinishedCount + todoListCount]
}

const displayWeeklyData = () => {
  let finishedTasks = 0
  let totalTasks = 0

  for (let i = 0; i < 7; i++) {
    const targetDate = weekDate[i]
    dateElements[i].innerHTML = targetDate.slice(-2)
    stateElements[i].classList.remove('complete')
    weeklyDataItems[i].id = weekDate[i]

    if (targetDate in todoData === false) {
      stateElements[i].innerHTML = '0/0'
      stateElements[i].classList.add('complete')
    } else {
      const [fin, total] = calcTodoCount(targetDate)
      finishedTasks += fin
      totalTasks += total
      stateElements[i].innerHTML = `${fin}/${total}`

      if (fin === total) stateElements[i].classList.add('complete')
    }
  }

  const totalElement = document.getElementById('weekly-total')
  if (finishedTasks === totalTasks)
    totalElement.innerHTML = `total ${finishedTasks}/${totalTasks} (100.0%)`
  else
    totalElement.innerHTML = `total ${finishedTasks}/${totalTasks} (${(
      (finishedTasks / totalTasks) *
      100
    ).toFixed(2)}%)`
}

const getWeeklyData = () => {
  weekDate = []
  let curDateObj = new Date(curDate)
  const curDay = curDateObj.getDay()

  for (let i = curDay; i !== 0; i--) {
    curDateObj.setDate(curDateObj.getDate() - 1)
    weekDate.push(formatDate(curDateObj))
  }
  weekDate.reverse()

  curDateObj = new Date(curDate)
  for (let i = curDay; weekDate.length < 7; i++) {
    weekDate.push(formatDate(curDateObj))
    curDateObj.setDate(curDateObj.getDate() + 1)
  }

  console.log(weekDate)
}

document.addEventListener('DOMContentLoaded', () => {
  const date = new Date()
  curDate = formatDate(date)

  if (localStorage.getItem(KEY))
    todoData = JSON.parse(localStorage.getItem(KEY))

  // createCurTodoData()
  displayDate()
  displayTodo()
  getWeeklyData()
  displayWeeklyData()
  addEventListenerToWeeklyItem()
})

const handleDateClick = () => {
  dateInput.showPicker()
}

const handleDateSelect = (e) => {
  curDate = e.target.value

  // createCurTodoData()
  displayDate()
  displayTodo()
  getWeeklyData()
  displayWeeklyData()
}

const addEventListenerToWeeklyItem = () => {
  for (let i = 0; i < weeklyDataItems.length; i++) {
    weeklyDataItems[i].addEventListener('click', (e) => {
      const date = e.target.id
      handleDateSelect({ target: { value: date } })
    })
  }
}

yearElement.addEventListener('click', handleDateClick)
dateElement.addEventListener('click', handleDateClick)
weeklyElement.addEventListener('click', handleDateClick)
dateInput.addEventListener('change', handleDateSelect)

const handleAddTodo = () => {
  const task = input.value

  if (task) {
    const key = new Date().getTime()
    createCurTodoData()

    todoData[curDate][UNFINISHED][key] = task

    input.value = ''
    saveTodoDataInLocalStorage()
    displayTodo()
    displayWeeklyData()
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
  if (curDate in todoData === false) {
    count.innerText = '0/0'
    return
  }

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
  displayTodoCount()

  if (curDate in todoData === false) return

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
}

const handleRemoveTodo = (e) => {
  const todoItem = e.target.closest('div.todoItem')
  const id = todoItem.id

  const todoList = todoData[curDate][UNFINISHED]
  const todoListFinished = todoData[curDate][FINISHED]

  if (window.confirm(`삭제하시겠습니까? 복구되지 않습니다.`)) {
    if (id in todoList) delete todoList[id]
    else delete todoListFinished[id]
    saveTodoDataInLocalStorage()
    displayTodo()
    displayWeeklyData()
  }
}

const handleCheckToggle = (e) => {
  const todoItem = e.target.closest('div.todoItem')
  const id = todoItem.id

  let todoList = todoData[curDate][UNFINISHED]
  let todoListFinished = todoData[curDate][FINISHED]

  if (todoItem.classList.contains(FINISHED)) {
    todoList[id] = todoListFinished[id]
    delete todoListFinished[id]
  } else {
    todoListFinished[id] = todoList[id]
    delete todoList[id]
  }

  saveTodoDataInLocalStorage()
  displayTodo()
  displayWeeklyData()
}
