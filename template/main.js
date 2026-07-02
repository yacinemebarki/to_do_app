const sign_in =  document.getElementById("sign-in")
const sign_up = document.getElementById("sign-up")
const in_btn = document.getElementById("up-to-in-btn")
const up_btn = document.getElementById("in-to-up-btn")
const error_div = document.getElementById("error-message")

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

in_btn.addEventListener("click", () => {
    showError("hallo")
    switch_from_to(sign_up, sign_in);
});

up_btn.addEventListener("click", () => {
    switch_from_to(sign_in, sign_up);
});


