let currentStep = 0;
const steps = document.querySelectorAll(".step");
const loading = document.getElementById("loading");

function showStep(step) {
  steps.forEach((stepEl, index) => {
    stepEl.classList.toggle("active", index === step);
  });
}

function showLoading(callback) {
  loading.classList.add("show");
  setTimeout(() => {
    loading.classList.remove("show");
    callback();
  }, 500);
}

function nextStep() {
  const deliveryOption = document.getElementById("deliveryOption").value;

  if (currentStep === 0 && deliveryOption === "retirada") {
    showLoading(() => {
      currentStep += 2;
      showStep(currentStep);
    });
  } else if (currentStep < steps.length - 1) {
    showLoading(() => {
      currentStep++;
      showStep(currentStep);
    });
  }
}

function prevStep() {
  const deliveryOption = document.getElementById("deliveryOption").value;

  if (currentStep === 2 && deliveryOption === "retirada") {
    showLoading(() => {
      currentStep -= 2;
      showStep(currentStep);
    });
  } else if (currentStep > 0) {
    showLoading(() => {
      currentStep--;
      showStep(currentStep);
    });
  }
}

async function buscarCEP() {
  const cep = document.getElementById("cep").value;
  if (cep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("CEP não encontrado");
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
      } else {
        document.getElementById("rua").value = data.logradouro;
        document.getElementById("bairro").value = data.bairro;
      }
    } catch (error) {
      alert("Erro ao buscar CEP. Verifique se ele está correto.");
    }
  } else {
    alert("Digite um CEP válido com 8 dígitos.");
  }
}

function backToCart() {
  document.getElementById("loading").style.display = "flex";

  setTimeout(() => {
    window.location.href = "../carrinho/cart.html";
  }, 1000);
}

showStep(currentStep);

document
  .getElementById("multiStepForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Formulário enviado com sucesso!");
  });
