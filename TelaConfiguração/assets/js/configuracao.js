document.addEventListener("DOMContentLoaded", function() {
    fetchUsuarios();
    document.getElementById("edit-save-button").addEventListener("click", updateUsuario);
});

function fetchUsuarios() {
    fetch("http://localhost:8080/auth/configuracaoUsuarios")
        .then(response => response.json())
        .then(data => {
            window.usuariosData = data; // Armazena os dados globalmente para uso posterior
            renderUsuariosTable(data);
        })
        .catch(error => console.error("Erro ao buscar usuários:", error));
}

function renderUsuariosTable(data) {
    const tableBody = document.getElementById("usuarios-table-body");
    tableBody.innerHTML = ""; // Limpa a tabela antes de adicionar os dados

    data.forEach(usuario => {
        const row = document.createElement("tr");
        row.dataset.id = usuario.id;

        const nomeCell = document.createElement("td");
        nomeCell.textContent = usuario.nome;
        row.appendChild(nomeCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = usuario.email;
        row.appendChild(emailCell);

        const telefoneCell = document.createElement("td");
        telefoneCell.textContent = usuario.telefone;
        row.appendChild(telefoneCell);

        const idadeCell = document.createElement("td");
        idadeCell.textContent = usuario.idade;
        row.appendChild(idadeCell);

        const permissaoCell = document.createElement("td");
        permissaoCell.textContent = usuario.role;
        row.appendChild(permissaoCell);

        const acoesCell = document.createElement("td");
        acoesCell.classList.add("acoes-cell");

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("botao-editar");
        editButton.addEventListener("click", function() {
            editUsuario(usuario.id);
        });
        acoesCell.appendChild(editButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("botao-remover");
        removeButton.style.backgroundColor = "#8a3434";
        removeButton.addEventListener("click", function() {
            deleteUsuario(usuario.id);
        });
        acoesCell.appendChild(removeButton);

        row.appendChild(acoesCell);
        tableBody.appendChild(row);
    });
}

function searchUsuarios() {
    const searchTerm = document.getElementById("termo").value.toLowerCase();
    const filteredUsuarios = window.usuariosData.filter(usuario => {
        return usuario.nome.toLowerCase().includes(searchTerm);
    });
    renderUsuariosTable(filteredUsuarios);
}

function deleteUsuario(id) {
    fetch(`http://localhost:8080/auth/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            alert("Usuário deletado");
            fetchUsuarios();
        } else {
            console.error("Erro ao remover usuário:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao remover usuário:", error));
}

function editUsuario(id) {
    fetch(`http://localhost:8080/auth/configuracaoUsuarios`)
        .then(response => response.json())
        .then(data => {
            const usuario = data.find(usuario => usuario.id === id);
            if (usuario) {
                document.getElementById("edit-id").value = usuario.id;
                document.getElementById("edit-nome").value = usuario.nome;
                document.getElementById("edit-email").value = usuario.email;
                document.getElementById("edit-telefone").value = usuario.telefone;
                document.getElementById("edit-idade").value = usuario.idade;
                document.getElementById("edit-role").value = usuario.role;
                document.getElementById("edit-form").style.display = "block";
            }
        })
        .catch(error => console.error("Erro ao buscar usuário:", error));
}

function updateUsuario() {
    const id = document.getElementById("edit-id").value;
    const nome = document.getElementById("edit-nome").value;
    const email = document.getElementById("edit-email").value;
    const telefone = document.getElementById("edit-telefone").value;
    const idade = document.getElementById("edit-idade").value;
    const role = document.getElementById("edit-role").value;

    const usuario = {
        id: id,
        nome: nome,
        email: email,
        telefone: telefone,
        idade: idade,
        role: role,
    };

    fetch(`http://localhost:8080/auth/configuracaoUsuarios`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (response.ok) {
            alert("Usuário atualizado com sucesso");
            fetchUsuarios();
            document.getElementById("edit-form").style.display = "none";
        } else {
            console.error("Erro ao atualizar usuário:", response.statusText);
        }
    })
    .catch(error => console.error("Erro ao atualizar usuário:", error));
}

document.getElementById("edit-save-button").addEventListener("click", updateUsuario);
