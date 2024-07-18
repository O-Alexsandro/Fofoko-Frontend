const formulario = document.querySelector("form");
const nomeItem = document.querySelector(".nome");
const descricao = document.querySelector(".descricao");
const quantidade = document.querySelector(".quantidade");
const imagemItem = document.querySelector(".imagem");
const valor = document.querySelector(".valor")

function cadastrarProduto(){
    fetch("http://localhost:8080/item/produtos",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            nomeItem: nomeItem.value,
            descricao: descricao.value,
            quantidade:quantidade.value,
            imagemItem: imagemItem.value,
            valor : valor.value,
        })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar produto');
        }
        alert('Produto cadastrado com sucesso!');
        window.location.href = "../TelaLoja/TelaLoja.html";
    })
    .catch(function(error) {
        console.log(error);
        alert('Erro ao cadastrar produto');
    });
}

function limpar (){
    nomeItem.value = "";
    descricao.value = "";
    quantidade.value = "";
    imagemItem.value = "";
    valor.value = "";
};

formulario.addEventListener('submit', function(event){
    event.preventDefault();

    cadastrarProduto();
    limpar();
});