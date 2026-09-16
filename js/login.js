import URL from "./url.js";

const loginForm = document.querySelector(".auth-form");
const submitButton = loginForm.querySelector('button[type="submit"]');

// Flag to prevent concurrent submission clicks
let isSubmitting = false;

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Immediately reject if a login request is already in progress
    if (isSubmitting) return;

    const usernameOrEmail = loginForm.usernameOrEmail.value.trim();
    const password = loginForm.password.value;

    // Set submit lock and disable the button UI
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
        const response = await fetch(`${URL()}/users/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernameOrEmail,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Invalid login credentials."
            );
        }

        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
        }

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);
        alert(error.message || "Unable to log in. Please try again.");
    } finally {
        // Release submit lock and restore UI button state
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.textContent = "Log In";
    }
});
