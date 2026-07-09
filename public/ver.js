const btn = document.getElementById("btn")
const email = localStorage.getItem('pendingEmail')

function showError(message) {
    const existing = document.querySelector('.error-message')
    if (existing) {
        existing.textContent = message
        existing.style.display = 'block'
        return
    }

    const errorDiv = document.createElement('div')
    errorDiv.className = 'error-message'
    errorDiv.textContent = message
    errorDiv.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:#e97270;color:#fff;border-radius:8px;z-index:1000;cursor:pointer;'
    errorDiv.addEventListener('click', () => {
        errorDiv.style.display = 'none'
    })
    document.body.appendChild(errorDiv)
}

btn.addEventListener("click", async () => {
    const code = document.getElementById("input").value

    if (!email) {
        showError("No email found for verification. Please sign in or sign up again.")
        return
    }

    if (!code) {
        showError("Please enter the verification code")
        return
    }

    const response = await fetch("/verify", {
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

    if (!data.success) {
        showError(data.message)
        return
    }

    localStorage.setItem('email', email)
    localStorage.removeItem('pendingEmail')
    window.location.href = `index.html`

})