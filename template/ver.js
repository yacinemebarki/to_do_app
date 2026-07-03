const btn = document.getElementById("btn")

btn.addEventListener("click", async () => {
    const number = document.getElementById("input").value 

    const response = await fetch("/verify",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: number            
        })     
    })
    const data = await response.json()

    showError(data.message)
})