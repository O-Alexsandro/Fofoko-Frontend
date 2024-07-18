function logar() {
    const email = document.getElementById('e-mail').value;
    const senha = document.getElementById('password').value;

    fetch("http://localhost:8080/auth/login", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })
    .then(function(response) { 
        if (!response.ok) {
            throw new Error('Usuário ou senha inválidos');
        }
        return response.json();
    })
    .then(function(data) {
        localStorage.setItem('token', data.token);
        console.log('Login bem sucedido');

        // Decodificar o token para obter a permissão
        const permissao = getPermissaoFromToken(data.token);

        // Verificar a permissão e redirecionar para a tela apropriada
        if (permissao === 0) {
            // Redirecionar para a tela de administrador
            window.location.href = "./TelaInicial/telainicial.html";
        } else if (permissao === 1) {
            // Redirecionar para a tela de usuário normal
            window.location.href = "./TelaInicial/telainicialusers.html";
        } else {
            // Caso a permissão seja inválida (não esperado neste contexto)
            console.error('Permissão inválida no token:', permissao);
            alert('Permissão inválida. Entre em contato com o suporte.');
        }
    })
    .catch(function(error) { 
        console.log(error);
        // Exibe uma mensagem de erro para o usuário
        alert(error.message);
    });
}

function getPermissaoFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.permissao;
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
}
