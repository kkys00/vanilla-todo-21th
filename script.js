const input = document.getElementById('todo-input')
const addButton = document.getElementById('add-button')

const todoList = []

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
    todoList.push(task)
    input.value = ''
  }
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo()
})

addButton.addEventListener('click', handleAddTodo)
