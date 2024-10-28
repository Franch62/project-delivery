document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
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
    alert("Por favor, insira um nome.");
    return;
  }

  const categoryData = {
    name: name,
    description: description,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para adicionar categorias.");
      window.location.href = "/pages/autenticacao/login.html";
      return;
    }

    const response = await fetch(
      "https://api-order-menu.vercel.app/api/categories/",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao adicionar a categoria.");
    }

    const result = await response.json();
    document.getElementById(
      "insert-result"
    ).textContent = `${result.name} adicionado com sucesso!`;

    document.getElementById("category-name").value = "";
    document.getElementById("category-description").value = "";

    setTimeout(() => {
      window.location.href = `../../index.html?${Date.now()}`;
    }, 200);
  } catch (error) {
    console.error("Erro ao adicionar a categoria:", error);
    document.getElementById("insert-result").textContent =
      "Erro ao adicionar a categoria. Verifique os dados e tente novamente.";
  }
}

document.querySelector("form").addEventListener("submit", addCategory);
console.log("success");
