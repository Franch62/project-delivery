document.getElementById("addOrderButton").addEventListener("click", function() {
    const orderName = document.getElementById("orderName").value;
    const orderPrice = document.getElementById("orderPrice").value;

    // Verifica se os campos estão preenchidos
    if (orderName === "" || orderPrice === "") {
        alert("Por favor, preencha o nome e o preço do pedido.");
        return;
    }

    // Cria um novo item de lista
    const newOrder = document.createElement("li");

    // Cria o checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Cria a label com o texto do pedido
    const label = document.createElement("label");
    label.textContent = `${orderName} - R$ ${parseFloat(orderPrice).toFixed(2)}`;

    // Cria o botão de apagar individual
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Apagar";
    deleteButton.className = "delete-button";

    // Função para apagar o pedido individual
    deleteButton.addEventListener("click", function() {
        newOrder.remove();
    });

    // Adiciona checkbox, label e botão ao item da lista
    newOrder.appendChild(checkbox);
    newOrder.appendChild(label);
    newOrder.appendChild(deleteButton);

    // Adiciona o novo item à lista de pedidos
    document.getElementById("orderList").appendChild(newOrder);

    // Limpa os campos de entrada
    document.getElementById("orderName").value = "";
    document.getElementById("orderPrice").value = "";
});

// Função para apagar todos os pedidos
document.getElementById("clearAllButton").addEventListener("click", function() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = ""; // Remove todos os itens da lista
});
