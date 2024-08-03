const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Lista estática de usuários
let users = [];

// Rota inicial
app.get('/', (req, res) => {
    res.status(200).send('Bem vindo à aplicação');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Sign Up
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Validações
    if (!name) return res.status(400).send('Por favor, verifique se passou o nome.');
    if (!email) return res.status(400).send('Por favor, verifique se passou o email.');
    if (!password) return res.status(400).send('Por favor, verifique se passou a senha.');

    // Verifica se o email já está cadastrado
    const userExists = users.find(user => user.email === email);
    if (userExists) return res.status(400).send('Email já cadastrado, insira outro.');

    // Criação do usuário
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);

    res.status(201).send(`Seja bem vindo ${name}! Pessoa usuária registrada com sucesso!`);
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).send('Insira um e-mail válido.');
    if (!password) return res.status(400).send('Insira uma senha válida.');

    const user = users.find(user => user.email === email);
    if (!user) return res.status(404).send('Email não encontrado no sistema, verifique ou crie uma conta.');

    if (user.password !== password) return res.status(401).send('Senha incorreta.');

    res.status(200).send(`Seja bem vindo ${user.name}! Pessoa usuária logada com sucesso!`);
});


let messages = [];

// Criar mensagem
app.post('/message', (req, res) => {
    const { email, title, description } = req.body;

    if (!email || !users.find(user => user.email === email)) {
        return res.status(404).send('Email não encontrado, verifique ou crie uma conta');
    }
    if (!title || !description) {
        return res.status(400).send('Por favor, verifique se passou o título e a descrição.');
    }

    const newMessage = { id: messages.length + 1, email, title, description };
    messages.push(newMessage);

    res.status(201).send(`Mensagem criada com sucesso! ${title}`);
});

// Ler mensagens por email
app.get('/message/:email', (req, res) => {
    const { email } = req.params;

    if (!users.find(user => user.email === email)) {
        return res.status(404).send('Email não encontrado, verifique ou crie uma conta');
    }

    const userMessages = messages.filter(msg => msg.email === email);
    res.status(200).send(`Seja bem-vindo! ${JSON.stringify(userMessages)}`);
});

// Atualizar mensagem
app.put('/message/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const message = messages.find(msg => msg.id == id);
    if (!message) return res.status(404).send('Por favor, informe um id válido da mensagem.');

    message.title = title || message.title;
    message.description = description || message.description;

    res.status(200).send(`Mensagem atualizada com sucesso! ${JSON.stringify(message)}`);
});

// Deletar mensagem
app.delete('/message/:id', (req, res) => {
    const { id } = req.params;
    const messageIndex = messages.findIndex(msg => msg.id == id);

    if (messageIndex === -1) return res.status(404).send('Mensagem não encontrada, verifique o identificador em nosso banco.');

    messages.splice(messageIndex, 1);
    res.status(200).send('Mensagem apagada com sucesso');
});
