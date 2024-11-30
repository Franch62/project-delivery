document.getElementById("edit-product-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = new URLSearchParams(window.location.search).get("id");
  const name = document.getElementById("product-name").value;
  const description = document.getElementById("product-description").value;
  const price = document.getElementById("product-price").value;
  const category = document.getElementById("product-category").value;
  const image = document.getElementById("product-image").files[0];
  const currentImageUrl = document.getElementById("current-image-url").value;

  // Validações
  if (!name) {
    alert("Por favor, insira um nome para o produto.");
    return;
  }

  if (!description) {
    alert("Por favor, insira uma descrição para o produto.");
    return;
  }

  if (!price || isNaN(price)) {
    alert("Por favor, insira um preço válido.");
    return;
  }

  if (!category) {
    alert("Por favor, selecione uma categoria.");
    return;
  }

  if (!confirm("Tem certeza de que deseja salvar as alterações?")) {
    return;
  }

  // FormData
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  if (image) {
    formData.append("image_url", image);
  } else {
    formData.append("image_url", currentImageUrl);
  }

  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para editar produtos.");
      window.location.href = "/pages/autenticacao/login.html";
      return;
    }

    const response = await fetch(`http://localhost:3000/api/menu/${id}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      document.getElementById("edit-result").textContent = result.message;
      setTimeout(() => window.location.href = `../../index.html?${Date.now()}`, 200);
    } else {
      throw new Error("Erro ao salvar as alterações.");
    }
  } catch (error) {
    console.error(error);
    document.getElementById("edit-result").textContent = "Erro ao salvar as alterações.";
  }
});
