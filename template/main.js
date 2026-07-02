const { response } = require("express")

const sign_in =  document.getElementById("sign-in")
const sign_up = document.getElementById("sign-up")
const up_to_in_btn = document.getElementById("up-to-in-btn")
const in_to_up_btn = document.getElementById("in-to-up-btn")
const error_div = document.getElementById("error-message")
const in_btn = document.getElementById("in-btn")
const up_btn = document.getElementById("up-btn")

function showError(mes){
    const error_div = document.getElementById("error-message")
    error_div.innerText = mes
    error_div.style.display = "flex"
    error_div.addEventListener("click", () => {
        error_div.style.display = "none"
    })
}


function switch_from_to(hide, show){
    hide.classList.remove("fade-in");
    hide.classList.add('fade-out')

    setTimeout(() => {
        hide.style.display = 'none'
        show.style.display = 'grid'
        void show.offsetWidth;
        show.classList.remove('fade-out')
        show.classList.add('fade-in')
    },400)
}

up_to_in_btn.addEventListener("click", () => {
    showError("hallo")
    switch_from_to(sign_up, sign_in);
})

in_to_up_btn.addEventListener("click", () => {
    switch_from_to(sign_in, sign_up);
})

in_btn.addEventListener("click", async () => {
    const email = document.getElementById("email").value 
    const password = document.getElementById("password").value

    const reponse = await fetch("/sign_in",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    const data = await response.json()
    showError(data.message)
    if(data.success){
        window.location.href = "index.html"
    }
})




