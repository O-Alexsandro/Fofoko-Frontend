document.addEventListener('DOMContentLoaded', () => {
    fetchUsuarioLogado();
    fetchTarefas();
    updateFofokoins();
});


let usuarioLogadoId;

function fetchUsuarioLogado() {
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
            usuarioLogadoId = data.id;  // Armazene o ID do usuário logado
            renderUsuario(data);
            fetchQuantidadeTarefasConcluidas();
            fetchQuantidadeTarefasPendentes()
        })
        .catch(error => console.error("Erro ao buscar usuário:", error));
    } else {
        console.error("Token não encontrado.");
    }
}

function renderUsuario(data) {
    document.querySelector('#nomeUsuario').textContent = data.nome;
    document.querySelector('#coins').textContent = data.fofokoins;
}


/* PEGA AS TAREFAS DE ACORDO COM O ID DO USUÁRIO */
function fetchTarefas() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch("http://localhost:8080/tarefas/logado", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => response.json())
        .then(data => {
            renderTarefas(data);
        })
        .catch(error => console.error("Erro ao buscar tarefa:", error));
    } else {
        console.error("Token não encontrado.");
    }
}

function renderTarefas(tarefas) {
    const container = document.getElementById('tarefasContainer');
    container.innerHTML = '';

    tarefas.forEach(tarefa => {
        const headCard = document.createElement('div');
        headCard.classList.add('head-card');
        headCard.style.cursor = 'pointer';

        // Adicionar atributo para identificar a tarefa no card
        headCard.setAttribute('data-tarefa-id', tarefa.id);

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');

        const h1 = document.createElement('h1');
        h1.textContent = tarefa.titulo;

        const span = document.createElement('span');
        span.textContent = '...';

        titleDiv.appendChild(h1);
        titleDiv.appendChild(span);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const h2 = document.createElement('h2');
        h2.textContent = tarefa.descricao;

        cardBody.appendChild(h2);

        for (let i = 0; i < 3; i++) {
            const img = document.createElement('img');
            img.src = "./assets/img/FofokoFundo.png";
            img.alt = "Imagem da Tarefa";
            cardBody.appendChild(img);
        }

        headCard.appendChild(titleDiv);
        headCard.appendChild(cardBody);

        container.appendChild(headCard);
    });

    // Adicionar evento de clique para abrir o modal ao clicar no card
    container.addEventListener('click', (event) => {
        const cardClicked = event.target.closest('.head-card');
        if (cardClicked) {
            const tarefaId = cardClicked.getAttribute('data-tarefa-id');
            const tarefa = tarefas.find(t => t.id === tarefaId);
            openModal(tarefa);
        }
    });
}

function openModal(tarefa) {
    const modal = document.getElementById('taskModal');
    modal.style.display = "block";

    document.getElementById('id').textContent = tarefa.id;
    document.getElementById('modalTitle').textContent = tarefa.titulo;
    document.getElementById('modalDescription').textContent = tarefa.descricao;
    document.getElementById('fofokoins').textContent = "Fofokoins: " + tarefa.fofokoins;
    document.getElementById('dataEntrega').textContent = "Data de entrega: " + tarefa.data;
    document.getElementById('statusTarefa').textContent = "Status atual: " + tarefa.status;

    const modalImages = document.getElementById('modalImages');
    modalImages.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = "./assets/img/FofokoFundo.png";
        img.alt = "Imagem da Tarefa";
        modalImages.appendChild(img);
    }

    const concluirTarefaBtn = document.getElementById('concluirTarefaBtn');
    concluirTarefaBtn.setAttribute('data-usuario-id', usuarioLogadoId); // Supondo que usuarioLogadoId é globalmente acessível
    concluirTarefaBtn.setAttribute('data-tarefa-id', tarefa.id);
    concluirTarefaBtn.addEventListener('click', () => {
        updateFofokoins(usuarioLogadoId, tarefa.id);
        modal.style.display = "none"; // Fechar o modal após concluir a tarefa (opcional)
    });
}

document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('taskModal').style.display = "none";
});

window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

/* Atualiza a tarefa de pendente para concluido 
document.addEventListener('DOMContentLoaded', function() {
    const salvarButton = document.getElementById('salvarButton');
    salvarButton.addEventListener('click', function() {
        const idTarefa = document.getElementById('id').textContent.trim();
        const novoStatus = document.getElementById('statusTarefaEdit').value;
        const token = localStorage.getItem('token');

        const tarefa = {
            id: idTarefa,
            status: novoStatus
        };

        fetch(`http://localhost:8080/tarefas/logado/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(tarefa)
        })
        .then(response => {
            if (response.ok) {
                alert('Status da tarefa atualizado com sucesso!');
            } else {
                throw new Error('Erro ao atualizar status da tarefa: ' + response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar tarefa:', error);
            alert('Erro ao atualizar status da tarefa.');
        });
    });
}); */


function updateFofokoins(usuarioId, tarefaId) {
    const token = localStorage.getItem('token');
    if (token) {
        fetch("http://localhost:8080/tarefas/fofokoins", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ usuarioId: usuarioId, tarefaId: tarefaId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao concluir tarefa');
            }
            return response.json();
        })
        .then(data => {
            renderUsuario(data);
            localStorage.setItem('tarefaConcluida', 'true');
            location.reload();
        })
        .catch(error => {
            console.error("Erro ao concluir tarefa:", error);
        });
    } else {
        console.error("Token não encontrado.");
        alert('Token não encontrado.');
    }
}

window.onload = function() {
    if (localStorage.getItem('tarefaConcluida') === 'true') {
        alert('Tarefa concluída com sucesso!');
        localStorage.removeItem('tarefaConcluida');
    }
};

function fetchQuantidadeTarefasConcluidas() {
    if (usuarioLogadoId) {
        fetch("http://localhost:8080/tarefas/quantidadeConcluidas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioId: usuarioLogadoId })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('tConcluidas').innerText = `${data} Tarefas Concluídas`;
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('tConcluidas').innerText = 'Erro ao buscar a quantidade de tarefas concluídas.';
        });
    } else {
        console.error('ID do usuário não encontrado.');
    }
}

function fetchQuantidadeTarefasPendentes() {
    if (usuarioLogadoId) {
        fetch("http://localhost:8080/tarefas/quantidadePendentes", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioId: usuarioLogadoId })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('tPendentes').innerText = `${data} Tarefas Pendentes`;
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('tConcluidas').innerText = 'Erro ao buscar a quantidade de tarefas concluídas.';
        });
    } else {
        console.error('ID do usuário não encontrado.');
    }
}


window.onload = fetchUsuarioLogado;






