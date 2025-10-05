let tasks= [];

const Local_Storage_Key = "taskList";

const taskinput = document.getElementById("taskInput");
const taskbutton = document.getElementById("addTaskButton");
const taskfilter = document.getElementById("taskFilter");
const tasksearch = document.getElementById("searchtask");
const tasklist = document.getElementById("taskList");
const taskcount = document.getElementById("task-count");
const taskcompleted = document.getElementById("clearcompleted");

const tasktemplate = document.getElementById("taskTemplate");

const Task = {
    create:function(text){
        return {
            id: Date.now(),// Unique ID based on current timestamp
            text: text,
            completed: false,
            createdAt: new Date()
        };
    }
} 
 
function addtask(text) {
    if (text.trim() === "")
        return;
    //creating a new task
    const newTask = Task.create(text);
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskinput.value="";
    // Save to local storage
    //render the task list ul

    
}
function saveTasks(){
    localStorage.setItem(Local_Storage_Key, JSON.stringify(tasks));
}
function loadtasks() {
    const storedTasks = localStorage.getItem(Local_Storage_Key);
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } 
}

function filteredtasks(){
    const filter = taskfilter.value;
    const search = tasksearch.value.toLowerCase();
    let filteredTasks = tasks;

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (search) {
        filteredTasks = filteredTasks.filter(function(task){
           return task.text.toLowerCase().includes(search);
    
        })
            }

    return filteredTasks;

}
function updateTaskCount() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskcount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();   
}
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });  
    saveTasks();
    renderTasks();
  }
function renderTasks() {
    const taskToRender = filteredtasks();
    tasklist.innerHTML = ""; // Clear the current list
    taskToRender.forEach(element => {
        const taskElement = tasktemplate.content.cloneNode(true);
        const taskitem = taskElement.querySelector(".task");
        const taskText = taskElement.querySelector(".task-text");
        const taskCheckbox = taskElement.querySelector(".task-checkbox");
        const taskDeleteButton = taskElement.querySelector(".delete-task");
        taskCheckbox.checked = element.completed;
        taskText.textContent = element.text;
        if( element.completed) {
            taskitem.classList.add("completed");
        }
        taskCheckbox.addEventListener("change", () => toggleTask(element.id));
        taskDeleteButton.addEventListener("click", () => deleteTask(element.id));
          
            tasklist.appendChild(taskElement);
    });
    updateTaskCount();
}

taskbutton.addEventListener("click", function() {
    addtask(taskinput.value);

});

taskinput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addtask(taskinput.value);
    }
});

taskfilter.addEventListener("change", function() {
    renderTasks();
}); 


tasksearch.addEventListener("input", function() {
    renderTasks();
});


taskcompleted.addEventListener("click", function() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

loadtasks();
renderTasks(); // Initial render of tasks   

