document.addEventListener("DOMContentLoaded", () => {
    // Função para lidar com o clique nos botões "Ver Mais"
    const verMaisButtons = document.querySelectorAll('.btn');

    verMaisButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de navegação

            // Recupera o texto do item anterior ao botão, para mostrar ao usuário
            const sectionTitle = this.previousElementSibling ? this.previousElementSibling.innerText : "Seção não encontrada";
            alert(`Você clicou em: ${sectionTitle}`);
            
            // Se necessário, redirecionar para outra página:
            // window.location.href = this.href;
        });
    });

    // Função para rolagem suave ao clicar nos links de navegação
    const menuLinks = document.querySelectorAll('header ul li a');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de navegação

            // Recupera o ID do link e encontra o alvo da rolagem
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Rolagem suave
                    block: 'start' // Inicia a rolagem no topo do alvo
                });
            } else {
                console.error(`Elemento com o ID "${targetId}" não encontrado.`);
            }
        });
    });
});
