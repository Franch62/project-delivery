async function loadProductsByCategory() {
  try {
    const token = sessionStorage.getItem("token");

    if (token) {
      const btnLogout = document.getElementById("btnLogin");
      btnLogout.textContent = "Log Out";
      btnLogout.onclick = function LogOut() {
        sessionStorage.removeItem("token");
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

    const response = await fetch("https://api-order-menu.onrender.com/api/menu/", {
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
      categoryElement.classList.add("category");

      // Criar título da categoria com botão de excluir e seta
      const categoryTitle = document.createElement("div");
      categoryTitle.classList.add("category-title");

      const titleText = document.createElement("span");
      titleText.classList.add("category-name");
      titleText.textContent = categoryName;

      // Somente exibe o botão de excluir se o token estiver presente
      if (token) {
        const deleteCategoryButton = document.createElement("button");
        deleteCategoryButton.textContent = "X";
        deleteCategoryButton.classList.add("delete-category-button");

        // Função para excluir a categoria
        deleteCategoryButton.addEventListener("click", async (event) => {
          event.stopPropagation();
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

        categoryTitle.appendChild(deleteCategoryButton);
      }

      const toggleArrow = document.createElement("span");
      toggleArrow.classList.add("toggle-arrow");
      toggleArrow.textContent = "▼";

      categoryTitle.onclick = () => {
        const productsList = categoryElement.querySelector(".products-list");
        const isOpen = productsList.style.display === "block";
        if (isOpen) {
          productsList.style.maxHeight = "0";
          productsList.style.opacity = "0";
          toggleArrow.textContent = "▼";

          setTimeout(() => {
            productsList.style.display = "none";
          }, 300);
        } else {
          productsList.style.display = "block";
          requestAnimationFrame(() => {
            productsList.style.maxHeight = productsList.scrollHeight + "px";
            productsList.style.opacity = "1";
          });
          toggleArrow.textContent = "▲";
        }
      };

      categoryTitle.appendChild(titleText);
      categoryTitle.appendChild(toggleArrow);
      categoryElement.appendChild(categoryTitle);

      const productsList = document.createElement("div");
      productsList.classList.add("products-list");
      productsList.style.display = "none";

      items.forEach((item) => {
        const producItem = document.createElement("a");
        producItem.classList.add("product-item");
        producItem.href = "javascript:void(0)";
        producItem.onclick = () => openModal(item);

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productMedia = document.createElement("div");
        productMedia.classList.add("product-media");

        const productName = document.createElement("h2");
        productName.textContent = item.name;

        const productImage = document.createElement("img");
        const srcImage = `https://api-order-menu.onrender.com/api/${item.image_url}`.replace(
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
        productCard.appendChild(productMedia);
        productCard.appendChild(productImage);
        producItem.appendChild(productCard);
        productsList.appendChild(producItem);
      });

      categoryElement.appendChild(productsList);
      productsContainer.appendChild(categoryElement);
    }
  } catch (error) {
    console.error("Erro ao carregar os produtos por categoria:", error);
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML =
      "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}

// Função para excluir produtos
async function deleteProduct(productId, token) {
  try {
    const response = await fetch(
      `https://api-order-menu.onrender.com/api/menu/${productId}`,
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

// Função para excluir categorias
async function deleteCategory(categoryId, token) {
  try {
    const response = await fetch(
      `https://api-order-menu.onrender.com/api/categories/${categoryId}`,
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
  const token = sessionStorage.getItem("token"); // Verifica se o usuário está autenticado
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalProductDetails");

  const srcImage = `https://api-order-menu.onrender.com/api/${product.image_url}`.replace(
    "\\",
    "/"
  );

  modalContent.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${srcImage}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
      <p>${product.description}</p>
      <div class="input-group input-group-lg">
          <span class="input-group-btn">
              <button type="button" id="btn-minus" class="btn btn-default btn-minus">
                  <span class="fa fa-minus"></span>
              </button>
          </span>
          <input class="input-amount" id="Amount" type="number" value="1" min="1" max="99">
          <span class="input-group-btn">
              <button type="button" id="btn-plus" class="btn btn-default btn-plus">
                  <span class="fa fa-plus"></span>
              </button>
          </span>
      </div>
      <p><strong>Preço:</strong> R$ ${product.price}</p>
      <button id="add-to-cart-button">Adicionar ao Carrinho: R$ ${product.price}</button>
  `;

  const inputProductAmount = document.getElementById("Amount");
  const btnMinus = document.getElementById("btn-minus");
  const btnPlus = document.getElementById("btn-plus");
  const addToCartButton = document.getElementById("add-to-cart-button");

  const updateButtonLabel = () => {
    const amount = parseInt(inputProductAmount.value, 10);
    const totalPrice = (amount * product.price).toFixed(2);
    addToCartButton.textContent = `Adicionar ao Carrinho: R$ ${totalPrice}`;
  };

  btnMinus.onclick = function decrementAmount() {
    let currentAmount = parseInt(inputProductAmount.value, 10);
    if (currentAmount > 1) {
      currentAmount--;
      inputProductAmount.value = currentAmount;
      updateButtonLabel();
    } else {
      alert("A quantidade não pode ser menor que um!");
    }
  };

  btnPlus.onclick = function incrementAmount() {
    let currentAmount = parseInt(inputProductAmount.value, 10);
    if (currentAmount < 99) {
      currentAmount++;
      inputProductAmount.value = currentAmount;
      updateButtonLabel();
    } else {
      alert("A quantidade não pode ser maior que noventa e nove!");
    }
  };

  inputProductAmount.addEventListener("input", updateButtonLabel);

  updateButtonLabel();

  if (token) {
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-products-modal");

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-button");
    editButton.onclick = () => {
      window.location.href = `/pages/edita-produto/editProduct.html?id=${product._id}`;
    };
    btnContainer.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = async () => {
      if (confirm(`Tem certeza que deseja excluir ${product.name}?`)) {
        const success = await deleteProduct(product._id, token);
        if (success) {
          alert(`${product.name} foi excluído com sucesso.`);
          closeModal();
          loadProductsByCategory();
        } else {
          alert("Erro ao excluir o produto.");
        }
      }
    };
    btnContainer.appendChild(deleteButton);

    modalContent.appendChild(btnContainer);
  }

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("productModal");
  modal.style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
};

loadProductsByCategory();
