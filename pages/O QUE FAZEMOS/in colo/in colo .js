
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona o botão de login e adiciona um ouvinte de evento para clique
    const loginButton = document.querySelector('.btn');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            alert('Você clicou em Cadastro/Login!');
        });
    }

    // Função para alternar a visibilidade do menu em dispositivos móveis
    const nav = document.querySelector('nav');
    if (nav) {
        const toggleMenu = document.createElement('button');
        toggleMenu.textContent = 'Menu';
        toggleMenu.classList.add('toggle-menu');
        nav.prepend(toggleMenu);

        toggleMenu.addEventListener('click', () => {
            const ul = nav.querySelector('ul');
            if (ul) {
                ul.classList.toggle('show');
            }
        });
    }
});
