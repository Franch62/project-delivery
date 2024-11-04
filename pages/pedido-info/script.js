let currentStep = 0;
const steps = document.querySelectorAll(".step");
const loading = document.getElementById("loading");

function showStep(step) {
  steps.forEach((stepEl, index) => {
    stepEl.classList.toggle("active", index === step);
  });
}

// Exibe o efeito de loading temporariamente
function showLoading(callback) {
  loading.classList.add("show");
  setTimeout(() => {
    loading.classList.remove("show");
    callback();
  }, 500); // Tempo do efeito de carregamento (0.5 segundos)
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    showLoading(() => {
      currentStep++;
      showStep(currentStep);
    });
  }
}

function prevStep() {
  if (currentStep > 0) {
    showLoading(() => {
      currentStep--;
      showStep(currentStep);
    });
  }
}

// Exibe a primeira etapa ao carregar a página
showStep(currentStep);

// Listener para o envio do formulário
document.getElementById("multiStepForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Formulário enviado com sucesso!");
});
