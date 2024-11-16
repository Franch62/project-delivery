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
  if (!customerName) {
    alert(
      "Por favor, insira um nome para que possamos identificar na entrega."
    );
    return;
  }

  const formData = new FormData();
  formData.append("deliveryOption", deliveryOption);
  formData.append("customer_addressCEP", addressCep);
  formData.append("customer_addressStreet", addressStreet);
  formData.append("customer_addressNumber", addressNumber);
  formData.append("customer_addressNeighborhood", addressNeighborhood);
  formData.append("customer_name", customerName);
  formData.append("customer_phone", customerPhone);

  try {
    const response = await fetch("http://localhost:3000/api/order/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resposta da API:", data);
  } catch (error) {
    console.error("Erro ao enviar o pedido:", error);
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
