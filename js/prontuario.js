const urlParams = new URLSearchParams(window.location.search);  //Verifica os parametros enviados da outra tela através da url
const idPaciente = urlParams.get("id"); //Recebe o ID do paciente.
const userserializado = sessionStorage.getItem('logged') //Verifica o ID do psicologo que está logado.
const idUser = JSON.parse(userserializado)  //Recebe e converte o ID do psicologo que foi recuperado do armazenamento do navegador.
let paciente;
let sessao;
let verlinha = 0

//Verifica se existe algum usuário logado, caso não encontre reencaminha para a tela de login.
if (idUser === null) {
    window.location.href = "index.html"
}

//Função que faz a leitura dos inputs do modal de sessão e chama a função de encaminhar esses dados para o banco de dados.
document.getElementById("sessaoModal").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("entrou");
    sessao = {
        data: document.getElementById("dataSessao").value,
        inicio: document.getElementById("inicioSessao").value,
        fim: document.getElementById("fimSessao").value,
        titulo: document.getElementById("tituloSessao").value,
        resumo: document.getElementById("resumoSessao").value,
        valor: document.getElementById("valorSessao").value,
        pagamento: document.getElementById("pagamentoSessao").value,
        acerto: document.getElementById("acertoSessao").value,
        tipo: "sessao",
        paciente: idPaciente
    };

    enviaSessao(sessao);
})

//Função que faz a leitura dos inputs do modal de fatos relevantes e chama a função de encaminhar esses dados para o banco de dados.
document.getElementById("fatoModal").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("entrou");
    sessao = {
        data: document.getElementById("dataFato").value,
        titulo: document.getElementById("tituloFato").value,
        ocorrido: document.getElementById("ocorridoFato").value,
        tipo: "fato",
        paciente: idPaciente
    };

    enviaSessao(sessao);
})

//Função que faz a requisição no banco de dados das informações do paciente.
async function getPaciente(id) {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes?id=` + id);
    const pacienteresponse = await response.json();
    paciente = await pacienteresponse[0];
    return (paciente);
}

//Função que atualiza os dados do paciente no formulário lateral.
async function attprontuario() {
    await getPaciente(idPaciente);

    const nomeHtml = document.getElementById("nomePaciente");
    nomeHtml.innerHTML = paciente.nome;
    const nascimentoHtml = document.getElementById("nascimentoPaciente");
    nascimentoHtml.innerHTML = paciente.nascimento;
    const profissaoHtml = document.getElementById("profissaoPaciente");
    profissaoHtml.innerHTML = paciente.profissao;
    const escolaridadeHtml = document.getElementById("escolaridadePaciente");
    escolaridadeHtml.innerHTML = paciente.escolaridade

}

//Função que envia para o banco de dados a sessão/fato cadastrado.
async function enviaSessao(data) {
    await fetch(`https://banco-de-dados-wexer.onrender.com/prontuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    window.location.reload();
}

//Função que faz a requisição dos dados do prontuário.
async function getCard(id) {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/prontuario?paciente=` + id);
    const cardResponse = await response.json();
    const card = await cardResponse
    return (card);
}

//Função que imprime na tela os cards de sessão e fato relevante.
const addCard = async () => {
    const card = await getCard(idPaciente)
    console.log(card)
    const cardHtml = document.getElementById("exibeCard");
    let sessao = 0;

    //Faz a contagem do cards do tipo sessão para colocar o numero respectivo no card.
    for (let i = card.length - 1; i >= 0; i--) {
        if (card[i].tipo === 'sessao') {
            sessao++;
        }
    }


    //Laço de repetição que percorre o array de cards em forma inversa para imprimir do mais recente ao mais antigo.
    for (let i = card.length - 1; i >= 0; i--) {

        //Faz a formatação da data para ser impressa no formato extenso.
        const data = card[i].data.split('/')
        const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        const mes = meses[data[1] - 1]
        console.log(mes)
        const dataProntuario = `${data[0]} de ${mes} de ${data[2]}`



        // Verifica se o tipo de card é um fato, se o retorno for sim, imprime o card com os dados relativos ao fato relevante.
        if (card[i].tipo === "fato") {
            let ocorrido
            const ocorridoOriginal = card[i].ocorrido;
            const tamMax = 250;

            if (ocorridoOriginal.length > tamMax) {
                ocorrido = ocorridoOriginal.substring(0, tamMax) + "..." + "<span>Ver mais</span>"
            }
            else {
                ocorrido = ocorridoOriginal
            }

            const dadosCard = `<div class="col-12 p-0">
            <div class="container-fluid cardProntuario"style = "border-color:#2F80ED">
                <div class="row d-flex ">
                    <div class="col-12">
                    <img src="./image/pin-prontuario.svg" alt="" class="imgProntuario">
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col ">
                        <h4>Fato Relevante </h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <div class="dropdown">
                            <button type="button" data-bs-toggle="dropdown" aria-expanded="false" class="moreBtn">
                              ...
                            </button>
                            <ul class="dropdown-menu" style="height:fit-content; width:fit-content;">
                              <li><button class="dropdown-item m-2 btn-prontuario " style="color:#2F80ED"><img src="./image/pencil-line.svg" alt="">Editar</button></li>
                              <li><button class="dropdown-item m-2 btn-prontuario" style="color:#EB5757"><img src="./image/delete-bin-5-line.svg" alt="">Excluir</button></li>
                            </ul>
                          </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span class="dataProntuario">${dataProntuario}</span>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <span id="resumoCard" class="corpoProntuario">${ocorrido}</span><br><br>
                    </div>
                </div>
            </div>
        </div>`
            // Verifica se é o primeiro card impresso, caso não seja é impresso na tela a linha que separa os cards.
            if (verlinha > 0) {
                cardHtml.innerHTML += `<div class="vertical-line" style="border-color: #2F80ED"></div>`;
            }
            cardHtml.innerHTML += dadosCard;
        }

        // Verifica se o tipo de card é uma sessão, se o retorno for sim, imprime o card com os dados relativos a sessão.
        if (card[i].tipo === "sessao") {

            let resumo
            const resumoOriginal = card[i].resumo;
            const tamMax = 250;

            if (resumoOriginal.length > tamMax) {
                resumo = resumoOriginal.substring(0, tamMax) + "..." + `<span style="color:#2F80ED">Ver mais</span>`;
            }
            else {
                resumo = resumoOriginal;
            }

            const dadosCard = `<a href="./sessao.html?id=${card[i].id}&&numero=${sessao}" style="text-decoration:none" class="p-0 mb-3"><div class="col-12 ">
            <div class="container-fluid cardProntuario" style = "border-color:#00995D">
            
                <div class="row d-flex ">
                    <div class="col-12">
                    <img src="./image/mental-prontuario.svg" alt="" class="imgProntuario">
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col ">
                        <h4 style="color:black">Sessão 0${sessao} </h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                    <div class="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false" class="moreBtn">
                      ...
                    </button>
                    <ul class="dropdown-menu" style="height:fit-content; width:fit-content;">
                      <li><button class="dropdown-item m-2 btn-prontuario " style="color:#2F80ED"><img src="./image/pencil-line.svg" alt="">Editar</button></li>
                      <li><button class="dropdown-item m-2 btn-prontuario" style="color:#EB5757"><img src="./image/delete-bin-5-line.svg" alt="">Excluir</button></li>
                    </ul>
                  </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span class="dataProntuario">${dataProntuario}</span>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <span id="resumoCard" class="corpoProntuario">${resumo}</span><br><br>
                    </div>
                </div>
            </div>
        </div></a>`
            sessao--;

            // Verifica se é o primeiro card impresso, caso não seja é impresso na tela a linha que separa os cards.
            if (verlinha > 0) {
                cardHtml.innerHTML += `<div class="vertical-line" style="border-color: #00995D"></div>`;
            }

            cardHtml.innerHTML += dadosCard;
        }

        verlinha += verlinha + 1;
    };

}

//Função que faz a requisição dos dados do usuário no banco de dados.
const getUser = async (id) => {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/cadastros?id=` + id);
    const user = response.json();
    return (user);
    console.log(user)
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

//Faz a verificação do que é digitado no input de data e formata em DD/MM/AAAA
document.querySelectorAll('.data-input').forEach(function (input) {
    input.addEventListener('input', function (event) {
        let data = event.target.value;
        data = data.replace(/\D/g, '');

        if (data.length > 2) {
            data = data.replace(/^(\d{2})/, '$1/');
        }

        if (data.length > 5) {
            data = data.replace(/^(\d{2})\/(\d{2})/, '$1/$2/');
        }

        if (data.length > 10) {
            data = data.replace(/^(\d{2})\/(\d{2})\/(\d{4})/, '$1/$2/$3');
        }

        event.target.value = data;
    });
});

//Faz a verificação do que é digitado no input de horario e formata em HH:MM
document.querySelectorAll('.horario-input').forEach(function (input) {
    input.addEventListener('input', function (event) {
        let horario = event.target.value;
        horario = horario.replace(/\D/g, '');

        if (horario.length > 2) {
            horario = horario.replace(/^(\d{2})/, '$1:');
        }

        if (horario.length > 5) {
            horario = horario.replace(/^(\d{2}):(\d{2})/, '$1:$2');
        }

        event.target.value = horario;
    });
});

//Remove os dados do usuário do armazenamento do navegador e o encaminha para a tela de login.
document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("logged");
    window.location.href = "index.html";
})


addCard(); //Chama a função que imprime na tela os cards de sessão e prontuario.
attHeader(); //Chama a função que atualiza o cabeçalho com os dados do usuario. 
attprontuario(); //Chama a função que atualiza o prontuario lateral com os dados do paciente.