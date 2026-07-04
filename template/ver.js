const btn = document.getElementById("btn")
const email = localStorage.getItem('signupEmail')

btn.addEventListener("click", async () => {
    const code = document.getElementById("input").value 
    
    if (!code) {
        showError("Please enter the verification code")
        return
    }

    const response = await fetch("/verify",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            code: code           
        })     
    })
    const data = await response.json()

    if(!data.success){
        console.log(data.message)
        return
    }

    window.location.href = `index.html`

})