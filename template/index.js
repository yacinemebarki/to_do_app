const add_button = document.getElementById("add-btn")
const frame = document.getElementById("add-task")
const save_btn = document.getElementById("save-btn")
const edit_btn = document.getElementById("edit-btn")
const todo_list = document.getElementById("to-do-list")

add_button.addEventListener("click", () => {
    frame.style.display = "block"
});

function showError(mes){
    const error_div = document.getElementById("error-message")
    error_div.innerText = mes
    error_div.style.display = "flex"
    error_div.addEventListener("click", () => {
        error_div.style.display = "none"
    })
}

save_btn.addEventListener("click", () => {
    var title = document.getElementById("task-title").value.trim()
    var des = document.getElementById("description").value.trim()
    var time = document.getElementById("meeting").value.trim()
    var status = document.getElementById("check").checked
    if(title === "" || des === "" || time === "" ){
        showError("you must fill all fields")
        return
    }
    const task = document.createElement("div")
    task.className = "info"

    task.innerHTML = `
        <div class="his-title">${title}</div>
        <div class="his-time">${time}</div>
        <div class="status" style="background-color:${status ? "#d4edda" : "#571515"}">
            ${status ? "did" : "not did"}
        </div>
    `;
    todo_list.insertBefore(task, frame)


    frame.style.display = "none"
})

const task = document.getElementById("info")

task.addEventListener("click", () => {
    const taskTitle = task.querySelector(".his-title").innerText;
    const taskTime = task.querySelector(".his-time").innerText;
    const taskStatus = task.querySelector(".status").innerText;

    var title = document.getElementById("task-title")
    var des = document.getElementById("description")
    var time = document.getElementById("meeting")
    var status = document.getElementById("check")

    title.innerText = taskTitle

})