//(() => {


//true is checked, false not
// task array data like {name:"name", status:true/false}
const DOUBLE_CLICK = 2
//it doesn't change status  
const escapeKeyCode = "Escape"
const enterKeyCode = "Enter"
const taskContainer = document.querySelector("#task-container")
const countersContainer = document.querySelector("#counter-container")
// const pageContainer = document.querySelector("#page-container")
const completedTaskCounter = document.querySelector("#completed-tasks-count > h1")
const activeTaskCounter = document.querySelector("#active-tasks-count > h1")
const allTaskCounter = document.querySelector("#all-tasks-count > h1")
const nameInput = document.querySelector("#nameholder")
const checkAllButton = document.querySelector("#check-all")
const submitButton = document.querySelector("#submit-key")





const getTaskInput = (event) => {
    return event.target.parentElement.children[2]
}
const getTaskText = (event) => {
    return event.target.parentElement.children[1]
}
const getTaskId = (event) => {
    return Number(event.target.parentElement.id)
}

let taskArray = [];
//Nan for all
let modeRender = NaN



//working on it
const deleteTask = (taskId) => {
    taskArray = taskArray.filter((task) => task.id !== taskId)

    generateTasksList()
}

let escapeExp = (string) => {
    let protectedString = string.trim()
    protectedString.replace(/ /g, " ")
    protectedString.replace(/>/g, "&gt")
    protectedString.replace(/</g, "&lt")
    if (string === "" || string === " ") return false
    return protectedString
}
const updateTasksCounter=()=>{
    console.log("count");
    
    completedTaskCounter.innerHTML = 0
    activeTaskCounter.innerHTML = 0
    allTaskCounter.innerHTML = 0
    taskArray.forEach((task)=>{
        task.isChecked ? completedTaskCounter.innerHTML++ : activeTaskCounter.innerHTML++
        allTaskCounter.innerHTML++
    })
}


const generateTasksList = ()=>{
    console.log("HNGHHG");
    
    if (isNaN(modeRender)){
        updateTasksCounter()
        renderTasks(taskArray)
        return
    }
    let fetchedTaskArray=taskArray.filter(
        (task)=>task.isChecked===modeRender
    )
    console.log(fetchedTaskArray);
    updateTasksCounter()
    renderTasks(fetchedTaskArray)
    return 
}


const renderTasks = (renderList) => {
    let renderedTasks = ""

    renderList.forEach((item) => {
        renderedTasks += `<li id="${item.id}" class="task">
        <input type="checkbox" class="task-checkbox" ${item.isChecked ? 'checked' : ''}>
        <span class="task-textbox">${item.taskName}</span>
        <input hidden maxlength="255" class="task-input"></input>
        <button class="task-delbutton">X</button></li>`

    }

    )
    taskContainer.innerHTML = renderedTasks
}

const addTask = () => {
    let nameString = escapeExp(nameInput.value)
    if (nameString === false) return
    const newTask = { id: Date.now(), taskName: nameString, isChecked: false }
    console.info(`added element with name ${nameString}!!`)
    taskArray.push(newTask)
    nameInput.value = ""
    checkAllButton.checked = false;

    generateTasksList(modeRender)
}

const editTaskCancel = (event) => {
    let taskTextElement = getTaskText(event)

    console.log("key ", event)
    event.target.hidden = true
    taskTextElement.hidden = false
    taskTextElement.onblur = ""
}

const changeTaskText = (id, taskText) => {
    const formatedText = escapeExp(taskText)
    if (formatedText === false) return

    taskArray.forEach((task, index) => {
        console.log(task.id);
        //task.id === id ? task.taskName = formatedText
        if (task.id === id) {
            taskArray[index].taskName = formatedText
        }
    })
    generateTasksList(modeRender)
}

const changeAllTasksStatus = (event) => {
    console.log("CHANGE ALL");
    const isChecked = event.target.checked
    taskArray.forEach((task, index) => {
        taskArray[index].isChecked = isChecked
    }
    )
    generateTasksList(modeRender)
}




const handleClick = (event) => {
    console.log(event)
    let taskId = Number(event.target.parentElement.id)
    if (event.target.className === "task-delbutton") {
        //some del logic
        console.log(event.target.className);
        deleteTask(taskId);
        generateTasksList(modeRender)
    }
    if (event.target.className === "task-checkbox") {
        taskArray.forEach((task) => {
            if (task.id === taskId) {
                task.isChecked = event.target.checked
                generateTasksList(modeRender)
            }
        }
        )

    }
    if (event.detail === DOUBLE_CLICK && event.target.className === "task-textbox") {
        let taskInputElement = getTaskInput(event)
        event.target.hidden = true

        taskInputElement.hidden = false
        taskInputElement.focus()
        taskInputElement.value = event.target.textContent
        taskInputElement.onblur = editTaskCancel;

    }

}

const handleKeyUp = (event) => {

    if (event.target.className === "task-input" && event.key === escapeKeyCode) {
        editTaskCancel(event)

    }
    if (event.target.className === "task-input" && event.key === enterKeyCode) {
        let taskInputElement = event.target
        let taskTextElement = getTaskText(event)
        const taskId = getTaskId(event)

        changeTaskText(taskId, taskInputElement.value)
        taskInputElement.value = ""
        taskInputElement.hidden = true
        taskTextElement.hidden = false

    }

}

countersContainer.addEventListener("click",(event)=>{
    console.log("clicked on counter",event);
    if(event.target.id==="completed-tasks-button"){
        modeRender=true
        generateTasksList()
    }
    if(event.target.id==="active-tasks-button"){
        modeRender=false
        generateTasksList()
    }
    if(event.target.id==="all-tasks-button"){
        modeRender=NaN
        generateTasksList()
    }
}
)

checkAllButton.addEventListener("click", changeAllTasksStatus)
//ul button event
taskContainer.addEventListener("click", handleClick)

taskContainer.addEventListener("keyup", handleKeyUp)
//submit button event
submitButton.addEventListener("click", addTask)



//})();


