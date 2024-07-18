document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);

    const produto = {
        item: urlParams.get('item'),
        usuario: urlParams.get('usuario'),
        nomeItem: urlParams.get('nomeItem'),
        descricao: urlParams.get('descricao'),
        valor: urlParams.get('valor'),
        data_compra: urlParams.get('data_compra')
    };
    
    renderForm(produto);

    function renderForm(produto) {
        const formContainer = document.getElementById('form-container');
        
        formContainer.innerHTML = '';

        const form = document.createElement('form');
        form.classList.add('form');
        form.action = "";
        form.method = "get";

        function createInputBox(labelText, inputId, inputClass, inputType, inputName, inputValue) {
            const div = document.createElement('div');
            div.classList.add('input-box');

            const label = document.createElement('label');
            label.textContent = labelText;
            label.htmlFor = inputId;
            div.appendChild(label);

            const input = document.createElement('input');
            input.classList.add(inputClass);
            input.type = inputType;
            input.name = inputName;
            input.value = inputValue;
            input.id = inputId;
            input.readOnly = true;
            div.appendChild(input);

            return div;
        }

        form.appendChild(createInputBox('Nome do Produto', 'produto-nome', 'input-nome', 'text', 'nomeItem', produto.nomeItem));
        form.appendChild(createInputBox('Descrição', 'produto-descricao', 'input-descricao', 'text', 'descricao', produto.descricao));
        form.appendChild(createInputBox('Valor', 'produto-valor', 'input-valor', 'text', 'valor', produto.valor));

        const btnDiv = document.createElement('div');
        btnDiv.classList.add('btn');

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
        cancelButton.addEventListener('click', function() {
            window.location.href = "../TelaLoja/TelaLoja.html";
        });

        const confirmButton = document.createElement('button');
        confirmButton.type = 'submit';
        confirmButton.textContent = 'Confirmar compra';
        confirmButton.addEventListener('click', function(event) {
            event.preventDefault();

            const dadosCompra = {
                usuario: produto.usuario,
                item: produto.item,
                nome: produto.nomeItem,
                descricao: produto.descricao,
                valor: produto.valor,
                data_compra: produto.data_compra
            };

            console.log('Dados da compra:', dadosCompra);
            let compraSalvaGlobal; // Variável para armazenar a compra salva

            fetch('http://localhost:8080/compras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(dadosCompra)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro ao adicionar compra: ' + response.status);
                }
            })
            .then(compraSalva => {
                compraSalvaGlobal = compraSalva; // Armazena a compra salva globalmente
            
                const fofokoinsData = {
                    usuarioId: produto.usuario,
                    compraId: compraSalva.id // Usando o ID retornado da compra salva
                };
            
                console.log(fofokoinsData);
            
                // Subtrair Fofokoins antes de adicionar a compra
                return fetch('http://localhost:8080/compras/subtrair', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(fofokoinsData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao subtrair fofokoins: ' + response.status);
                    }
                    return response.json();
                })
                .then(dataSubtracao => {
                    // Verifica se houve sucesso na subtração antes de prosseguir
                    console.log('Fofokoins subtraídos com sucesso:', dataSubtracao);
                
                    return dataSubtracao;
                });
            })
            .then(dataSubtracao => {
                // Se a subtração foi bem-sucedida, continua com a próxima ação (por exemplo, mostrar mensagem de sucesso)
                console.log('Resposta do servidor:', compraSalvaGlobal);
                alert('Compra realizada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao realizar transação:', error);
                alert('Fofokoins insuficientes para realizar a compra!');
            
                // Caso ocorra um erro, desfazer a compra adicionada, se necessário
                if (compraSalvaGlobal) {
                    // Implemente aqui a lógica para desfazer a compra no servidor, se necessário
                    console.log('Desfazendo a compra:', compraSalvaGlobal);
                    fetch('http://localhost:8080/compras/' + compraSalvaGlobal.id, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao desfazer a compra: ' + response.status);
                        }
                        console.log('Compra desfeita com sucesso.');
                    })
                    .catch(error => {
                        console.error('Erro ao desfazer a compra:', error);
                        alert('Fofokoins insuficientes para realizar a compra');
                    });
                }
            });
        });

        btnDiv.appendChild(cancelButton);
        btnDiv.appendChild(confirmButton);

        form.appendChild(btnDiv);

        formContainer.appendChild(form);
    }
});