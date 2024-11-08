function fetchCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const srcImage = `https://api-order-menu.onrender.com/api/${item.image_url}`.replace(
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

function removeFromCart(itemId) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter((item) => item._id !== itemId);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  fetchCartItems();
}

function finalizePurchase() {
  alert("Compra finalizada! Obrigado pela preferência.");
}

window.onload = fetchCartItems;
