const formLogin = document.getElementById('form-login');
const mensagemLogin = document.getElementById('mensagem-login');

formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('https://dashboard-financas-y60d.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })
    .then(response => response.json())
    .then(dados => {
        if (dados.mensagem) {
            localStorage.setItem('usuario_id', dados.usuario_id);
            localStorage.setItem('usuario_nome', dados.nome);
            window.location.href = 'index.html';
        } else {
            mensagemLogin.textContent = dados.erro;
            mensagemLogin.style.color = 'red';
        }
    })
    .catch(erro => {
        console.error(erro);
        mensagemLogin.textContent = 'Erro ao conectar com o servidor';
        mensagemLogin.style.color = 'red';
    });
});