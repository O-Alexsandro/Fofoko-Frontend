document.addEventListener("DOMContentLoaded", function() {
    fetchTarefas();
    document.getElementById("edit-save-button").addEventListener("click", updateTarefas);
});

function fetchTarefas() {
    fetch("http://localhost:8080/tarefas")
        .then(response => response.json())
        .then(data => {
            window.tarefasData = data;
            renderTarefasTable(data);
        })
        .catch(error => console.error("Erro ao buscar tarefa:", error));
}

function renderTarefasTable(data) {
    const tableBody = document.getElementById("tarefas-table-body");
    tableBody.innerHTML = "";

    data.forEach(tarefa => {
        const row = document.createElement("tr");
        row.dataset.id = tarefa.id;

        const tituloCell = document.createElement("td");
        tituloCell.textContent = tarefa.titulo;
        row.appendChild(tituloCell);

        const descricaoCell = document.createElement("td");
        descricaoCell.textContent = tarefa.descricao;
        row.appendChild(descricaoCell);

        const dataEntregaCell = document.createElement("td");
        dataEntregaCell.textContent = tarefa.data;
        row.appendChild(dataEntregaCell);

        const usuarioCell = document.createElement("td");
        usuarioCell.textContent = tarefa.usuarios.nome;
        row.appendChild(usuarioCell);

        const fofokoinsCell = document.createElement("td");
        fofokoinsCell.textContent = tarefa.fofokoins;
        row.appendChild(fofokoinsCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = tarefa.status;
        row.appendChild(statusCell);

        const acoesCell = document.createElement("td");
        acoesCell.classList.add("acoes-cell");

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("botao-editar");
        editButton.addEventListener("click", function() {
            editTarefas(tarefa.id);
        });
        acoesCell.appendChild(editButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("botao-remover");
        removeButton.style.backgroundColor = "#8a3434";
        removeButton.addEventListener("click", function() {
            deleteTarefas(tarefa.id);
        });
        acoesCell.appendChild(removeButton);

        row.appendChild(acoesCell);
        tableBody.appendChild(row);
    });
}

function searchTarefas() {
    const searchTerm = document.getElementById("termo").value.toLowerCase();
    const filteredTarefas = window.tarefasData.filter(tarefa => {
        return tarefa.titulo.toLowerCase().includes(searchTerm);
    });
    renderTarefasTable(filteredTarefas);
}

function deleteTarefas(id) {
    fetch(`http://localhost:8080/tarefas/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            alert("Tarefa deletada");
            fetchTarefas();
        } else {
            console.error("Erro ao remover tarefa:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao remover tarefa:", error));
}

function editTarefas(id) {
    fetch(`http://localhost:8080/tarefas`)
        .then(response => response.json())
        .then(data => {
            const tarefa = data.find(tarefa => tarefa.id === id);
            if (tarefa) {
                document.getElementById("edit-id").value = tarefa.id;
                document.getElementById("edit-titulo").value = tarefa.titulo;
                document.getElementById("edit-descricao").value = tarefa.descricao;
                document.getElementById("edit-data-entrega").value = tarefa.data;
                document.getElementById("edit-usuario").value = tarefa.usuarios.nome;
                document.getElementById("edit-fofokoins").value = tarefa.fofokoins;
                document.getElementById("edit-status").value = tarefa.status;
                document.getElementById("edit-form").style.display = "block";
            }
        })
        .catch(error => console.error("Erro ao buscar tarefa:", error));
}

function updateTarefas() {
    const id = document.getElementById("edit-id").value;
    const titulo = document.getElementById("edit-titulo").value;
    const descricao = document.getElementById("edit-descricao").value;
    const data = document.getElementById("edit-data-entrega").value;
    const usuarioId = document.getElementById("edit-usuario").value;
    const fofokoins = document.getElementById("edit-fofokoins").value;

    const tarefa = {
        id: id,
        titulo: titulo,
        descricao: descricao,
        data: data,
        usuarioId: usuarioId,
        fofokoins: fofokoins
    };

    fetch(`http://localhost:8080/tarefas`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })
    .then(response => {
        if (response.ok) {
            alert("Tarefa atualizada com sucesso");
            fetchTarefas();
            document.getElementById("edit-form").style.display = "none";
        } else {
            console.error("Erro ao atualizar tarefa:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao atualizar tarefa:", error));
}


