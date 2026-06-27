const add_button = document.getElementById("add-btn")
const frame = document.getElementById("add-task")
const save_btn = document.getElementById("save-btn")
const edit_btn = document.getElementById("edit-btn")

var titme_label = document.getElementById("his-time")
var title_label = document.getElementById("his-title")
var status_label = document.getElementById("status")

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

showError("hello")
save_btn.addEventListener("click", () =>{
    var title = document.getElementById("task-title").value.trim()
    var des = document.getElementById("description").value.trim()
    var time = document.getElementById("meeting").value.trim()
    var status = document.getElementById("check").checked
    if(title === "" || des === "" || time === "" ){
        showError("you must fill all fields")
        return
    }
    titme_label.innerText = time
    title_label.innerText = title

    if(status == true){
        status_label.innerText = "did"
        status_label.style.backgroundColor = "#155724"
    }
    else{
        status_label.innerText = "not did"
        status_label.style.backgroundColor = "#571515"       
    }


    frame.style.display = "none"
})