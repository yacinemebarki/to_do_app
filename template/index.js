const add_button = document.getElementById("add-btn")
const frame = document.getElementById("add-task")
const save_btn = document.getElementById("save-btn")
const edit_btn = document.getElementById("edit-btn")
const todo_list = document.getElementById("to-do-list")
const today_list = document.getElementById("to-day-list")
const past_list = document.getElementById("time-end")

const email = localStorage.getItem("email");

async function build() {
    showError("called")
    const response = await fetch("/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })

    const data = await response.json()
    const name = document.getElementById("name")
    const score = document.getElementById("point")
    showError(data.user_name)

    name.innerText = data.user_name
    score.innerText = data.point

    const tasks = data.task
    for (const task of tasks) {
        const selectedTime = new Date(task.time)
        const minTime = new Date();
        minTime.setHours(minTime.getHours() + 2);

        const task_div = document.createElement("div")
        task_div.className = "info"

        task_div.innerHTML = `
            <div class="his-title" id="his-title">${task.title}</div>
            <div class="his-time" id="his-time">${task.time}</div>
            <div class="his-des" id="his-des">${task.des}</div>
            <div class="status" id="status" style="background-color:${task.status ? "#d4edda" : "#571515"}">
                ${task.status ? "did" : "not did"}
            </div>
        `
        todo_list.insertBefore(task_div, frame)

        if (selectedTime < minTime) {
            past_list.appendChild(task_div.cloneNode(true))
        } else if (selectedTime.getFullYear() === minTime.getFullYear() && selectedTime.getMonth() === minTime.getMonth() && selectedTime.getDate() === minTime.getDate()) {
            today_list.appendChild(task_div.cloneNode(true))
        }

        frame.style.display = "none"
    }
}
build()

const meeting = document.getElementById("meeting")
function validTime() {
    const now = new Date()

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    meeting.min = now.toISOString().slice(0, 16)
    console.log(meeting.min);
    console.log(meeting.value);
}


add_button.addEventListener("click", () => {
    frame.style.display = "block"
})

function showError(mes) {
    const error_div = document.getElementById("error-message")
    error_div.innerText = mes
    error_div.style.display = "flex"
    error_div.addEventListener("click", () => {
        error_div.style.display = "none"
    })
}

save_btn.addEventListener("click",async () => {
    validTime()

    var title = document.getElementById("task-title").value.trim()
    var des = document.getElementById("description").value.trim()
    var time = document.getElementById("meeting").value.trim()
    var status = document.getElementById("check").checked
    if (title === "" || des === "" || time === "") {
        showError("you must fill all fields")
        return
    }

    const selectedTime = new Date(time)
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
    `
    todo_list.insertBefore(task, frame)
    if (selectedTime < minTime) {
        past_list.appendChild(task_div.cloneNode(true))
    }
    else if (selectedTime.getFullYear() === minTime.getFullYear() && selectedTime.getMonth() === minTime.getMonth() && selectedTime.getDate() === minTime.getDate()) {
        today_list.appendChild(task.cloneNode(true))
    }

    frame.style.display = "none"

    const response = await fetch("/add_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            time: time,
            title: title,
            des: des,
            status: status
        })

    })

    const data = await response.json()
    if (data.success === true) {
        showError(data.message)
    }
    else {
        showError("cant add this task");
    }
})

todo_list.addEventListener("click", (e) => {
    const editingTask = e.target.closest(".info");

    if (!editingTask) return;

    const time = editingTask.querySelector(".his-time").innerText;

    document.getElementById("task-title").value = editingTask.querySelector(".his-title").innerText;
    document.getElementById("description").value = editingTask.querySelector(".his-des").innerText;
    document.getElementById("meeting").value = time
    document.getElementById("check").checked = editingTask.querySelector(".status").innerText === "did";

    frame.style.display = "block";
    document.querySelectorAll(".info").forEach(task => {
        if (task.querySelector(".his-time").innerText === time) {
            task.remove();
        }
    })
})

const remove_btn = document.getElementById("remove-btn")

remove_btn.addEventListener("click", () => {
    frame.style.display = "none"
})