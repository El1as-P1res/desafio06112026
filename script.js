// ===== CONFIGURAÇÃO =====
// Coloque aqui a URL do endpoint de login da API usada na aula.
// Se ficar vazio, o formulário roda em modo demonstração (token falso).
const API_URL = "";

const form = document.getElementById("login-form");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submit");
const result = document.getElementById("result");
const tokenEl = document.getElementById("token");

function showLoggedIn(token) {
  form.hidden = true;
  result.hidden = false;
  tokenEl.textContent = token;
}

async function requestToken(email, password) {
  if (!API_URL) {
    await new Promise(r => setTimeout(r, 500));
    return "demo-access-token-" + btoa(email).slice(0, 12);
  }
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("E-mail ou senha incorretos.");
  const data = await response.json();
  if (!data.access_token) throw new Error("A API não retornou access_token.");
  return data.access_token;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    message.textContent = "Preencha e-mail e senha.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Entrando...";
  try {
    const token = await requestToken(email, password);
    sessionStorage.setItem("access_token", token);
    showLoggedIn(token);
  } catch (err) {
    message.textContent = err.message || "Não foi possível entrar. Tente novamente.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
  }
});

document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("access_token");
  result.hidden = true;
  form.hidden = false;
  form.reset();
});

const saved = sessionStorage.getItem("access_token");
if (saved) showLoggedIn(saved);
