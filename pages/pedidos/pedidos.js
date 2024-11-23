async function fetchOrders() {
    const ordersContainer = document.getElementById("orders-container");
    const ordersList = document.getElementById("orders-list");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Exibir o spinner enquanto a requisição é feita
    loadingSpinner.style.display = "block";
    ordersList.innerHTML = ""; // Limpar qualquer conteúdo anterior

    try {
        const response = await fetch("http://localhost:3000/api/order/");
        
        // Verificando se a resposta da API é bem-sucedida
        if (!response.ok) {
            throw new Error("Erro ao carregar pedidos");
        }

        const orders = await response.json();

        if (orders.length === 0) {
            ordersList.innerHTML = "<p>Não há pedidos disponíveis.</p>";
        } else {
            // Preencher a lista de pedidos
            orders.forEach(order => {
                const orderCard = createOrderCard(order);
                ordersList.appendChild(orderCard);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        ordersList.innerHTML = "<p>Erro ao carregar pedidos. Tente novamente mais tarde.</p>";
    } finally {
        // Esconder o spinner após a requisição
        loadingSpinner.style.display = "none";
    }
}

function createOrderCard(order) {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

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
    orderDate.textContent = `Data: ${new Date(order.createdIn).toLocaleDateString()}`;
    orderCard.appendChild(orderDate);

    // Verificar se o usuário está logado
    const token = sessionStorage.getItem("token");
    if (token) {
        // Botão de Editar
        const editButton = document.createElement("button");
        editButton.textContent = "Editar Status";
        editButton.classList.add("edit-button");
        editButton.onclick = () => updateOrderStatus(order._id);
        orderCard.appendChild(editButton);

        // Botão de Excluir
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir Pedido";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = () => deleteOrder(order._id);
        orderCard.appendChild(deleteButton);
    }

    return orderCard;
}

// Atualizar status do pedido
async function updateOrderStatus(orderId) {
    const token = sessionStorage.getItem("token");
    const newStatus = prompt("Digite o novo status do pedido (ex: Em Andamento, Concluído):");

    if (!newStatus) {
        alert("Status não pode estar vazio.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar o status do pedido");
        }

        alert("Status atualizado com sucesso!");
        fetchOrders(); // Atualizar lista de pedidos
    } catch (error) {
        console.error("Erro ao atualizar o status:", error);
        alert("Erro ao atualizar o status. Tente novamente mais tarde.");
    }
}

// Excluir pedido
async function deleteOrder(orderId) {
    const token = sessionStorage.getItem("token");

    if (!confirm("Tem certeza que deseja excluir este pedido?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir o pedido");
        }

        alert("Pedido excluído com sucesso!");
        fetchOrders(); 
    } catch (error) {
        console.error("Erro ao excluir o pedido:", error);
        alert("Erro ao excluir o pedido. Tente novamente mais tarde.");
    }
}

// Carregar pedidos quando a página for carregada
window.onload = fetchOrders;
