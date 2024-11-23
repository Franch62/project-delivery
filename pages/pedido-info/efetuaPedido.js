const token = sessionStorage.getItem("token");

async function loadOrder() {
  const response = await fetch("http://localhost:3000/api/menu/", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar os pedidos");
  }
}

async function createOrder() {
  const deliveryOption = document.getElementById("deliveryOption").value;
  const addressCep = document.getElementById("cep").value;
  const addressStreet = document.getElementById("rua").value;
  const addressNumber = document.getElementById("numero").value;
  const addressNeighborhood = document.getElementById("bairro").value;
  const customerName = document.getElementById("name").value;
  const customerPhone = document.getElementById("phone").value;
  const formPaymentMethod = document.getElementById("formPaymentOption").value;

  if (!customerName) {
    alert("Por favor, insira um nome para que possamos identificar na entrega.");
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (cartItems.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  // Calcular o total e a quantidade total
  let total = 0;
  let totalQuantity = 0; // Variável para armazenar a quantidade total de itens
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
    totalQuantity += item.quantity; // Somando as quantidades dos itens
  });

  const orderData = {
    deliveryOption,
    customer_addressCEP: addressCep,
    customer_addressStreet: addressStreet,
    customer_addressNumber: addressNumber,
    customer_addressNeighborhood: addressNeighborhood,
    customer_name: customerName,
    customer_phone: customerPhone,
    formPayment: { method: formPaymentMethod },
    quantity: totalQuantity, // Enviando a quantidade total
    products: cartItems,
    total: total, // Incluindo o total na requisição
  };

  console.log("Dados do pedido:", orderData);

  try {
    const response = await fetch("http://localhost:3000/api/order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Certifique-se de incluir o token
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resposta da API:", data);
    window.location.href = '/pages/pedidos/pedidos.html';
    alert("Pedido enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar o pedido:", error);
    alert("Erro ao enviar o pedido. Por favor, tente novamente.");
  }
}


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
      <img src="${srcImage}" alt="${item.name}" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
      <div class="cart-text-content">
        <b><p>${item.name}</p></b>
        <b><p>Quantidade:</b> ${item.quantity}</p>
        <b><p>Preço:</b> R$ ${item.price}</p>
        <b><p>Total:</b> R$ ${itemTotal}</p>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  // document.getElementById("cart-total").innerText = `Total: R$ ${total.toFixed(2)}`;
}
document.addEventListener("DOMContentLoaded", fetchCartItems);
