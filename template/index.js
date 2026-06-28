const add_button = document.getElementById("add-btn")
const frame = document.getElementById("add-task")
const save_btn = document.getElementById("save-btn")
const edit_btn = document.getElementById("edit-btn")
const todo_list = document.getElementById("to-do-list")

const meeting = document.getElementById("meeting")
function validTime(){
    const now = new Date()

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    meeting.min = now.toISOString().slice(0, 16)
    console.log(meeting.min);
    console.log(meeting.value);
}


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
    validTime()

    var title = document.getElementById("task-title").value.trim()
    var des = document.getElementById("description").value.trim()
    var time = document.getElementById("meeting").value.trim()
    var status = document.getElementById("check").checked
    if(title === "" || des === "" || time === "" ){
        showError("you must fill all fields")
        return
    }

    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 2);

    if (selectedTime < minTime) {
        showError("The meeting must be at least 2 hours from now.");
        return;
    }

    const task = document.createElement("div")
    task.className = "info"

    task.innerHTML = `
        <div class="his-title" id="his-title">${title}</div>
        <div class="his-time" id="his-time">${time}</div>
        <div class="his-des" id="his-des">${des}</div>
        <div class="status" id="status" style="background-color:${status ? "#d4edda" : "#571515"}">
            ${status ? "did" : "not did"}
        </div>
    `;
    todo_list.insertBefore(task, frame)


    frame.style.display = "none"
})

todo_list.addEventListener("click", (e) => {
    const task = e.target.closest(".info");

    if (!task) return;

    const task_title = task.querySelector(".his-title").innerText
    const task_des = task.querySelector(".his-des").innerText
    const task_time = task.querySelector(".his-time").innerText
    const task_status = task.querySelector(".status").innerText

    document.getElementById("task-title").value = task_title
    document.getElementById("description").value = task_des
    document.getElementById("meeting").value = task_time
    document.getElementById("check").checked = task_status === "did"

    frame.style.display = "block"
    task.remove()
})

const remove_btn = document.getElementById("remove-btn")

remove_btn.addEventListener("click", () => {
    frame.style.display = "none"
})