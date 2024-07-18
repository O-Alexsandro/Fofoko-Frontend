const formulario = document.querySelector("form");
const titulo = document.querySelector(".titulo");
const descricao = document.querySelector(".descricao");
const data = document.querySelector(".dataEntrega");
const status = document.querySelector("#statusTarefa");
const usuarioId = document.querySelector(".colaboradores");
const fofokoins = document.querySelector(".moeda");


function cadastrarTarefa() {
    fetch("http://localhost:8080/tarefas", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                titulo: titulo.value,
                descricao: descricao.value,
                data: data.value,
                status: statusTarefa.value,
                usuarioId: usuarioId.options[usuarioId.selectedIndex].value,
                fofokoins: fofokoins.value
            })
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar tarefa');
            }
            alert('Tarefa cadastrada com sucesso!');
            window.location.href = "#";
        })
        .catch(function(error) {
            console.log(error);
            alert('Erro ao cadastrar tarefa');
        });
}

function limpar() {
    titulo.value = "";
    descricao.value = "";
    data.value = "";
    fofokoins.value = "";
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    cadastrarTarefa();
    limpar();
});

// Pego todos os colaboradores ativos e retorno pra setar a tarefa
function getColaboradores() {
    fetch('http://localhost:8080/auth/configuracaoUsuarios')
        .then(response => response.json())
        .then(data => {
            const selectColaboradores = document.getElementById('colaboradores');
            selectColaboradores.innerHTML = '';
            data.forEach(colaborador => {
                const option = document.createElement('option');
                option.value = colaborador.id;
                option.textContent = colaborador.nome;
                selectColaboradores.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os colaboradores:', error);
        });
}

document.addEventListener('DOMContentLoaded', getColaboradores);
