from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

def conectar_banco():
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        dbname=os.getenv('DB_NAME')
    )

@app.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    dados = request.get_json()
    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    if not nome or not email or not senha:
        return jsonify({'erro': 'Preencha todos os campos'}), 400
    senha_hash = generate_password_hash(senha)

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute(
            "INSERT INTO usuarios (nome, email, senha_hash) VALUES (%s, %s, %s)",
            (nome, email, senha_hash)
        )
        conexao.commit()
        cursor.close()
        conexao.close()
        return jsonify({'mensagem': 'Usuário cadastrado com sucesso!'}), 201
    except psycopg2.errors.UniqueViolation:
        conexao.rollback()
        return jsonify({'erro': 'Email já cadastrado'}), 400
    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500

@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')
    try:
        conexao = conectar_banco()
        cursor = conexao.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = %s",
            (email,)
        )
        usuario = cursor.fetchone()
        cursor.close()
        conexao.close()

        if usuario and check_password_hash(usuario['senha_hash'], senha):
            return jsonify({
                'mensagem': 'Login realizado com sucesso!',
                'usuario_id': usuario['id'],
                'nome': usuario['nome'],
            }), 200
        else:
            return jsonify({'erro': 'Email ou senha incorretos'}), 401
    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500

@app.route('/')
def testar_conexao():
    try:
        conexao = conectar_banco()
        conexao.close()
        return 'Conexão bem-sucedida ao banco de dados!'
    except Exception as erro:
        return f'Erro ao conectar ao banco de dados: {erro}'

@app.route('/transacoes', methods=['POST'])
def criar_transacao():
    dados = request.get_json()
    descricao = dados.get('descricao')
    valor = dados.get('valor')
    tipo = dados.get('tipo')
    categoria_id = dados.get('categoria_id')
    data = dados.get('data')
    usuario_id = dados.get('usuario_id')

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute(
            "INSERT INTO transacoes (usuario_id, categoria_id, descricao, valor, tipo, data) VALUES (%s, %s, %s, %s, %s, %s)",
            (usuario_id, categoria_id, descricao, valor, tipo, data)
        )
        conexao.commit()
        cursor.close()
        conexao.close()
        return jsonify({'mensagem': 'Transação criada com sucesso!'}), 201
    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500

@app.route('/transacoes', methods=['GET'])
def listar_transacoes():
    usuario_id = request.args.get('usuario_id')
    try:
        conexao = conectar_banco()
        cursor = conexao.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            "SELECT t.id, t.descricao, t.valor, t.tipo, t.data, c.nome AS categoria "
            "FROM transacoes t "
            "LEFT JOIN categorias c ON t.categoria_id = c.id "
            "WHERE t.usuario_id = %s "
            "ORDER BY t.data DESC",
            (usuario_id,)
        )
        resultado = cursor.fetchall()
        cursor.close()
        conexao.close()
        return jsonify(resultado), 200
    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500

@app.route('/transacoes/<int:id>', methods=['DELETE'])
def excluir_transacao(id):
    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM transacoes WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return jsonify({'mensagem': 'Transação excluída com sucesso!'}), 200
    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500

if __name__ == '__main__':
    app.run(debug=True)