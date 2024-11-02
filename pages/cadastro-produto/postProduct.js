document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
});

async function loadCategories() {
  try {
    const token = sessionStorage.getItem("token"); 
    if (!token) {
      alert("Você precisa estar autenticado para carregar as categorias.");
      window.location.href = "/autenticacao/login.html"; 
      return;
    }

    const categoryResponse = await fetch("http://localhost:3000/api/categories/", {
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    });

    const categories = await categoryResponse.json();
    const categorySelect = document.getElementById("product-category");

    categorySelect.innerHTML = ""; 

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option); 
    });
  } catch (error) {
    console.error("Erro ao carregar as categorias:", error);
  }
}

async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("product-name").value;
  const description = document.getElementById("product-description").value;
  const price = document.getElementById("product-price").value;
  const category = document.getElementById("product-category").value;
  const image = document.getElementById("product-image").files[0]; 

  if (!category) {
    alert("Por favor, selecione uma categoria!");
    return;
  }

  
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  if (image) {
    formData.append(`image_url`, image); 
  }

  try {
    const token = sessionStorage.getItem("token"); 
    if (!token) {
      alert("Você precisa estar autenticado para adicionar produtos.");
      window.location.href = "login.html"; 
      return;
    }

  
    const response = await fetch("http://localhost:3000/api/menu/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
      body: formData, 
    });

    const result = await response.json();
    document.getElementById("insert-result").textContent =
      result.name + " adicionado com sucesso!";

   
    setTimeout(() => {
      window.location.href = `../../index.html?${Date.now()}`;
    }, 200);
  } catch (error) {
    console.error("Erro ao adicionar o produto:", error);
    document.getElementById("insert-result").textContent =
      "Erro ao adicionar o produto.";
  }
}


document.querySelector("form").addEventListener("submit", addProduct);
console.log("success");
