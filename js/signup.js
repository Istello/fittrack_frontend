import URL from "./url.js";

const signupForm = document.querySelector(".auth-form");
const submitButton = signupForm.querySelector('button[type="submit"]');

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = signupForm.username.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;
  const terms = signupForm.terms.checked;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (!terms) {
    alert("You must agree to the terms before creating an account.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Creating Account...";

  try {
    const response = await fetch(`${URL()}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Unable to create your account.");
    }

    alert("Account created successfully.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message || "Something went wrong. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Create Account";
  }
});
