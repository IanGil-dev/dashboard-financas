//Declaração de variáveis
const form = document.getElementById('form');
const inputDescricao = document.getElementById('descrição');
const inputCategoria = document.getElementById('categoria');
const inputValor = document.getElementById ('valor');
const inputTipo = document.getElementById('tipo');
const listaTransacoes = document.getElementById ('lista');

const totalReceitas = document.getElementById ('total-receitas');
const totalDespesas = document.getElementById ('total-despesas');
const totalSaldo = document.getElementById ('total-saldo');
let transacoes = [];
let graficoPizza;
let graficoLinha;
let graficoBarras;

//Captura do envio do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const descricao = inputDescricao.value;
    const valor = parseFloat(inputValor.value);
    const tipo = inputTipo.value;
    const categoria = inputCategoria.value

    if (descricao === '' || isNaN(valor) || valor <=0) {
        alert('Preencha todos os campos corretamente');
        return;
    }
    const novaTransacao = {
        id: Date.now(),
        descricao: descricao,
        valor: valor,
        tipo: tipo,
        categoria: categoria,
    };
    transacoes.push(novaTransacao);
    form.reset();
    atualizarLista();
    atualizarTotais();
    atualizarGraficoPizza();
    atualizarGraficoLinha();
    atualizarGraficoBarras();
    salvarLocalStorage();
});

//Função para atualizar a lista na tela
function atualizarLista(){
    listaTransacoes.innerHTML = '';
    transacoes.forEach(function(transacao){
        const li = document.createElement('li');
        li.classList.add(transacao.tipo);
        const sinal = transacao.tipo === 'despesa' ? '-':'+';
        li.innerHTML = `
            <span>${transacao.descricao} <small>(${transacao.categoria})</small></span>
            <span>${sinal}R$ ${transacao.valor.toLocaleString('pt-BR', {Style: 'currency', currency: 'BRL'})}</span>
            <button class="btn-excluir" data-id="${transacao.id}">🗑️</button>
        `;
        listaTransacoes.appendChild(li);
    });
}

//Botão Excluir
listaTransacoes.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-excluir')) {
        const id = Number(e.target.getAttribute('data-id'));

        transacoes = transacoes.filter(function(t) {
            return t.id !== id;
        });
        atualizarLista();
        atualizarTotais();
        atualizarGraficoPizza();
        atualizarGraficoLinha();
        atualizarGraficoBarras();
        salvarLocalStorage();
    }
});

//Calculando e atualizando os totais
function atualizarTotais(){
    const receitas = transacoes
        .filter(function(t) {return t.tipo === 'receita';})
        .reduce(function(soma, t) { return soma + t.valor;}, 0);
    const despesas = transacoes
        .filter(function(t) { return t.tipo === 'despesa';})
        .reduce(function(soma, t) { return soma + t.valor;}, 0);
    const saldo = receitas - despesas;

totalReceitas.textContent = receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
totalDespesas.textContent = despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
totalSaldo.textContent = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

//Salvando no LocalStorage
function salvarLocalStorage() {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}
function carregarLocalStorage() {
    const dados = localStorage.getItem('transacoes');
    if (dados) {
        transacoes = JSON.parse(dados);
    }
}

//Graficos

function atualizarGraficoPizza() {
    const receitas = transacoes
        .filter(function(t) { return t.tipo === 'receita'; })
        .reduce(function(soma, t) { return soma + t.valor; }, 0);
    const despesas = transacoes
        .filter(function(t) {return t.tipo === 'despesa'; })
        .reduce(function(soma, t) {return soma + t.valor;}, 0);
    const ctx = document.getElementById('grafico-pizza');
    if (graficoPizza) {
        graficoPizza.destroy();
    }
    graficoPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                data: [receitas, despesas],
                backgroundColor: ['#27ae60', '#e74c3c']
            }]
        }
    });
}

//Gráfico Linha
function atualizarGraficoLinha(){
    const labels = transacoes.map(function(t, index) {
        return 'Transação' + (index + 1);
    });
    let saldoAcomulado =0;
    const valores = transacoes.map(function(t) {
        saldoAcomulado += t.tipo === 'despesa' ? -t.valor : t.valor;
        return saldoAcomulado;
    });
    const ctx = document.getElementById('grafico-linha');
    if (graficoLinha) {
        graficoLinha.destroy();
    }
    graficoLinha = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Saldo Acumulado',
                data: valores,
                borderColor: '#2c3e50',
                backgroundColor: 'rgba(44, 62, 80, 0.1)',
                fill: true,
                tension: 0.3
            }]
        }
    });
}
function atualizarGraficoBarras(){
    const totaisPorCategoria = {};
    transacoes.forEach(function(t) {
        if (!totaisPorCategoria[t.categoria]) {
            totaisPorCategoria[t.categoria] = 0;
        }
        totaisPorCategoria[t.categoria] += t.valor;
    });
    const categorias = Object.keys(totaisPorCategoria);
    const valores = Object.values(totaisPorCategoria);
    const ctx = document.getElementById('grafico-barras');
    if (graficoBarras) {
        graficoBarras.destroy();
    }
    graficoBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categorias,
            datasets: [{
                label: 'Total por categoria',
                data: valores,
                borderColor: '#2c3e50',
                backgroundColor: '#a9adad',
                barPercentage: 0.1,
                categoryPercentage: 0.1,
            }]
        }
    });
}
carregarLocalStorage();
atualizarLista();
atualizarTotais();
atualizarGraficoPizza();
atualizarGraficoLinha();
atualizarGraficoBarras();
const observer = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(entrada) {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('ativo');
        }
    });
}, {threshold: 0.2});
document.querySelectorAll('.reveal').forEach(function(elemento) {
    observer.observe(elemento);
});