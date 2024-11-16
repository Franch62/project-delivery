function fetchCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const srcImage =
      `http://localhost:3000/api/${item.image_url}`.replace(
        "\\",
        "/"
      );

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `<img src="${srcImage}" alt="${
      item.name
    }" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
    <div class="cart-text-content">  
      <b><p>${item.name}</p></b>
      <b><p>Quantidade</b>: ${item.quantity}</p>
      <b><p>Preço:</b> R$ ${item.price}</b></p>
      <b><p>Total:</b> R$ ${itemTotal.toFixed(2)}</p>
    </div>
    <div class="cart-controls">
      <button onclick="removeOneFromCart('${item._id}')">-</button>
      <button onclick="addOneToCart('${item._id}')">+</button>
    </div>`;
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

function addOneToCart(itemId) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const itemIndex = cartItems.findIndex((item) => item._id === itemId);

  if (itemIndex !== -1) {
    const userConfirmed = confirm("Deseja adicionar um item?");
    if (userConfirmed) {
      cartItems[itemIndex].quantity += 1;

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      fetchCartItems();
    }
  }
}

function removeOneFromCart(itemId) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const itemIndex = cartItems.findIndex((item) => item._id === itemId);

  if (itemIndex !== -1) {
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity -= 1;
    } else {
      cartItems.splice(itemIndex, 1);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    fetchCartItems();
  }
}

function finalizePurchase() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  if (cartItems.length === 0) {
    alert("Oops, tudo vazio por aqui!");
    // Se o carrinho estiver vazio, redireciona para a página inicial
    window.location.href = "../../index.html";
  } else {
    // Mostra a tela de loading
    document.getElementById("loading-screen").style.display = "flex";

    // Simula um pequeno atraso antes de redirecionar
    setTimeout(() => {
      window.location.href = "../pedido-info/efetuaPedido.html";
    }, 1000); // Pode ajustar o tempo se necessário
  }
}


window.onload = fetchCartItems;
