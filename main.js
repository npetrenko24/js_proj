//(() => {


let TaskArray = [];//true is checked, false not
// task array data like {name:"name", status:true/false}

//it doesn't change status  
let taskContainer = document.querySelector("#task-container")
let pageContainer = document.querySelector("#page-container")
let completedTaskCounter = document.querySelector("#completed-tasks-count")
let activeTaskCounter = document.querySelector("#active-tasks-count")
let allTaskCounter = document.querySelector("#all-tasks-count")
let nameInput = document.querySelector("#nameholder")
let checkAllButton = document.querySelector("#check-all")
let submitButton = document.querySelector("#submit-key")



//working on it

function checkOneCallback(element) {
    let taskName = getTaskName(element)
    TaskArray.forEach((value, index) => {
        console.log(value)
        console.log(taskName)
        if (value.name === taskName) {
            TaskArray[index].status = !TaskArray[index].status
            counterUpdate()
        }


    }
    )
}


function delTaskCallback(taskName) { // don't work well 
    TaskArray = TaskArray.filter((value) => {
        if (value.name === taskName) {
            return false
        }
        return true
    })

    renderTask(TaskArray)
    counterUpdate()

}

//remake
function escapeExp(string) {
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






function renderTask(TaskArray, onlyActive = undefined) {
    pageGenerate(onlyActive)
    taskContainer.innerHTML = ""
    TaskArray.forEach((item) => {
        if (onlyActive === true && item.status) return
        else if (onlyActive === false && !item.status) return
        let task = document.createElement("div")
        task.className = "task"
        taskContainer.appendChild(task)
        let input = document.createElement("input")
        input.className = "complete-flag"
        input.checked = item.status
        input.type = "checkbox"
        let taskLabel = document.createElement("label")
        taskLabel.innerHTML = item.name
        let delButton = document.createElement("button")
        delButton.className = "delbutton"
        delButton.innerHTML = "X"


        task.appendChild(input)
        task.appendChild(taskLabel)
        task.appendChild(delButton)

        delButton.addEventListener(("click"), (element) => {
            delTaskCallback(getTaskName(element))
        })

        input.addEventListener(("click"), (element) => {
            checkOneCallback(element)
        })

    })



}




function counterUpdate() {
    let completedTasks = new Number;
    let activeTasks = new Number;
    let allTaskCounter = new Number;
    TaskArray.forEach((value) =>
        value.status ? completedTasks++ : activeTasks++
    )

    completedTaskCounter.textContent = completedTasks
    activeTaskCounter.textContent = activeTasks
    allTaskCounter.textContent = activeTasks + completedTasks
    console.log("here")
    checkAllButton.disabled = !allTaskCounter.textContent
}


function addTask() {

    let nameString = nameInput.value
    nameString = escapeExp(nameString)
    if (TaskArray.find((item) => {
        return item.name === nameString
    }) !== undefined
    ) {
        alert("COPY DETECTED")
        return 0
    }
    console.info(`added element with name ${nameString}!!`)
    TaskArray.push({ name: nameString, status: false })

    checkAllButton.checked = false;

    renderTask(TaskArray)
}

function pageGenerate(onlyActive = undefined){
    pageContainer.innerHTML = ""
    //remake !!!!!!
    for (i=0;i<TaskArray.length;i++){
        if (onlyActive === true && TaskArray[i].status) return
        else if (onlyActive === false && !TaskArray[i].status) return
        let page= document.createElement("button")
        page.innerHTML = i
        pageContainer.appendChild(page)
    }

}

function getTaskName(element) {
    console.log(element.target.parentElement.children[1].innerHTML)
    return element.target.parentElement.children[1].innerHTML
}


checkAllButton.addEventListener("click", (element) => {
    TaskArray.forEach((item, index) => {
        console.log(index)
        TaskArray[index].status = element.target.checked
    })

    renderTask(TaskArray)
    counterUpdate()
}
)


submitButton.addEventListener("click", () => {
    addTask();
    counterUpdate()
}
)
activeTaskCounter.parentElement.addEventListener("click", () => {
    renderTask(TaskArray, true)
})
completedTaskCounter.parentElement.addEventListener("click", () => {
    renderTask(TaskArray, false)
})
allTaskCounter.parentElement.addEventListener("click", () => {
    renderTask(TaskArray)
})
//useless
document.addEventListener("click", (element) => {
    console.debug("clicked", element)
}
)
//})();


