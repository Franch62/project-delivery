async function loadProductsByCategory() {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      const btnLogout = document.getElementById("btnLogin");
      btnLogout.textContent = "Log Out";
      btnLogout.onclick = function LogOut() {
        localStorage.removeItem("token");
        window.location.href = `../../index.html?${Date.now()}`;
      };
      const divButtons = document.getElementById("add-buttons");
      const btnAddProduct = document.createElement("a");
      btnAddProduct.classList.add("btnAddProduct");
      btnAddProduct.href = "/pages/cadastro-produto/postProduct.html";
      btnAddProduct.textContent = "+ Novo Produto";
      divButtons.appendChild(btnAddProduct);

      const btnAddCategory = document.createElement("a");
      btnAddCategory.classList.add("btnAddCategory");
      btnAddCategory.href = "/pages/cadastro-categoria/postCategory.html";
      btnAddCategory.textContent = "+ Nova Categoria";
      divButtons.appendChild(btnAddCategory);
      
    }

    const response = await fetch("http://localhost:3000/api/menu/", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar produtos");
    }

    const products = await response.json();

    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    // Organiza os produtos por categoria
    const productsByCategory = {};
    products.forEach((product) => {
      if (product.category && product.category.name) {
        const categoryName = product.category.name;
        const categoryId = product.category._id;

        if (!productsByCategory[categoryId]) {
          productsByCategory[categoryId] = {
            name: categoryName,
            items: [],
          };
        }
        productsByCategory[categoryId].items.push(product);
      }
    });

    for (const [categoryId, { name: categoryName, items }] of Object.entries(
      productsByCategory
    )) {
      const categoryElement = document.createElement("div");
      const categoryTitle = document.createElement("h1");
      categoryTitle.textContent = categoryName;
      categoryElement.appendChild(categoryTitle);

      if (token) {
        const deleteCategoryButton = document.createElement("button");
        deleteCategoryButton.textContent = "Excluir";
        deleteCategoryButton.classList.add("delete-category-button");

        deleteCategoryButton.addEventListener("click", async () => {
          if (
            confirm(
              `Tem certeza que deseja excluir a categoria ${categoryName}?`
            )
          ) {
            const success = await deleteCategory(categoryId, token);
            if (success) {
              alert(`${categoryName} foi excluído com sucesso.`);
              loadProductsByCategory();
            } else {
              alert("Erro ao excluir a categoria.");
            }
          }
        });

        categoryElement.appendChild(deleteCategoryButton);
      }

      items.forEach((item) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        const textCard = document.createElement("div");
        textCard.classList.add("text-card");
        const subCard = document.createElement("sub-card");
        subCard.classList.add("sub-card");
        const btnProducts = document.createElement("btn-products");
        btnProducts.classList.add("btn-products");

        const productName = document.createElement("h2");
        productName.textContent = item.name;

        const productImage = document.createElement("img");
        const srcImage = `http://localhost:3000/api/${item.image_url}`.replace(
          "\\",
          "/"
        );
        productImage.src = srcImage;
        productImage.alt = item.name;

        const productDescription = document.createElement("p");
        productDescription.textContent = item.description;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Preço: R$ ${item.price}`;
        
        textCard.appendChild(productName);
        textCard.appendChild(productDescription);
        textCard.appendChild(productPrice);
        subCard.appendChild(textCard);
        subCard.appendChild(productImage);
        productCard.appendChild(subCard)
        if (token) {
          const editButton = document.createElement("button");
          editButton.textContent = "Editar";
          editButton.classList.add("edit-button");
          editButton.addEventListener("click", () => {
            window.location.href = `/pages/edita-produto/editProduct.html?id=${item._id}`;
          });
          
          const deleteProductButton = document.createElement("button");
          deleteProductButton.textContent = "Excluir";
          deleteProductButton.classList.add("delete-product-button");
          deleteProductButton.addEventListener("click", async () => {
            if (confirm(`Tem certeza que deseja excluir ${item.name}?`)) {
              const success = await deleteProduct(item._id, token);
              if (success) {
                alert(`${item.name} foi excluído com sucesso.`);
                loadProductsByCategory();
              } else {
                alert("Erro ao excluir o produto.");
              }
            }
          });

          btnProducts.appendChild(editButton);
          btnProducts.appendChild(deleteProductButton);
          productCard.appendChild(btnProducts)
        }


        categoryElement.appendChild(productCard);
      });

      productsContainer.appendChild(categoryElement);
    }
  } catch (error) {
    console.error("Erro ao carregar os produtos por categoria:", error);
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML =
      "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}


async function deleteProduct(productId, token) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/menu/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao excluir o produto");
    }

    return true;
  } catch (error) {
    console.error("Erro ao excluir o produto:", error);
    return false;
  }
}

async function deleteCategory(categoryId, token) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao excluir a categoria");
    }

    return true;
  } catch (error) {
    console.error("Erro ao excluir a categoria:", error);
    return false;
  }

  function addToCart(item) {
    alert(`${item.name} foi adicionado ao carrinho!`);
    // Aqui, você pode incluir a lógica para manipular o carrinho
  }
  

}



window.onload = () => {
  loadProductsByCategory();
};
