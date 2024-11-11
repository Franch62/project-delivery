document.addEventListener("DOMContentLoaded", () => {
    // Referência ao botão de login, caso exista na página
    const loginButton = document.querySelector('.btn');
    
    if (loginButton) {
        loginButton.addEventListener('click', () => {
        });
    }

    // Função para alternar a visibilidade do menu em dispositivos móveis
    const nav = document.querySelector('nav');
    
    if (nav) {
        const toggleMenu = document.createElement('button');
        toggleMenu.textContent = 'Menu';
        toggleMenu.classList.add('toggle-menu');
        
        // Adiciona o botão de alternância no início do menu
        nav.prepend(toggleMenu);

        toggleMenu.addEventListener('click', () => {
            const menuList = nav.querySelector('ul');
            
            // Alterna a classe 'show' no menu
            if (menuList) {
                menuList.classList.toggle('show');
            }
        });
    }

    // Adicionando animação suave para a exibição do menu
    const style = document.createElement('style');
    style.innerHTML = `
        nav ul {
            display: none;
            transition: all 0.3s ease;
        }
        nav ul.show {
            display: block;
        }
        .toggle-menu {
            background-color: #333;
            color: white;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 1rem;
        }
        .toggle-menu:hover {
            background-color: #555;
        }
    `;
    document.head.appendChild(style);
});
