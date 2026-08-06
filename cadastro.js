const formCadastro = document.getElementById('form-cadastro');
const mensagemCadastro = document.getElementById('mensagem-cadastro');

formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://127.0.0.1:5000/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha
        })
    })
    .then(response => response.json())
    .then(dados => {
        if (dados.mensagem) {
            mensagemCadastro.textContent = dados.mensagem;
            mensagemCadastro.style.color = 'green';
            formCadastro.reset();
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            mensagemCadastro.textContent = dados.erro;
            mensagemCadastro.style.color = 'red';
        }
    })
    .catch(erro => {
        console.error(erro);
        mensagemCadastro.textContent = 'Erro ao conectar ao servidor.';
        mensagemCadastro.style.color = 'red';
    });
});