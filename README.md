# 💰 Dashboard de Finanças Pessoais

Aplicação web para controle de receitas e despesas, com gráficos interativos e persistência local dos dados. Projeto desenvolvido para praticar HTML, CSS e JavaScript puro (vanilla JS).

🔗 https://iangil-dev.github.io/dashboard-financas/

## ✨ Funcionalidades

- Cadastro de transações (receitas e despesas) com categoria
- Lista dinâmica de transações, atualizada automaticamente
- Cálculo automático de totais (receitas, despesas e saldo)
- Exclusão de transações
- Gráfico de pizza — proporção entre receitas e despesas
- Gráfico de linha — evolução do saldo acumulado ao longo do tempo
- Gráfico de barras — gastos organizados por categoria
- Animações de entrada ao rolar a página (scroll reveal)
- Layout responsivo
- Persistência dos dados no navegador (localStorage) — os dados continuam salvos mesmo após fechar a página

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3 (responsividade, animações)
- JavaScript (DOM, Eventos, Arrays e Objetos, LocalStorage, Modularização)
- [Chart.js](https://www.chartjs.org/) para os gráficos

## 📁 Estrutura do projeto


dashboard-financas/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── img/
│   └── icons/
└── README.md


## 💾 Sobre o armazenamento dos dados

Este projeto usa o *localStorage* do navegador para salvar as transações, em vez de um banco de dados. Foi uma escolha proposital nesta etapa do projeto, para focar na lógica de front-end (manipulação do DOM, eventos e estado da aplicação) antes de integrar um back-end.

## 🚀 Como executar localmente

1. Clone o repositório:
   
   git clone https://github.com/IanGil-dev/dashboard-financas.git
   
2. Abra o arquivo index.html no navegador (ou use a extensão *Live Server* no VS Code para recarregamento automático).

## 🔮 Próximos passos

- [ ] Modo escuro/claro
- [ ] Filtro de transações por mês
- [ ] Exportar relatório em PDF/Excel
- [ ] Definir meta de economia
- [ ] Alertas de vencimento de contas
- [ ] Migrar armazenamento para back-end com banco de dados (login de usuário, dados na nuvem)
