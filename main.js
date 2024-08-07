(() => {


    let TaskArray = [];//true is checked, false not
    // task array data like {name:"name", status:true/false}

    //it doesn't change status  
    let taskContainer = document.querySelector("#task-container")
    let completedTaskCounter = document.querySelector("#completed-tasks-count")
    let activeTaskCounter = document.querySelector("#active-tasks-count")
    let allTaskCounter = document.querySelector("#all-tasks-count")
    let nameInput = document.querySelector("#nameholder")
    let checkAllButton = document.querySelector("#check-all")
    let submitButton = document.querySelector("#submit-key")
    let deleteButton = null


    let completeTaskButton = null

//working on it
    function refreshDeleteQuery(){
        deleteButton = document.querySelectorAll("#delbutton").forEach((element)=>{element.addEventListener(("click"))})
    }

    function refreshCompleteQuery(){
        completeTaskButton = document.querySelectorAll(".complete-flag").forEach((element)=>{
            element.addEventListener(("click"), (el)=>{
                console.log("ELELLELE")
            }
        )
        }
    
        )
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






    function renderTask(TaskArray) {
        let resultString = new String;

        taskContainer.innerHTML = ""
        TaskArray.forEach((item) => {
            resultString += `<div class="task">`
            if (item.status === true) {
                resultString += `<input type="checkbox" class="complete-flag" checked="checked"></input><label>${item.name}</label>`
            }
            else {
                resultString += `<input type="checkbox" class="complete-flag"></input><label>${item.name}</label>`
            }
            resultString += `<button class="delbutton");'>X</button></div>`

        })
        taskContainer.innerHTML += resultString


    }


    function delTask(taskName) { // don't work well 
        //const index = TaskArray.indexOf(item);
        //const x = TaskArray.splice(index, 2);
        taskName = escapeExp(taskName)
        TaskArray = TaskArray.filter((value) => {
            if (value.name === escapeExp(taskName)) {
                return false
            }
            return true
        })

        renderTask(TaskArray)

    }

    function counterUpdate() {
        let completedTasks = new Number;
        let activeTasks = new Number;
        TaskArray.forEach((value) =>
            value.status ? completedTasks++ : activeTasks++
        )

        completedTaskCounter.textContent = completedTasks
        activeTaskCounter.textContent = activeTasks
        allTaskCounter.textContent = activeTasks + completedTasks
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
        refreshCompleteQuery()
    }

    function getTaskName(element) {
        return element.target.parentElement.children[1].textContent
    }

    


    //Listeners

    document.addEventListener("click", (element) => {
        // part of code used for deleting tasks
        if (element.target.className === "delbutton") {
            let taskName = getTaskName(element)
            console.info("element will be deleted", taskName)
            delTask(taskName)
            counterUpdate()
        }
    }
    )

    // completeTaskButton.addEventListener("click", (element)=>
    //     {

    //         TaskArray.forEach((value,index)=>{
    //            if (value.name===element.target.parentElement.children[1].textContent)
    //              { TaskArray[index].status=!(TaskArray[index].status)}
    //         })



    //         counterUpdate()
    //     } 
    // )


    checkAllButton.addEventListener("click", (element) => {
        if (element.target.checked) {
            console.info("check all", element.target)
            TaskArray.forEach((item, index) => {
                console.log(index)
                TaskArray[index].status = true
            })
        }
        else {
            console.info("decheck all", element.target)
            TaskArray.forEach((item, index) => {
                TaskArray[index].status = false
            })
        }
        renderTask(TaskArray)
        counterUpdate()
    }
    )

    submitButton.addEventListener("click", () => {
        console.log("gejkgejegjkk")
        addTask();
        counterUpdate()
    }
    )

    //useless
    document.addEventListener("click", (element) => {
        console.debug("clicked", element)
    }
    )
})();


