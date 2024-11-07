async function loadOrder() {
  const response = await fetch(
    "https://api-order-menu.onrender.com/api/menu/",
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar produtos");
  }

  const products = await response.json();
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";
  
  function createOrder() {
    const deliveryOption = document.getElementById("");

  }
}


