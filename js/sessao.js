const urlParams = new URLSearchParams(window.location.search);  //Verifica os parametros enviados da outra tela através da url
const idSessao = urlParams.get("id"); //Recebe o ID da sessão
const numeroSessao = urlParams.get("numero");
const userserializado = sessionStorage.getItem('logged') //Verifica o ID do psicologo que está logado.
const idUser = JSON.parse(userserializado)  //Recebe e converte o ID do psicologo que foi recuperado do armazenamento do navegador.

//Verifica se existe algum usuário logado, caso não encontre reencaminha para a tela de login.
if (idUser === null) {
    window.location.href = "index.html"
}

//Função que faz a requisição dos dados do usuário no banco de dados.
const getUser = async (id) => {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/cadastros?id=` + id);
    const user = response.json();
    return (user);
}

//Função que imprime os dados no usuário no cabeçalho.
const attHeader = async () => {
    const user = await getUser(idUser);

    const nomeCompleto = user[0].nome
    const nome = nomeCompleto.split(' ')[0]
    document.getElementById("nomeUser").textContent = nome

    const email = user[0].email
    document.getElementById('emailUser').textContent = email

};

//Funçao que busca no banco de dados as informações da sessão
const getSessao = async (id) => {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/prontuario?id=` + id);
    const sessao = response.json();
    return (sessao);
}

//Função que imprime na tela os dados da sessão
const addSessao = async () => {
    const pegaSessao = await getSessao(idSessao);
    const sessao = pegaSessao[0];
    const forma = ['Pix', 'Dinheiro', 'Cartão']
    const status = ['Pago', 'Não Pago']
    document.getElementById("numeroSessao").textContent = numeroSessao

    const data = sessao.data.split('/')
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mes = meses[data[1] - 1]
    console.log(mes)
    const dataProntuario = `${data[0]} de ${mes} de ${data[2]}`
    const dataSessao = dataProntuario + ` | ${sessao.inicio}h - ${sessao.fim}h`
    document.getElementById("dataSessao").textContent = dataSessao

    document.getElementById("resumoSessao").textContent = sessao.resumo

    document.getElementById("valorSessao").textContent = sessao.valor

    document.getElementById("formaSessao").textContent = forma[sessao.pagamento - 1]

    document.getElementById("statusSessao").textContent = status[sessao.acerto - 1]

    document.getElementById("voltar-prontuario").innerHTML = ` <a href="./prontuario.html?id=${sessao.paciente}"> <img src="./image/arrow-ios-left.svg" alt="">Voltar</a>`
}

//Função de logou
document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("logged");
    window.location.href = "index.html";

})

addSessao();
attHeader();
