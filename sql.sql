CREATE DATABASE IF NOT EXISTS dashboard_financas;
USE dashboard_financas;
INSERT INTO categorias (nome, tipo, usuario_id) VALUES ('Outros', 'despesa', NULL);
INSERT INTO usuarios (nome, email, senha_hash) VALUES ('Usuário teste','teste@teste.com','senha_temporaria');

CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categorias (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR (50) NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    usuario_id INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE transacoes (
	id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);
INSERT INTO categorias (nome, tipo, usuario_id) VALUES
('Salário', 'receita', NULL),
('Alimentação', 'despesa', NULL),
('Transporte', 'despesa', NULL),
('Moradia', 'despesa', NULL),
('Lazer', 'despesa', NULL),
('Saúde', 'despesa', NULL);
SELECT * FROM transacoes;