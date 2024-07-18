document.addEventListener("DOMContentLoaded", function() {
    fetchProdutos();
    document.getElementById("edit-save-button").addEventListener("click", updateProdutos);
});

function fetchProdutos() {
    fetch("http://localhost:8080/item/produtos")
        .then(response => response.json())
        .then(data => {
            window.produtosData = data;
            renderProdutosTable(data);
        })
        .catch(error => console.error("Erro ao buscar produtos:", error));
}

function renderProdutosTable(data) {
    const tableBody = document.getElementById("produtos-table-body");
    tableBody.innerHTML = ""; // Limpa a tabela antes de adicionar os dados

    data.forEach(produtos => {
        const row = document.createElement("tr");
        row.dataset.id = produtos.id;

        const nomeCell = document.createElement("td");
        nomeCell.textContent = produtos.nomeItem;
        row.appendChild(nomeCell);

        const descricaoCell = document.createElement("td");
        descricaoCell.textContent = produtos.descricao;
        row.appendChild(descricaoCell);

        const quantidadeCell = document.createElement("td");
        quantidadeCell.textContent = produtos.quantidade;
        row.appendChild(quantidadeCell);

        const imagemCell = document.createElement("td");
        imagemCell.textContent = produtos.imagemItem;
        row.appendChild(imagemCell);

        const acoesCell = document.createElement("td");
        acoesCell.classList.add("acoes-cell");

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("botao-editar");
        editButton.addEventListener("click", function() {
            editProdutos(produtos.id);
        });
        acoesCell.appendChild(editButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("botao-remover");
        removeButton.style.backgroundColor = "#8a3434";
        removeButton.addEventListener("click", function() {
            deleteProdutos(produtos.id);
        });
        acoesCell.appendChild(removeButton);

        row.appendChild(acoesCell);
        tableBody.appendChild(row);
    });
}

function searchProdutos() {
    const searchTerm = document.getElementById("termo").value.toLowerCase();
    const filteredProdutos = window.produtosData.filter(produto => {
        return produto.nomeItem.toLowerCase().includes(searchTerm);
    });
    renderProdutosTable(filteredProdutos);
}

function deleteProdutos(id) {
    fetch(`http://localhost:8080/item/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            alert("Produto deletado");
            fetchProdutos();
        } else {
            console.error("Erro ao remover produto:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao remover produto:", error));
}

function editProdutos(id) {
    fetch(`http://localhost:8080/item/produtos`)
        .then(response => response.json())
        .then(data => {
            const produto = data.find(produtos => produtos.id === id);
            if (produto) {
                document.getElementById("edit-id").value = produto.id;
                document.getElementById("edit-nome").value = produto.nomeItem;
                document.getElementById("edit-descricao").value = produto.descricao;
                document.getElementById("edit-quantidade").value = produto.quantidade;
                document.getElementById("edit-imagem").value = produto.imagemItem;
                document.getElementById("edit-form").style.display = "block";
            }
        })
        .catch(error => console.error("Erro ao buscar produto:", error));
}

function updateProdutos() {
    const id = document.getElementById("edit-id").value;
    const nomeItem = document.getElementById("edit-nome").value;
    const descricao = document.getElementById("edit-descricao").value;
    const quantidade = document.getElementById("edit-quantidade").value;
    const imagemItem = document.getElementById("edit-imagem").value;

    const produto = {
        id: id,
        nomeItem: nomeItem,
        descricao: descricao,
        quantidade: quantidade,
        imagemItem: imagemItem
    };

    fetch(`http://localhost:8080/item/produtos`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(response => {
        if (response.ok) {
            alert("Produto atualizado com sucesso");
            fetchProdutos();
            document.getElementById("edit-form").style.display = "none";
        } else {
            console.error("Erro ao atualizar produto:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao atualizar produto:", error));
}
