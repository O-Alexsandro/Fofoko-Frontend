const formulario = document.querySelector("form");
const Inome = document.querySelector(".nome");
const Iemail = document.querySelector(".email");
const Itelefone = document.querySelector(".telefone");
const Isenha = document.querySelector(".senha");
const Iidade = document.querySelector(".idade");

function cadastrar (){
   fetch("http://localhost:8080/auth/register", 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },            
            method: "POST",
            body: JSON.stringify({
                nome: Inome.value,
                email: Iemail.value,
                telefone: Itelefone.value,
                senha: Isenha.value,
                idade: Iidade.value,  
            })
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar usuário');
            }
            alert('Usuário cadastrado com sucesso!');
            window.location.href = "../telalogin.html";
        })
        .catch(function(error) {
            console.log(error);
            alert('Erro ao cadastrar usuário');
        });
    };

function limpar (){
    Inome.value = "";
    Iemail.value = "";
    Itelefone.value = "";
    Isenha.value = "";
    Iidade.value = "";
};

formulario.addEventListener('submit', function(event){
    event.preventDefault();

    cadastrar();
    limpar();
});