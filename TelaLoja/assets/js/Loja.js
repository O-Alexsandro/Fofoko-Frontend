document.addEventListener('DOMContentLoaded', () => {
    fetchUsuarioLogado()
        .then(usuarioLogadoInfo => {
            fetchProdutos(usuarioLogadoInfo);
        })
        .catch(error => console.error("Erro ao buscar informações do usuário logado:", error));
});

function fetchProdutos(usuarioLogadoInfo) {
    fetch("http://localhost:8080/item/produtos")
        .then(response => response.json())
        .then(data => {
            renderProdutos(data, usuarioLogadoInfo);
        })
        .catch(error => console.error("Erro ao buscar produtos:", error));
}

function renderProdutos(produtos, usuarioLogadoInfo) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    const imagemEstática = './assets/img/gift-ifood.png';

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('card-product');

        const img = document.createElement('img');
        img.src = imagemEstática;
        img.alt = `Imagem do Produto ${produto.nomeItem}`;
        card.appendChild(img);

        const h1 = document.createElement('h1');
        h1.textContent = produto.nomeItem;
        card.appendChild(h1);

        const spanDesc = document.createElement('span');
        spanDesc.textContent = produto.descricao;
        card.appendChild(spanDesc);

        const cardBtn = document.createElement('div');
        cardBtn.classList.add('card-btn');
        const spanValor = document.createElement('span');
        spanValor.classList.add('valor');
        spanValor.textContent = produto.valor + " Fofokoins";
        cardBtn.appendChild(spanValor);

        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'Adquirir';
        button.id = 'botaoAdquirir';
        button.addEventListener('click', () => {
            const today = new Date().toLocaleDateString('en-CA');
            const queryParams = new URLSearchParams({
                item: produto.id,
                usuario: usuarioLogadoInfo.id,
                nomeItem: produto.nomeItem,
                descricao: produto.descricao,
                valor: produto.valor,
                data_compra: today,
            }).toString();
            window.location.href = `../TelaCompra/TelaCompra.html?${queryParams}`;
        });

        cardBtn.appendChild(button);

        card.appendChild(cardBtn);

        const spanDisp = document.createElement('span');
        spanDisp.textContent = "Quantidade disponível: " + produto.quantidade;
        spanDisp.style.marginTop = '1.2rem';
        card.appendChild(spanDisp);

        container.appendChild(card);
    });
}

function fetchUsuarioLogado() {
    const token = localStorage.getItem('token');
    if (token) {
        return fetch("http://localhost:8080/auth/logado/completo", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar informações do usuário logado');
            }
            return response.json();
        })
        .then(data => {
            return data;  // Retorna todas as informações do usuário logado
        })
        .catch(error => {
            console.error("Erro ao buscar informações do usuário logado:", error);
            throw error;
        });
    } else {
        console.error("Token não encontrado.");
        return Promise.reject("Token não encontrado.");
    }
}

// Atualiza a quantidade de Fofokoins na loja
function fetchStatusFofokoinsLoja() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch("http://localhost:8080/auth/logado/completo", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar usuário');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            renderUsuario(data);
        })
        .catch(error => console.error("Erro ao buscar usuário:", error));
    } else {
        console.error("Token não encontrado.");
    }
}

function renderUsuario(data) {
    const fofokoinsElement = document.querySelector('#fofokoins');
    if (fofokoinsElement) {
        fofokoinsElement.textContent = "Fofokoins: " + data.fofokoins;
    } else {
        console.error("Elemento #fofokoins não encontrado no HTML.");
    }
}

fetchStatusFofokoinsLoja();

