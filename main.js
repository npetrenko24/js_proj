const TaskArray = new Array();//true is checked, false not




document.addEventListener("click", (element)=>{
    if (element.target.className === "delbutton") {
        console.info("element will be deleted ", element.target.parentElement)

    }
    else if (element.target.className=== "complete_flag"){
        console.info("task completed", element.target)
    }
    console.debug("clicked", element)
}
)



function renderTask(){
    let resultString = ""
    document.getElementById("task_container").innerHTML=null
    TaskArray.forEach((item)=>{
        resultString+=`<div class="task">`
        if (item.status===true) {
            resultString+=`<input type="checkbox" class="complete_flag" checked="checked"></input><label>${item.name}</label>`
        }
        else{
            resultString+=`<input type="checkbox" class="complete_flag"></input><label>${item.name}</label>`
        }
        resultString+=`<button class="delbutton");'>X</button></div>`

    })
    document.getElementById("task_container").innerHTML += resultString
    

}


function delTask(item){
    const index = TaskArray.indexOf(item);
    const x = TaskArray.splice(index, 2);
    renderTask()
}

function addTask(){
    
    let nameString = document.getElementById("nameholder").value
    
    if( TaskArray.find((item)=>{
            return item.name === nameString 
            }) !== undefined
        ){
            alert("COPY DETECTED")
            return 0
        }
        console.info(`added element with name ${nameString}!!`)
    TaskArray.push({name:nameString,status:false})
    renderTask()
    //TaskArray.push()
}


