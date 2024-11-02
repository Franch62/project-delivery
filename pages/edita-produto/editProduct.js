document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const token = sessionStorage.getItem("token"); 
  if (!token) {
    alert("Você precisa estar autenticado para editar produtos.");
    window.location.href = "/pages/autenticacao/login.html"; 
    return;
  }

  
  try {
    const response = await fetch(`https://api-order-menu.onrender.com/api/menu/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const product = await response.json();

    document.getElementById("product-name").value = product.name;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-price").value = product.price;
    document.getElementById("current-image-url").value = product.image_url;


    const categoryResponse = await fetch(
      "https://api-order-menu.onrender.com/api/categories/",
      {
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      }
    );
    const categories = await categoryResponse.json();
    const categorySelect = document.getElementById("product-category");

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      if (category._id === product.category._id) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar o produto:", error);
  }
});


document
  .getElementById("edit-product-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("loading-spinner").style.display = "block";

    const id = new URLSearchParams(window.location.search).get("id");
    const name = document.getElementById("product-name").value;
    const description = document.getElementById("product-description").value;
    const price = document.getElementById("product-price").value;
    const category = document.getElementById("product-category").value;
    const image = document.getElementById("product-image").files[0];
    const currentImageUrl = document.getElementById("current-image-url").value;

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

    const token = sessionStorage.getItem("token"); 

    try {
      const response = await fetch(`https://api-order-menu.onrender.com/api/menu/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      document.getElementById("edit-result").textContent = result.message;

      setTimeout(() => {
        window.location.href = `../../index.html?${Date.now()}`;
      }, 200);
    } catch (error) {
      console.error("Erro ao editar o produto:", error);
    }
  });
