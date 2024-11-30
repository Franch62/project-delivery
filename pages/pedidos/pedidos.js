document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar autenticado para Acessar os Pedidos.");
    window.location.href = "../../index.html";
    return;
  }
});

function groupOrdersByStatus(orders) {
  const groupedOrders = {
    "Aguardando pagamento": [],
    "Em Andamento": [],
    "Pago": [],
    "Finalizado": [],
    "Cancelado": [],
  };

  orders.forEach((order) => {
    groupedOrders[order.status]?.push(order);
  });

  return groupedOrders;
}

function createStatusSection(status, orders) {
  const section = document.createElement("div");
  section.classList.add("status-section");

  // Título da seção
  const sectionTitle = document.createElement("h2");
  sectionTitle.textContent = status;
  section.appendChild(sectionTitle);

  // Lista de pedidos
  const ordersList = document.createElement("div");
  ordersList.classList.add("orders-list");

  orders.forEach((order) => {
    const orderCard = createOrderCard(order);
    ordersList.appendChild(orderCard);
  });

  section.appendChild(ordersList);

  return section;
}

function createOrderCard(order) {
  const orderCard = document.createElement("div");
  orderCard.classList.add("order-card");
  orderCard.setAttribute("data-id", order._id);

  // Título do pedido
  const orderTitle = document.createElement("h3");
  orderTitle.textContent = `Pedido #${order._id}`;
  orderCard.appendChild(orderTitle);

  // Detalhes do pedido
  const orderDetails = document.createElement("p");
  orderDetails.textContent = `Cliente: ${order.customer_name} | Total: R$ ${order.total}`;
  orderCard.appendChild(orderDetails);

  // Quantidade total de produtos
  const productQuantity = document.createElement("p");
  productQuantity.textContent = `Quantidade: ${order.quantity}`;
  orderCard.appendChild(productQuantity);

  // Opção de entrega
  const deliveryOption = document.createElement("p");
  deliveryOption.textContent = `Entrega: ${order.deliveryOption}`;
  orderCard.appendChild(deliveryOption);

  // Produtos no pedido
  const productList = document.createElement("ul");
  productList.textContent = "Produtos:";
  order.itens.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.textContent = `${product.name}`;
    productList.appendChild(productItem);
  });
  orderCard.appendChild(productList);

  // Data do pedido
  const orderDate = document.createElement("p");
  orderDate.textContent = `Data: ${new Date(
    order.createdIn
  ).toLocaleDateString()}`;
  orderCard.appendChild(orderDate);

  // Status atual
  const orderStatus = document.createElement("p");
  orderStatus.textContent = `Status: ${order.status}`;
  orderStatus.classList.add("status"); // Classe para facilitar a localização do elemento
  orderCard.appendChild(orderStatus);

  // Verificar se o usuário está logado
  const token = sessionStorage.getItem("token");
  if (token) {
    // Botões de status
    const statusButtons = document.createElement("div");
    statusButtons.classList.add("status-buttons-div");

    // Lista de possíveis status
    const statuses = ["Pago", "Finalizado", "Cancelado"];

    statuses.forEach((status) => {
      // Se o pedido já está nesse status, esconder o botão correspondente
      if (status === order.status) {
        return; // Não cria o botão para o status atual
      }

      const statusButton = document.createElement("button");
      statusButton.textContent = status;
      statusButton.classList.add("status-button");
      statusButton.onclick = () => updateOrderStatus(order._id, status);
      statusButtons.appendChild(statusButton);
    });

    orderCard.appendChild(statusButtons);

    // Botão de Excluir
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir Pedido";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = () => deleteOrder(order._id);
    orderCard.appendChild(deleteButton);
  }

  return orderCard;
}

async function updateOrderStatus(orderId, newStatus) {
  const token = sessionStorage.getItem("token");

  // Buscar o pedido no DOM para atualização instantânea
  const orderCard = document.querySelector(`.order-card[data-id="${orderId}"]`);

  if (orderCard) {
    const orderStatusElement = orderCard.querySelector("p.status");

    // Atualiza o status no DOM antes de enviar a requisição
    if (orderStatusElement) {
      orderStatusElement.textContent = `Status: ${newStatus}`;
    }

    // Limpar os botões de status e adicionar os novos botões
    const statusButtons = orderCard.querySelector(".status-buttons-div");
    if (statusButtons) {
      statusButtons.innerHTML = ""; // Limpa os botões existentes

      // Adiciona os botões de status restantes
      const statuses = ["Pago", "Finalizado", "Cancelado"];
      statuses.forEach((status) => {
        if (status !== newStatus) {
          const statusButton = document.createElement("button");
          statusButton.textContent = status;
          statusButton.classList.add("status-button");
          statusButton.onclick = () => updateOrderStatus(orderId, status);
          statusButtons.appendChild(statusButton);
        }
      });
    }
  }

  // Envia a requisição para atualizar o status na API
  try {
    const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar o status do pedido");
    }

    alert(`Status do pedido atualizado para "${newStatus}" com sucesso!`);
  } catch (error) {
    console.error("Erro ao atualizar o status:", error);
    alert("Erro ao atualizar o status. Tente novamente mais tarde.");

    // Reverte a mudança de status em caso de erro
    if (orderCard) {
      const orderStatusElement = orderCard.querySelector("p.status");
      if (orderStatusElement) {
        // Reverte o status para o valor anterior
        orderStatusElement.textContent = `Status: ${order.status}`;
      }
    }
  }
}

async function deleteOrder(orderId) {
  const token = sessionStorage.getItem("token");

  if (!confirm("Tem certeza que deseja excluir este pedido?")) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o pedido");
    }

    alert("Pedido excluído com sucesso!");

    // Remover o pedido do DOM diretamente
    const orderCard = document.querySelector(
      `.order-card[data-id="${orderId}"]`
    );
    if (orderCard) {
      const parentSection = orderCard.closest(".status-section");
      orderCard.remove();

      // Se a seção de status ficar vazia, também a remove
      if (
        parentSection &&
        parentSection.querySelectorAll(".order-card").length === 0
      ) {
        parentSection.remove();
      }
    }
  } catch (error) {
    console.error("Erro ao excluir o pedido:", error);
    alert("Erro ao excluir o pedido. Tente novamente mais tarde.");
  }
}

async function fetchOrders() {
  const ordersContainer = document.getElementById("orders-container");
  const loadingSpinner = document.getElementById("loading-spinner");

  // Exibir o spinner enquanto a requisição é feita
  loadingSpinner.style.display = "block";
  ordersContainer.innerHTML = ""; // Limpar qualquer conteúdo anterior

  try {
    const response = await fetch("http://localhost:3000/api/order/");

    if (!response.ok) {
      throw new Error("Erro ao carregar pedidos");
    }

    const orders = await response.json();

    if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>Não há pedidos disponíveis.</p>";
    } else {
      // Agrupar pedidos por status
      const groupedOrders = groupOrdersByStatus(orders);

      // Criar seções para cada status somente se houver pedidos
      Object.keys(groupedOrders).forEach((status) => {
        if (groupedOrders[status].length > 0) {
          const section = createStatusSection(status, groupedOrders[status]);
          ordersContainer.appendChild(section);
        }
      });
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    ordersContainer.innerHTML =
      "<p>Erro ao carregar pedidos. Tente novamente mais tarde.</p>";
  } finally {
    loadingSpinner.style.display = "none";
  }
}

window.onload = fetchOrders;
