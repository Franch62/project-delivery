document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar autenticado para adicionar uma nova categoria.");
    window.location.href = "/pages/autenticacao/login.html";
    return;
  }
});

async function addCategory(event) {
  event.preventDefault();

  const name = document.getElementById("category-name").value;
  const description = document.getElementById("category-description").value;

  if (!name) {
    alert("Por favor, insira um nome para a categoria.");
    return;
  }

  if (!confirm("Tem certeza de que deseja adicionar esta categoria?")) {
    return;
  }

  const categoryData = { name, description };

  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para adicionar categorias.");
      window.location.href = "/pages/autenticacao/login.html";
      return;
    }

    const response = await fetch("http://localhost:3000/api/categories/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (response.ok) {
      const result = await response.json();
      document.getElementById(
        "insert-result"
      ).textContent = `${result.name} adicionado com sucesso!`;
      document.getElementById("category-name").value = "";
      document.getElementById("category-description").value = "";
      setTimeout(
        () => (window.location.href = `../../index.html?${Date.now()}`),
        200
      );
    } else {
      throw new Error("Falha ao adicionar a categoria.");
    }
  } catch (error) {
    console.error(error);
    document.getElementById("insert-result").textContent =
      "Erro ao adicionar a categoria.";
  }
}

document.querySelector("form").addEventListener("submit", addCategory);
console.log("success");
