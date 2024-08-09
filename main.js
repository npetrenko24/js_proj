(() => {


//true is checked, false not
// task array data like {name:"name", status:true/false}
const TASKS_ON_PAGE = 5
const DOUBLE_CLICK = 2
//it doesn't change status  
const ESCAPEKEYCODE = "Escape"
const ENTERKEYCODE = "Enter"

const taskContainer = document.querySelector("#task-container")
const countersContainer = document.querySelector("#counter-container")
const pageContainer = document.querySelector("#page-container")
const completedTaskCounter = document.querySelector("#completed-tasks-count")
const activeTaskCounter = document.querySelector("#active-tasks-count")
const allTaskCounter = document.querySelector("#all-tasks-count")
const taskTextInput = document.querySelector("#nameholder")
const checkAllButton = document.querySelector("#check-all")
const addButton = document.querySelector("#add-button")
const deleteAllCompletedButton = document.querySelector("#delete-all-completed")

let taskArray = [];
//Nan for all tasks
let modeRender = NaN
let currentPage = 1
let totalPages = 0



const getTaskUserInput = (event) => {
    return event.target.parentElement.children[2]
}

const getTaskText = (event) => {
    return event.target.parentElement.children[1]
}

const getTaskId = (event) => {
    return Number(event.target.parentElement.id)
}






const deleteTask = (taskId) => {
    taskArray = taskArray.filter((task) => task.id !== taskId)

    generateTasksList()
}

const escapeExp = (string) => {
    let protectedString = string.trim()
    protectedString.replace(/ /g, " ")
    protectedString.replace(/>/g, "&gt")
    protectedString.replace(/</g, "&lt")
    if (string === "" || string === " ") return false
    return protectedString
}

const updateTasksCounter = () => {
    console.log("count");
    let activeTasks = 0
    let completedTasks = 0
    taskArray.forEach((task) => {
        task.isChecked ? completedTasks++ : activeTasks++
    })
    activeTaskCounter.textContent = activeTasks
    completedTaskCounter.textContent = completedTasks
    allTaskCounter.textContent = activeTasks + completedTasks
    activeTasks + completedTasks === 0 ? checkAllButton.disabled = true : checkAllButton.disabled = false
}

const refreshTotalPageCounter = (renderList) => {
    let pageCount = Math.ceil(renderList.length / TASKS_ON_PAGE)
    totalPages = pageCount
}

const generatePagesButtons = (renderList) => {
    let string = "";
    //let pageCount = renderList.length/TASKS_ON_PAGE
    refreshTotalPageCounter(renderList)

    for (let i = 0; i < totalPages; i++) {
        string += `<button class="${i + 1} ${i === currentPage - 1 ? 'current-page' : ""}">${i + 1}</button>`
    }

    pageContainer.innerHTML = string



}


const generatePagedContent = (renderList, page = currentPage) => {
    let pageList = renderList.slice(TASKS_ON_PAGE * (page - 1), TASKS_ON_PAGE * (page))
    render(pageList)

}

const generateTasksList = () => {
    //render all tasks
    let fetchedTaskArray = {}

    if (isNaN(modeRender)) fetchedTaskArray = taskArray
    else {
        fetchedTaskArray = taskArray.filter(
            (task) => task.isChecked === modeRender
        )
    }
    console.log(fetchedTaskArray);
    updateTasksCounter()
    generatePagesButtons(fetchedTaskArray)
    generatePagedContent(fetchedTaskArray)
    return fetchedTaskArray
}

const render = (renderList) => {
    let renderedTasks = ""
    console.log("RR");
    
    renderList.forEach((task) => {
        renderedTasks += `<li id="${task.id}" class="task">
        <input type="checkbox" class="task-checkbox" ${task.isChecked ? 'checked' : ''}>
        <span class="task-textbox">${task.taskText}</span>
        <input hidden maxlength="255" class="task-input"></input>
        <button class="task-delbutton">X</button></li>`

    }

    )
    taskContainer.innerHTML = renderedTasks
}

const addTask = () => {
    let nameString = escapeExp(taskTextInput.value)
    if (nameString === false) return
    const newTask = { id: Date.now(), taskText: nameString, isChecked: false }
    console.info(`added element with name ${nameString}!!`)
    taskArray.push(newTask)
    taskTextInput.value = ""
    checkAllButton.checked = false;

    //generateTasksList()
    switchPage(false)
}

const cancelEditingTaskText = (event) => {
    let taskTextElement = getTaskText(event)

    console.log("key ", event)
    event.target.hidden = true
    taskTextElement.hidden = false
    taskTextElement.onblur = ""
}

const changeTaskText = (id, taskText) => {
    const formatedText = escapeExp(taskText)
    if (!formatedText) return

    taskArray.forEach((task, index) => {
        if (task.id === id) {
            taskArray[index].taskText = formatedText
        }
    })
    generateTasksList()
}

const changeAllTasksStatus = (event) => {
    console.log("CHANGE ALL");
    const isChecked = event.target.checked
    taskArray.forEach((task, index) => {
        taskArray[index].isChecked = isChecked
    }
    )
    generateTasksList()
    switchPage(true)
}

const switchPage = (isDelete) => {
    refreshTotalPageCounter(generateTasksList())
    if ((currentPage > totalPages && isDelete) ||
        (currentPage < totalPages && !isDelete)) {
        console.log("re-render");
        totalPages === 0 ? currentPage = 1 : currentPage = totalPages
        generateTasksList()
    }
}

const handleClick = (event) => {
    console.log(event)
    let taskId = Number(event.target.parentElement.id)
    if (event.target.className === "task-delbutton") {
        deleteTask(taskId);
        switchPage(true)
    }
    if (event.target.className === "task-checkbox") {
        taskArray.forEach((task) => {
            if (task.id === taskId) {
                task.isChecked = event.target.checked
                generateTasksList()
                switchPage(true)
            }
        }
        )
    }
    if (event.detail === DOUBLE_CLICK && event.target.className === "task-textbox") {
        let taskInputElement = getTaskUserInput(event)
        event.target.hidden = true

        taskInputElement.hidden = false
        taskInputElement.focus()
        taskInputElement.value = event.target.textContent
        taskInputElement.onblur = cancelEditingTaskText;

    }

}

const handleKeyUp = (event) => {

    if (event.target.className === "task-input" && event.key === ESCAPEKEYCODE) {
        cancelEditingTaskText(event)

    }
    if (event.target.className === "task-input" && event.key === ENTERKEYCODE) {
        let taskInputElement = event.target
        let taskTextElement = getTaskText(event)
        const taskId = getTaskId(event)

        changeTaskText(taskId, taskInputElement.value)
        taskInputElement.value = ""
        taskInputElement.hidden = true
        taskTextElement.hidden = false

    }

}

const counterClickCallback = (event)=>{
    if (event.target.tagName == "BUTTON") {
        console.log("clicked on counter", event);
        console.log(countersContainer.querySelector(".current-counter"));

        countersContainer.querySelector(".current-counter").className = "counter"
        event.target.parentElement.className += " current-counter"
    }
    if (event.target.id === "completed-tasks-button") {
        modeRender = true
        //generateTasksList()
    }
    if (event.target.id === "active-tasks-button") {
        modeRender = false
        //generateTasksList()
    }
    if (event.target.id === "all-tasks-button") {
        modeRender = NaN
        //generateTasksList()
    }
    switchPage(true)
}

countersContainer.addEventListener("click", counterClickCallback)


pageContainer.addEventListener("click", (event) => {
    if (event.target.localName === "button") {

        let pageCount = Number(event.target.className)
        event.target.disabled
        currentPage = pageCount
        generateTasksList()
    }

})

checkAllButton.addEventListener("click", changeAllTasksStatus)
//ul button event
taskContainer.addEventListener("click", handleClick)

taskContainer.addEventListener("keyup", handleKeyUp)
taskTextInput.addEventListener("keyup", (event) => event.key == ENTERKEYCODE ? addTask() : false)
//submit button event
addButton.addEventListener("click", addTask)
deleteAllCompletedButton.addEventListener("click", () => {
    //alert("del all")
    taskArray = taskArray.filter((task) => !task.isChecked)
    //generateTasksList()
    switchPage(true)
}
)



})();


