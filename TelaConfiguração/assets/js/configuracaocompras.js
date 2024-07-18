document.addEventListener("DOMContentLoaded", function() {
    fetchCompras();
    document.getElementById("edit-save-button").addEventListener("click", updateCompras);
});

function fetchCompras() {
    fetch("http://localhost:8080/compras")
        .then(response => response.json())
        .then(data => {
            window.comprasData = data;
            renderComprasTable(data);
        })
        .catch(error => console.error("Erro ao buscar produtos:", error));
}

function renderComprasTable(data) {
    const tableBody = document.getElementById("compras-table-body");
    tableBody.innerHTML = "";

    data.forEach(compras => {
        const row = document.createElement("tr");
        row.dataset.id = compras.id;

        const usuarioCell = document.createElement("td");
        usuarioCell.textContent = compras.usuario.nome;
        row.appendChild(usuarioCell);

        
        const emailCell = document.createElement("td");
        emailCell.textContent = compras.usuario.email;
        row.appendChild(emailCell);

        const nomeCell = document.createElement("td");
        nomeCell.textContent = compras.nome;
        row.appendChild(nomeCell);


        const descricaoCell = document.createElement("td");
        descricaoCell.textContent = compras.descricao;
        row.appendChild(descricaoCell);

        const valorCell = document.createElement("td");
        valorCell.textContent = compras.valor;
        row.appendChild(valorCell);

        const dataCell = document.createElement("td");
        dataCell.textContent = compras.data_compra;
        row.appendChild(dataCell);

        const acoesCell = document.createElement("td");
        acoesCell.classList.add("acoes-cell");

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("botao-editar");
        editButton.addEventListener("click", function() {
            editCompras(compras.id);
        });
        acoesCell.appendChild(editButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("botao-remover");
        removeButton.style.backgroundColor = "#8a3434";
        removeButton.addEventListener("click", function() {
            deleteCompras(compras.id);
        });
        acoesCell.appendChild(removeButton);

        row.appendChild(acoesCell);
        tableBody.appendChild(row);
    });
}

function searchCompras() {
    const searchTerm = document.getElementById("termo").value.toLowerCase();
    const filteredComprass = window.comprasData.filter(compras => {
        return compras.usuario.nome.toLowerCase().includes(searchTerm);
    });
    renderComprasTable(filteredComprass);
}

function deleteCompras(id) {
    fetch(`http://localhost:8080/compras/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            alert("Compra deletada");
            fetchCompras();
        } else {
            console.error("Erro ao remover compra:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao remover produto:", error));
}

function editCompras(id) {
    fetch(`http://localhost:8080/compras`)
        .then(response => response.json())
        .then(data => {
            const compra = data.find(compra => compra.id === id);
            if (compra) {
                document.getElementById("edit-id").value = compra.id;
                document.getElementById("edit-id-item").value = compra.item.id;
                console.log(compra.item.id);
                document.getElementById("edit-usuario").value = compra.usuario.nome;
                document.getElementById("edit-nomeItem").value = compra.nome;
                document.getElementById("edit-descricao").value = compra.descricao;
                document.getElementById("edit-fofokoins").value = compra.valor;
                document.getElementById("edit-data").value = compra.data_compra;
                document.getElementById("edit-form").style.display = "block";

                console.log(compra);
            }
        })
        .catch(error => console.error("Erro ao buscar tarefa:", error));
}

function updateCompras() {
    const id = document.getElementById("edit-id").value;
    const usuarioId = document.getElementById("edit-usuario").value;
    const nomeCompra = document.getElementById("edit-nomeItem").value;
    const descricao = document.getElementById("edit-descricao").value;
    const valor = document.getElementById("edit-fofokoins").value;
    const dataCompra = document.getElementById("edit-data").value;
    const itemId = document.getElementById("edit-id-item").value;

    const compra = {
        id: id,
        usuario: usuarioId,
        item: itemId,
        nome: nomeCompra,
        descricao: descricao,
        valor: valor,
        data_compra: dataCompra
    };


    fetch(`http://localhost:8080/compras`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(compra)
        
    })
    .then(response => {
        if (response.ok) {
            alert("Compra atualizada com sucesso");
            fetchCompras();
            document.getElementById("edit-form").style.display = "none";
        } else {
            console.error("Erro ao atualizar compra:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao atualizar compra:", error));
}