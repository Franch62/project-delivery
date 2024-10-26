const API_URL = "http://localhost:3000/api/auth";

async function register() {
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  document.getElementById("register-message").innerText = data.message;
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    // Redireciona para dashboard.html se o login for bem-sucedido
    window.location.href = "../../index.html";
  } else {
    document.getElementById("login-message").innerText = data.message;
  }
}
