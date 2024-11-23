import { createButton } from "../../utils/utils.js";
import { openModal, closeModal } from "./modalHandler.js";

async function loadProductsByCategory() {
  try {
    const token = sessionStorage.getItem("token");
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = ""; // Limpa o container uma vez antes do loop

    if (token) {
      setupAuthUI();
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
    const productsByCategory = organizeProductsByCategory(products);

    const fragment = document.createDocumentFragment();

    for (const [categoryId, { name: categoryName, items }] of Object.entries(
      productsByCategory
    )) {
      const categoryElement = createCategoryElement(
        categoryName,
        categoryId,
        items,
        token
      );
      fragment.appendChild(categoryElement);
    }

    productsContainer.appendChild(fragment);
  } catch (error) {
    console.error("Erro ao carregar os produtos por categoria:", error);
    productsContainer.innerHTML =
      "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}

function setupAuthUI() {
  const btnLogout = document.getElementById("btnLogin");
  btnLogout.textContent = "Log Out";
  btnLogout.onclick = function LogOut() {
    sessionStorage.removeItem("token");
    window.location.href = `../../index.html?${Date.now()}`;
  };

  const divButtons = document.getElementById("add-buttons");
  divButtons.appendChild(
    createButton(
      "btnAddProduct",
      "+ Novo Produto",
      "/pages/cadastro-produto/postProduct.html"
    )
  );
  divButtons.appendChild(
    createButton(
      "btnAddCategory",
      "+ Nova Categoria",
      "/pages/cadastro-categoria/postCategory.html"
    )
  );
}

function organizeProductsByCategory(products) {
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
  return productsByCategory;
}

function createCategoryElement(categoryName, categoryId, items, token) {
  const categoryElement = document.createElement("div");
  categoryElement.classList.add("category");

  // Cabeçalho da categoria
  const categoryTitle = document.createElement("div");
  categoryTitle.classList.add("category-title");

  const titleText = document.createElement("span");
  titleText.classList.add("category-name");
  titleText.textContent = categoryName;

  // Botão de exclusão da categoria (somente para administradores)
  if (token) {
    const deleteCategoryButton = createDeleteButton(categoryName, categoryId);
    categoryTitle.appendChild(deleteCategoryButton);
  }

  const toggleArrow = document.createElement("span");
  toggleArrow.classList.add("toggle-arrow");
  toggleArrow.textContent = "▼";

  categoryTitle.onclick = () =>
    toggleProductsList(categoryElement, toggleArrow);
  categoryTitle.appendChild(titleText);
  categoryTitle.appendChild(toggleArrow);
  categoryElement.appendChild(categoryTitle);

  // Lista de produtos
  const productsList = createProductsList(items);
  categoryElement.appendChild(productsList);

  return categoryElement;
}

function createDeleteButton(categoryName, categoryId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("delete-category-button");
  deleteButton.onclick = async (event) => {
    event.stopPropagation();
    if (
      confirm(`Tem certeza que deseja excluir a categoria ${categoryName}?`)
    ) {
      const token = sessionStorage.getItem("token");
      const success = await deleteCategory(categoryId, token);
      if (success) {
        alert(`${categoryName} foi excluído com sucesso.`);
        loadProductsByCategory();
      } else {
        alert("Erro ao excluir a categoria.");
      }
    }
  };
  return deleteButton;
}

function createProductsList(items) {
  const productsList = document.createElement("div");
  productsList.classList.add("products-list");
  productsList.style.display = "none"; // Inicialmente oculto

  // Gerando os itens de produto
  items.forEach((item) => {
    const productItem = createProductItem(item);
    productsList.appendChild(productItem);
  });

  return productsList;
}

function createProductItem(item) {
  const productItem = document.createElement("a");
  productItem.classList.add("product-item");
  productItem.href = "javascript:void(0)";
  productItem.onclick = () => openModal(item);

  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  const productMedia = document.createElement("div");
  productMedia.classList.add("product-media");

  const productName = document.createElement("h2");
  productName.textContent = item.name;

  const productImage = document.createElement("img");
  const srcImage = `http://localhost:3000/api/${item.image_url}`.replace(
    /\\/g,
    "/"
  );
  productImage.src = srcImage;
  productImage.alt = item.name;
  productImage.loading = "lazy";

  const productDescription = document.createElement("p");
  productDescription.textContent = item.description;

  const productPrice = document.createElement("p");
  productPrice.textContent = `Preço: R$ ${item.price}`;

  productMedia.appendChild(productName);
  productMedia.appendChild(productDescription);
  productMedia.appendChild(productPrice);
  productCard.appendChild(productMedia);
  productCard.appendChild(productImage);
  productItem.appendChild(productCard);

  return productItem;
}

function toggleProductsList(categoryElement, toggleArrow) {
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
}

loadProductsByCategory();
