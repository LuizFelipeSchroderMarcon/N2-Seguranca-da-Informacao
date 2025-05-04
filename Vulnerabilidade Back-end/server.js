const express = require('express');
const bodyParser = require('body-parser');
const usuarioController = require('./controllers/usuarioController');
const { ChecarToken } = require('./middleware/VerificarToken');
const Usuario = require('./models/usuarioModel');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Criar
app.post('/usuarios', usuarioController.criarUsuario);

// Excluir
app.delete('/usuarios/:id', ChecarToken, usuarioController.excluirUsuario);

// Cria o usuário inicial
async function criarUsuarioInicial() {
  try {
    const usuarioExistente = await Usuario.obterPorEmail('teste@gmail.com');
    if (!usuarioExistente) {
      const nome = 'teste';
      const email = 'teste@gmail.com';
      const senha = 'teste';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);
      const usuarioId = await Usuario.criar(nome, email, hashedPassword);
      console.log(`Usuário inicial 'teste' criado com ID: ${usuarioId}`);
    } else {
      console.log('Usuário inicial \'teste\' já existe.');
    }
  } catch (error) {
    console.error('Erro ao criar usuário inicial:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  criarUsuarioInicial(); 
});