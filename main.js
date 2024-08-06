let TaskArray = new Array();//true is checked, false not
// task array data like {name:"name", status:true/false}

//it doesn't change status  



//remake
function escapeExp(string){
    let isPreviousSpace=false
    let protectedString = ""
    for (let i=0; i<string.length;i++)
        if(string[i]===">"){
            protectedString+="&gt";
        }
        else if (string[i]==="<"){
            protectedString+="&lt;";
        }
        else if (string[i]=== " " && isPreviousSpace){
            isPreviousSpace = true;
            continue;
        }
        else if (string[i]=== " "){
            protectedString +=" "
            isPreviousSpace = true;
            continue
        }
        
        else{
            protectedString+=string[i];
            isPreviousSpace=false
        }
    return protectedString
}






function renderTask(TaskArray){
    let resultString = new String;

    document.getElementById("task-container").innerHTML=""
    TaskArray.forEach((item)=>{
        resultString+=`<div class="task">`
        if (item.status===true) {
            resultString+=`<input type="checkbox" class="complete-flag" checked="checked"></input><label>${item.name}</label>`
        }
        else{
            resultString+=`<input type="checkbox" class="complete-flag"></input><label>${item.name}</label>`
        }
        resultString+=`<button class="delbutton");'>X</button></div>`

    })
    document.getElementById("task-container").innerHTML += resultString
    

}


function delTask(taskName){ // don't work well 
    //const index = TaskArray.indexOf(item);
    //const x = TaskArray.splice(index, 2);
    TaskArray=TaskArray.filter((value)=>{
        if(value.name===taskName){
            return false
        }
        return true
    })
    
    renderTask(TaskArray)

}

function counterUpdate(){
    let completedTasks = new Number;
    let activeTasks = new Number;
    TaskArray.forEach((value)=>
        value.status ? completedTasks++ : activeTasks++
    )
    document.getElementById("completed-tasks-count").textContent = completedTasks
    document.getElementById("active-tasks-count").textContent = activeTasks
    document.getElementById("all-tasks-count").textContent = activeTasks+completedTasks
}

function addTask(){
    
    let nameString = document.getElementById("nameholder").value
    nameString = escapeExp(nameString)
    if( TaskArray.find((item)=>{
            return item.name === nameString 
            }) !== undefined
        ){
            alert("COPY DETECTED")
            return 0
        }
        console.info(`added element with name ${nameString}!!`)
    TaskArray.push({name:nameString,status:false})

    document.getElementById("check-all").checked = false;

    renderTask(TaskArray)
}






//Listeners

document.addEventListener("click", (element)=>{
    // part of code used for deleting tasks
    if (element.target.className === "delbutton") {
        let taskName =  element.target.parentElement.children[1].textContent
        console.info("element will be deleted",taskName)
        delTask(taskName)
        counterUpdate()
    }
}
)

document.addEventListener("click", (element)=>
    {
    if (element.target.className=== "complete-flag"){
        TaskArray.filter((value,index,array)=>{
           if (value.name===element.target.parentElement.children[1].textContent)
             { TaskArray[index].status=!(TaskArray[index].status)}
        })
        }
        

        counterUpdate()
    }

)

document.addEventListener("click", (element)=>{

    if (element.target.id=== "check-all"){
        if(element.target.checked){
            console.info("check all", element.target)
            TaskArray.forEach((item,index)=>{
                console.log(index)
                TaskArray[index].status=true
            })
        }
        else{
            console.info("decheck all", element.target)
            TaskArray.forEach((item,index)=>{
                TaskArray[index].status=false
            })
        }
        renderTask(TaskArray)
        counterUpdate()
    }

}
)

document.addEventListener("click", (element)=>{
    if(element.target.id=="submit-key"){
        addTask();
        counterUpdate()
    
    }

}
)

//useless
document.addEventListener("click", (element)=>{
    console.debug("clicked", element)}
)


