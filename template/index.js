const add_button = document.getElementById("add-btn")
const frame = document.getElementById("add-task");
const save_btn = document.getElementById("save-btn")
const edit_btn = document.getElementById("edit-btn")

add_button.addEventListener("click", () => {
    frame.style.display = "block"
});

save_btn.addEventListener("click", () =>{
    const title = document.getElementById("task-title")
    const des = document.getElementById("description")
    const time = document.getElementById("meeting")

    frame.style.display = "none"
})