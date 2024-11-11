document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão de Cadastro/Login e adiciona evento de clique
    const loginButton = document.querySelector('.btn');
    if (loginButton) {
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();  // Impede o comportamento padrão do botão (se necessário)
            alert('Você clicou no botão de Cadastro/Login!');
        });
    }

    // Adiciona um efeito de scroll suave para os links do menu
    const menuLinks = document.querySelectorAll('nav ul li a');
    if (menuLinks.length) {
        menuLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();  // Impede o comportamento padrão do link (seguindo o comportamento de scroll suave)
                const targetId = link.getAttribute('href'); // Obtém o ID do destino a partir do href
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth', // Efeito de scroll suave
                        block: 'start' // Alinha o topo do elemento com o topo da janela de visualização
                    });
                }
            });
        });
    }
});
