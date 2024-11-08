export function openModal(product) {
  const token = sessionStorage.getItem("token"); // Verifica se o usuário está autenticado
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalProductDetails");

  const srcImage =
    `https://api-order-menu.onrender.com/api/${product.image_url}`.replace(
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

  addToCartButton.onclick = () => {
    const amount = parseInt(inputProductAmount.value, 10);
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex >= 0) {
      // Atualiza a quantidade do produto existente
      cartItems[existingItemIndex].quantity += amount;
    } else {
      // Adiciona um novo produto ao carrinho
      cartItems.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: amount,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert(`${product.name} adicionado ao carrinho.`);
  };

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

export function closeModal() {
  const modal = document.getElementById("productModal");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const closeModalButton = document.getElementById("closeModalButton");
  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal);
  }
});

export function loadButtonCart(product) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `<button id="add-to-cart-button" class="add-to-cart-button btn-cart-mobile">Adicionar ao Carrinho: R$ ${product.price}</button>`;
}

window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
};
