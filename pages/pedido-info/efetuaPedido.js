async function loadOrder() {
  const response = await fetch("http:localhost:3000/api/menu/", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar os pedidos");
  }

  const products = await response.json();
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  async function createOrder() {
    const deliveryOption = document.getElementById("deliveryOption").value;

    const addressCep = document.getElementById("cep").value;
    const addressStreet = document.getElementById("rua").value;
    const addressNumber = document.getElementById("numero").value;
    const addressNeighborhood = document.getElementById("bairro").value;

    const customerName = document.getElementById("name").value;
    const customerPhone = document.getElementById("phone").value;
    if (!customerName) {
      alert("Por favor, insira um nome.");
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
      const response = await fetch("http:localhost:3000/api/order/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      const data = await response.json(); // Parse da resposta, se necessário
      console.log("Resposta da API:", data);
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
    }
  }
}
