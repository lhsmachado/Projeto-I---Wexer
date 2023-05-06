const emailserial = sessionStorage.getItem('cadastro') //Busca os dados do usuário no armazenamento do navegador.
const email = JSON.parse(emailserial) //Converte os dados em uma array utilizavel.
sessionStorage.removeItem('cadastro') //Exclui os dados do usuário do armazenamento do navegador por medida de segurança.

//Função que recebe os dados fornecidos pelo usuário.
document.getElementById('form-cadastro').addEventListener('submit', async function (e) {
    e.preventDefault();

    const senha = document.getElementById("cadastro-senha").value; //Leitura da senha digitada
    const verificasenha = document.getElementById("cadastro-senha-repeat").value; //Leitura da senha digitada;   

    //Verifica se as duas senhas digitadas estão iguais, caso não coincidam retorna um erro ao usuário.
    if (senha != verificasenha) {
        alert("As senhas não coincidem.")
        return;
    }

    //Salva os dados do usuário em uma variavél.
    user = ({
        nome: email.nome,
        email: email.email,
        senha: senha,
        pacientes: []
    });

    //Chama a função que irá salvar o usuário no banco de dados.
    await salvaUsuario(user)

    //Encaminha o usuário de volta para a tela de login
    window.location.href = "index.html";
})

//Função que salva o usuário no banco de dados.
async function salvaUsuario(user) {
    await fetch(`http://localhost:3000/cadastros`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
}


