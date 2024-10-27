function openModal(product) {
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalProductDetails");

  modalContent.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.image_url}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
    <p>${product.description}</p>
    <p><strong>Preço:</strong> R$ ${product.price}</p>
  `;

  document.body.classList.add("modal-open");
  modal.style.display = "flex";
}

function closeModal() {
  document.body.classList.remove("modal-open");
  const modal = document.getElementById("productModal");
  modal.style.display = "none";
}

export { openModal, closeModal };
