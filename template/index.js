const add_button = document.getElementById("add-btn")
const frame = document.getElementById("add-task");
const save_btn = document.getElementById("save-btn")
const edit_btn = document.getElementById("edit-btn")

var titme_label = document.getElementById("his-time")
var title_label = document.getElementById("his-title")
var status_label = document.getElementById("status")

add_button.addEventListener("click", () => {
    frame.style.display = "block"
});

save_btn.addEventListener("click", () =>{
    const title = document.getElementById("task-title")
    const des = document.getElementById("description")
    const time = document.getElementById("meeting")
    const status = document.getElementById("check")
    
    if(!title || !des || !time){
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