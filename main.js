//(() => {


//true is checked, false not
// task array data like {name:"name", status:true/false}
const DOUBLE_CLICK = 2
//it doesn't change status  
const escapeKeyCode = "Escape"
const enterKeyCode = "Enter"
const taskContainer = document.querySelector("#task-container")
const pageContainer = document.querySelector("#page-container")
const completedTaskCounter = document.querySelector("#completed-tasks-count")
const activeTaskCounter = document.querySelector("#active-tasks-count")
const allTaskCounter = document.querySelector("#all-tasks-count")
const nameInput = document.querySelector("#nameholder")
const checkAllButton = document.querySelector("#check-all")
const submitButton = document.querySelector("#submit-key")





const getTaskInput = (event) =>{
    return event.target.parentElement.children[2]
}
const getTaskText = (event) =>{
    return event.target.parentElement.children[1]
}
const getTaskId = (event) =>{
    return Number(event.target.parentElement.id)
}

let taskArray = [];
//working on it
const deleteTask = (taskId) => {
    taskArray = taskArray.filter((task) => task.id !== taskId)

    renderTasks()
}

//remake
let escapeExp = (string) => {
    let isPreviousSpace = false
    let protectedString = ""
    for (let i = 0; i < string.length; i++)
        if (string[i] === ">") {
            protectedString += "&gt";
        }
        else if (string[i] === "<") {
            protectedString += "&lt;";
        }
        else if (string[i] === " " && isPreviousSpace) {
            isPreviousSpace = true;
            continue;
        }
        else if (string[i] === " ") {
            protectedString += " "
            isPreviousSpace = true;
            continue
        }

        else {
            protectedString += string[i];
            isPreviousSpace = false
        }
    return protectedString
}






const renderTasks = () => {
    //pageGenerate(onlyActive)
    let renderedTasks = ""

    taskArray.forEach((item) => {
        //if (onlyActive === true && item.status) return
        //else if (onlyActive === false && !item.status) return
        renderedTasks += `<li id="${item.id}" class="task">
        <input type="checkbox" class="task-checkbox" ${item.isChecked ? 'checked' : ''}>
        <span class="task-textbox">${item.taskName}</span>
        <input style="display:none;" class="task-input"></input>
        <button class="task-delbutton">X</button></li>`

    }

    )
    taskContainer.innerHTML = renderedTasks
}

const addTask = () => {
    let nameString = escapeExp(nameInput.value)
    if(nameString===" " ) return
    const newTask = { id: Date.now(), taskName: nameString, isChecked: false }
    console.info(`added element with name ${nameString}!!`)
    taskArray.push(newTask)
    nameInput.value = ""
    checkAllButton.checked = false;
    
    renderTasks()
}

const changeTaskText = (id,taskText) =>{
    const formatedText= escapeExp(taskText)
    console.log(id);
    
    taskArray.forEach((task,index)=>{
        console.log(task.id);
        //task.id === id ? task.taskName = formatedText
        if(task.id === id){
            
            
            console.log("change")
            taskArray[index].taskName = formatedText
        }
    })
}


//checkAllButton.addEventListener("click", () => checkOneCallback)


const handleClick = (event) => {
    console.log(event)
    let taskId = Number(event.target.parentElement.id)
    if (event.target.className === "task-delbutton") {
        //some del logic
        console.log(event.target.className);

        deleteTask(taskId);
    }
    if (event.target.className === "task-checkbox") {
        taskArray.forEach((task) => {
            if (task.id === taskId) {
                task.isChecked = event.target.checked
            }
        }
        )

    }
    if (event.detail === DOUBLE_CLICK && event.target.className === "task-textbox") {
        let taskInputElement = getTaskInput(event)
        event.target.style.display = "None"
        console.log("DBLCK");

        taskInputElement.style.display = ""
        taskInputElement.focus()
        taskInputElement.value = event.target.innerHTML}
}

const handleKeyUp = (event)=>{
    if (event.target.className === "task-input" && event.key=== escapeKeyCode){
        let taskTextElement = getTaskText(event)

        console.log("key ",event)
        event.target.style.display = "none"
        taskTextElement.style.display = ""

    }
    if(event.target.className === "task-input" && event.key=== enterKeyCode){
        let taskInputElement=event.target
        let taskTextElement = getTaskText(event)
        const taskId = getTaskId(event)
        
        changeTaskText(taskId, taskInputElement.value)
        taskInputElement.value = ""
        taskInputElement.style.display = "none"
        taskTextElement.style.display = ""
        
        renderTasks()
        
    }
    
}


//ul button event
taskContainer.addEventListener("click", handleClick)


taskContainer.addEventListener("keyup",handleKeyUp)



//submit button event
submitButton.addEventListener("click", () => {
    addTask();}
)

//})();


