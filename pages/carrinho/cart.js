function fetchCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const srcImage = `http://localhost:3000/api/${item.image_url}`.replace(
      "\\",
      "/"
    );

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${srcImage}" alt="${
      item.name
    }" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
    <div class="cart-text-content">  
      <b><p>${item.name}</p></b>
      <b><p>Quantidade</b>: ${item.quantity}</p>
      <b><p>Preço:</b> R$ ${item.price}</b></p>
      <b><p>Total:</b> R$ ${itemTotal.toFixed(2)}</p>
     </div>
      <button onclick="removeFromCart('${item._id}')">Remover</button>
    `;
    cartContainer.appendChild(cartItem);
  });

  document.getElementById("cart-total").innerText = `R$ ${total.toFixed(2)}`;
}

// Função para remover um item do carrinho
function removeFromCart(itemId) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter((item) => item._id !== itemId);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  fetchCartItems(); // Recarrega os itens após a remoção
}

// Função para finalizar a compra
function finalizePurchase() {
  alert("Compra finalizada! Obrigado pela preferência.");
  // Aqui você pode redirecionar o usuário, limpar o carrinho ou enviar um pedido ao backend.
}

// Carrega os itens do carrinho quando a página é carregada
window.onload = fetchCartItems;
