const input = document.getElementById('todo-input')
const addButton = document.getElementById('add-button')

const todoList = []

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
