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

    for (const [categoryId, { name: categoryName, items }] of Object.entries(productsByCategory)) {
      const categoryElement = document.createElement("div");
      categoryElement.classList.add("category");

      // Criar título da categoria com botão de excluir e seta
      const categoryTitle = document.createElement("div");
      categoryTitle.classList.add("category-title");

      
      const titleText = document.createElement("span");
      titleText.classList.add("category-name");
      titleText.textContent = categoryName;

      const deleteCategoryButton = document.createElement("button");
      deleteCategoryButton.textContent = "X"; // Botão de excluir
      deleteCategoryButton.classList.add("delete-category-button");

      // Função para excluir a categoria
      deleteCategoryButton.addEventListener("click", async (event) => {
        event.stopPropagation(); // Impede que o clique feche a categoria
        if (confirm(`Tem certeza que deseja excluir a categoria ${categoryName}?`)) {
          const success = await deleteCategory(categoryId, token);
          if (success) {
            alert(`${categoryName} foi excluído com sucesso.`);
            loadProductsByCategory();
          } else {
            alert("Erro ao excluir a categoria.");
          }
        }
      });

      const toggleArrow = document.createElement("span");
      toggleArrow.classList.add("toggle-arrow");
      toggleArrow.textContent = "▼"; // Seta para indicar que a aba está fechada

     // Função para alternar a exibição dos produtos
    categoryTitle.onclick = () => {
      const productsList = categoryElement.querySelector(".products-list");
      const isOpen = productsList.style.display === "block";
      
      // Ajusta a exibição inicial
      if (isOpen) {
        // Animação de fechamento
        productsList.style.maxHeight = "0"; // Define a altura para 0
        productsList.style.opacity = "0"; // Define a opacidade para 0
        toggleArrow.textContent = "▼"; // Muda a seta para baixo

        setTimeout(() => {
          productsList.style.display = "none"; // Esconde a lista após a animação
        }, 300); // Tempo igual ao da animação
      } else {
        productsList.style.display = "block"; // Exibe a lista
        requestAnimationFrame(() => {
          productsList.style.maxHeight = productsList.scrollHeight + "px"; // Ajusta a altura para o conteúdo
          productsList.style.opacity = "1"; // Define a opacidade para 1
        });
        toggleArrow.textContent = "▲"; // Muda a seta para cima
      }
    };


      categoryTitle.appendChild(titleText);
      categoryTitle.appendChild(deleteCategoryButton);
      categoryTitle.appendChild(toggleArrow);
      categoryElement.appendChild(categoryTitle);

      // Criar uma lista para os produtos
      const productsList = document.createElement("div");
      productsList.classList.add("products-list");
      productsList.style.display = "none"; // Inicialmente oculta a lista de produtos

      items.forEach((item) => {
        const producItem = document.createElement("a");
        producItem.classList.add("product-item");
        producItem.href = "javascript:void(0)"; // Evita navegação padrão
        producItem.onclick = () => openModal(item); // Abre o modal com detalhes do produto

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productMedia = document.createElement("div");
        productMedia.classList.add("product-media");

        const productName = document.createElement("h2");
        productName.textContent = item.name;

        const productImage = document.createElement("img");
        const srcImage = `https://api-order-menu.vercel.app/api/${item.image_url}`.replace("\\", "/");
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
        productsList.appendChild(producItem); // Adiciona o item à lista de produtos
      });

      categoryElement.appendChild(productsList); // Adiciona a lista de produtos à categoria
      productsContainer.appendChild(categoryElement);
    }
  } catch (error) {
    console.error("Erro ao carregar os produtos por categoria:", error);
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}
// Função para excluir produtos
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

// Função para excluir categorias
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

// Função para abrir o modal
function openModal(product) {
  const token = localStorage.getItem("token"); // Verifica se o usuário está autenticado
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalProductDetails");
  const srcImage =
    `https://api-order-menu.vercel.app/api/${product.image_url}`.replace(
      "\\",
      "/"
    );

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

  modal.style.display = "block"; // Exibe o modal
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById("productModal");
  modal.style.display = "none"; // Oculta o modal
}

// Evento para fechar o modal ao clicar fora dele
window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
};

loadProductsByCategory(); // Chama a função para carregar produtos por categoria ao iniciar
