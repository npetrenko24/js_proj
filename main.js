(() => {
  const TASKS_ON_PAGE = 5;
  const DOUBLE_CLICK = 2;
  const ESCAPEKEYCODE = "Escape";
  const ENTERKEYCODE = "Enter";

  const taskContainer = document.querySelector("#task-container");
  const countersContainer = document.querySelector("#counter-container");
  const pageContainer = document.querySelector("#page-container");
  const completedTaskCounter = document.querySelector("#completed-tasks-count");
  const activeTaskCounter = document.querySelector("#active-tasks-count");
  const allTaskCounter = document.querySelector("#all-tasks-count");
  const taskTextInput = document.querySelector("#nameholder");
  const checkAllButton = document.querySelector("#check-all");
  const addButton = document.querySelector("#add-button");
  const deleteAllCompletedButton = document.querySelector(
    "#delete-all-completed"
  );

  let taskArray = [];
  let modeRender = NaN;
  let currentPage = 1;
  let totalPages = 0;

  const getTaskUserInput = (taskEvent) => {
    return taskEvent.target.parentElement.children[2];
  };

  const getTaskText = (taskEvent) => {
    return taskEvent.target.parentElement.children[1];
  };

  const getTaskId = (taskEvent) => {
    return Number(taskEvent.target.parentElement.id);
  };

  const deleteTask = (taskId) => {
    taskArray = taskArray.filter((task) => task.id !== taskId);

    generateElement();
  };

  const excapeExprAndBlank = (string) => {
    let protectedString = string.trim();
    protectedString = protectedString
      .replace(/ {2,}/g, " ")
      .replace(/>/g, "&gt")
      .replace(/</g, "&lt");
    if (string === "" || string === " ") return false;

    return protectedString;

  };

  const updateTasksCounter = () => {
    let activeTasks = 0;
    let completedTasks = 0;
    taskArray.forEach((task) => {
      task.isChecked ? completedTasks++ : activeTasks++;
    });
    activeTaskCounter.textContent = activeTasks;
    completedTaskCounter.textContent = completedTasks;
    allTaskCounter.textContent = activeTasks + completedTasks;
    activeTasks + completedTasks === 0
      ? (checkAllButton.disabled = true)
      : (checkAllButton.disabled = false);
    activeTasks === 0 && completedTasks !== 0
      ? (checkAllButton.checked = true)
      : (checkAllButton.checked = false);
  };

  const refreshTotalPageCounter = (renderList) => {
    let pageCount = Math.ceil(renderList.length / TASKS_ON_PAGE);
    totalPages = pageCount;
  };

  const createPageButtons = (renderList) => {
    let string = "";
    refreshTotalPageCounter(renderList);

    for (let i = 0; i < totalPages; i++) {
      string += `<button class="${
        i === currentPage - 1 ? "current-page" : ""
      }">${i + 1}</button>`;
    }
    pageContainer.innerHTML = string;
  };

  const generatePagedContent = (renderList, page = currentPage) => {
    let pageList = renderList.slice(
      TASKS_ON_PAGE * (page - 1),
      TASKS_ON_PAGE * page
    );
    render(pageList);
  };

  const generateElement = () => {
    let fetchedTaskArray = {};

    if (isNaN(modeRender)) fetchedTaskArray = taskArray;
    else {
      fetchedTaskArray = taskArray.filter(
        (task) => task.isChecked === modeRender
      );
    }
    updateTasksCounter();
    createPageButtons(fetchedTaskArray);
    generatePagedContent(fetchedTaskArray);
    return fetchedTaskArray;
    
  };

  const render = (renderList) => {
    let renderedTasks = "";

    renderList.forEach((task) => {
      renderedTasks += `<li id="${task.id}" class="task">
        <input type="checkbox" class="task-checkbox" ${
          task.isChecked ? "checked" : ""
        }>
        <span class="task-textbox">${task.taskText}</span>
        <input hidden maxlength="255" class="task-input" contenteditable></input>
        <button class="task-delbutton">X</button></li>`;
    });
    taskContainer.innerHTML = renderedTasks;
  };

  const addTask = () => {
    let nameString = excapeExprAndBlank(taskTextInput.value);
    if (nameString === false) return;
    const newTask = { id: Date.now(), taskText: nameString, isChecked: false };

    taskArray.push(newTask);
    taskTextInput.value = "";
    checkAllButton.checked = false;
    taskTextInput.focus();
    modeRender = NaN;
    countersContainer.querySelector(".current-counter").className = "counter";
    allTaskCounter.parentElement.className += " current-counter";
    switchPage(false);
  };

  const changeTaskText = (id, taskText) => {
    const formatedText = excapeExprAndBlank(taskText);
    if (!formatedText) return generateElement();

    taskArray.forEach((task, index) => {
      if (task.id === id) {
        taskArray[index].taskText = formatedText;
      }
    });
    generateElement();
  };

  const cancelEditingTaskText = (event) => {
    let taskTextElement = getTaskText(event);

    event.target.hidden = true;
    taskTextElement.hidden = false;
  };

  const changeAllTasksStatus = (event) => {
    let isChecked = event.target.checked;
    taskArray.forEach((_, index) => {
      taskArray[index].isChecked = isChecked;
    });
    generateElement();
    switchPage(true);
  };

  const switchPage = (isDelete) => {
    refreshTotalPageCounter(generateElement());
    if (
      (currentPage > totalPages && isDelete) ||
      (currentPage < totalPages && !isDelete)
    ) {
      totalPages === 0 ? (currentPage = 1) : (currentPage = totalPages);
      generateElement();
    }
  };

  const blurTaskCallback = (event) => {
    console.log(event);

    const taskId = getTaskId(event);
    const taskText = getTaskUserInput(event).value;
    changeTaskText(taskId, taskText);
  };

  const handleClick = (event) => {
    const taskId = Number(event.target.parentElement.id);

    if (event.target.className === "task-delbutton") {
      deleteTask(taskId);
      switchPage(true);
    }
    if (event.target.className === "task-checkbox") {
      taskArray.forEach((task) => {
        if (task.id === taskId) {
          task.isChecked = event.target.checked;
          generateElement();
          switchPage(true);
        }
      });
    }
    if (
      event.detail === DOUBLE_CLICK &&
      event.target.className === "task-textbox"
    ) {
      let taskInputElement = getTaskUserInput(event);
      event.target.hidden = true;

      taskInputElement.hidden = false;
      taskInputElement.focus();
      taskInputElement.value = event.target.textContent;
      taskInputElement.onblur = blurTaskCallback;
    }
  };

  const handleKeyUp = (event) => {
    if (
      event.target.className === "task-input" &&
      event.key === ESCAPEKEYCODE
    ) {
      event.target.focus();
      let taskUserInput = getTaskUserInput(event);
      taskUserInput.onblur = "";
      cancelEditingTaskText(event);
    }
    if (event.target.className === "task-input" && event.key === ENTERKEYCODE) {
      let taskInputElement = event.target;
      let taskTextElement = getTaskText(event);
      const taskId = getTaskId(event);
      taskInputElement.hidden = true;
      taskTextElement.hidden = false;
      changeTaskText(taskId, taskInputElement.value);
      taskInputElement.hidden = true;
      taskTextElement.hidden = false;
    }
  };

  const counterClickCallback = (event) => {
    if (event.target.tagName == "BUTTON") {
      countersContainer.querySelector(".current-counter").className = "counter";
      event.target.parentElement.className += " current-counter";
    }
    if (event.target.id === "completed-tasks-button") {
      modeRender = true;
      currentPage = 1;
      switchPage(true);
    }
    if (event.target.id === "active-tasks-button") {
      modeRender = false;
      currentPage = 1;
      switchPage(true);
    }
    if (event.target.id === "all-tasks-button") {
      modeRender = NaN;
      currentPage = 1;
      switchPage(true);
    }
  };
  let deleteAllCallback = () => {
    taskArray = taskArray.filter((task) => !task.isChecked);

    switchPage(true);
  };

  let pageButtonCallback = (event) => {
    if (event.target.localName === "button") {
      const pageCount = Number(event.target.textContent);
      console.log(pageCount);
      event.target.disabled;
      currentPage = pageCount;
      generateElement();
    }
  };

  countersContainer.addEventListener("click", counterClickCallback);

  checkAllButton.addEventListener("click", changeAllTasksStatus);

  taskContainer.addEventListener("click", handleClick);

  taskContainer.addEventListener("keyup", handleKeyUp);

  addButton.addEventListener("click", addTask);

  pageContainer.addEventListener("click", pageButtonCallback);

  taskTextInput.addEventListener("keyup", (event) => {
    event.key == ENTERKEYCODE ? addTask() : false;
  });

  deleteAllCompletedButton.addEventListener("click", deleteAllCallback);
})();
