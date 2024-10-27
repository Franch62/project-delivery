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
      btnAddProduct.id = "btn-main";
      btnAddProduct.href = "/pages/cadastro-produto/postProduct.html";
      btnAddProduct.textContent = "+ Novo Produto";
      divButtons.appendChild(btnAddProduct);

      const btnAddCategory = document.createElement("a");
      btnAddCategory.classList.add("btnAddCategory");
      btnAddCategory.id = "btn-main";
      btnAddCategory.href = "/pages/cadastro-categoria/postCategory.html";
      btnAddCategory.textContent = "+ Nova Categoria";
      divButtons.appendChild(btnAddCategory);
    }

    const response = await fetch(
      "https://api-order-menu.vercel.app/api/menu/",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

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
        const producItem = document.createElement("a");
        producItem.classList.add("product-item");
        producItem.href = "javascript:void(0)"; // Evita navegação padrão
        producItem.onclick = () => openModal(item); // Abre o modal com detalhes do produto

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productMedia = document.createElement("div");
        productMedia.classList.add("product-media");

        const subCard = document.createElement("div");
        subCard.classList.add("sub-card");

        const btnProducts = document.createElement("div");
        btnProducts.classList.add("btn-products");

        const productName = document.createElement("h2");
        productName.textContent = item.name;

        const productImage = document.createElement("img");
        const srcImage =
          `https://api-order-menu.vercel.app/api/${item.image_url}`.replace(
            "\\",
            "/"
          );

        productImage.src = srcImage;
        productImage.alt = item.name;

        const productDescription = document.createElement("p");
        productDescription.textContent = item.description;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Preço: R$ ${item.price}`;

        productMedia.appendChild(productName);
        productMedia.appendChild(productDescription);
        productMedia.appendChild(productPrice);

        subCard.appendChild(productMedia);
        subCard.appendChild(productImage);
        productCard.appendChild(subCard);

        producItem.appendChild(productCard);
        categoryElement.appendChild(producItem);
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
      `https://api-order-menu.vercel.app/api/menu/${productId}`,
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
      `https://api-order-menu.vercel.app/api/categories/${categoryId}`,
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
}

function openModal(product) {
  const token = localStorage.getItem("token"); // Verifica se o usuário está autenticado
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalProductDetails");
  const srcImage = `https://api-order-menu.vercel.app/api/${product.image_url}`.replace("\\", "/");

  // Conteúdo do modal com os detalhes do produto
  modalContent.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${srcImage}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
    <p>${product.description}</p>
    <p><strong>Preço:</strong> R$ ${product.price}</p>
  `;

  // Se o token estiver presente, adiciona os botões "Editar" e "Excluir" dentro do modal
  if (token) {
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-products-modal");

    // Botão Editar
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-button");
    editButton.onclick = () => {
      window.location.href = `/pages/edita-produto/editProduct.html?id=${product._id}`;
    };
    btnContainer.appendChild(editButton);

    // Botão Excluir
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = async () => {
      if (confirm(`Tem certeza que deseja excluir ${product.name}?`)) {
        const success = await deleteProduct(product._id, token);
        if (success) {
          alert(`${product.name} foi excluído com sucesso.`);
          closeModal();
          loadProductsByCategory(); // Atualiza a lista de produtos
        } else {
          alert("Erro ao excluir o produto.");
        }
      }
    };
    btnContainer.appendChild(deleteButton);

    modalContent.appendChild(btnContainer);
  }

  // Exibe o modal
  document.body.classList.add("modal-open");
  modal.style.display = "flex";
}

function closeModal() {
  document.body.classList.remove("modal-open");
  const modal = document.getElementById("productModal");
  modal.style.display = "none";
}


window.onload = () => {
  loadProductsByCategory();
};
