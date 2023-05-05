const urlParams = new URLSearchParams(window.location.search);
const idPaciente = urlParams.get("id");
const userserializado = sessionStorage.getItem('logged')
const idUser = JSON.parse(userserializado)
let paciente;
let sessao;
attprontuario();
let verlinha = 0

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

async function getPaciente(id){
    const response =  await fetch(`http://localhost:3000/pacientes?id=`+ id); 
    const pacienteresponse = await response.json();
    paciente = await pacienteresponse[0];
    console.log(paciente)
}

async function attprontuario(){
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

async function enviaSessao(data){
    await fetch(`http://localhost:3000/prontuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    window.location.reload();
}

 async function getCard (id) {
    const response = await fetch(`http://localhost:3000/prontuario?paciente=` + id);
    const cardResponse = await response.json();
    const card = await cardResponse
    return (card);
}

const addCard = async () =>{
    const card = await getCard(idPaciente)
    console.log(card)
    const cardHtml = document.getElementById("exibeCard");
    let sessao = 0;

    for (let i = card.length-1; i>=0; i--){
        if (card[i].tipo==='sessao'){
            sessao++;
        }
    }
    for (let i = card.length -1;i>= 0; i--){

        const data = card[i].data.split('/')
        const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        const mes = meses[data[1]-1]
        console.log(mes)
        const dataProntuario = `${data[0]} de ${mes} de ${data[2]}`
        



        if(card[i].tipo === "fato"){
            let ocorrido
            const ocorridoOriginal = card[i].ocorrido;
            const tamMax = 250;

            if(ocorridoOriginal.length > tamMax){
                 ocorrido = ocorridoOriginal.substring(0,tamMax) + "..." + "<span>Ver mais</span>"
            }
            else{
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
        
        if(verlinha > 0){
            cardHtml.innerHTML += `<div class="vertical-line" style="border-color: #2F80ED"></div>`;
        }
        cardHtml.innerHTML += dadosCard;
        }
        if(card[i].tipo === "sessao"){

            let resumo
            const resumoOriginal = card[i].resumo;
            const tamMax = 250;

            if(resumoOriginal.length > tamMax){
                 resumo = resumoOriginal.substring(0,tamMax) + "..." + `<span style="color:#2F80ED">Ver mais</span>`;
            }
            else{
                 resumo = resumoOriginal;
            }

            const dadosCard = `<a href="./sessao.html?id=${card[i].id}" style="text-decoration:none" class="p-0 mb-3"><div class="col-12 ">
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
        if(verlinha > 0){
            cardHtml.innerHTML += `<div class="vertical-line" style="border-color: #00995D"></div>`;
        }

        cardHtml.innerHTML += dadosCard;
        }
        console.log(verlinha)
        verlinha += verlinha + 1;
};

}

const getUser = async (id) =>{
    const response = await fetch(`http://localhost:3000/cadastros?id=`+ id); 
    const user = response.json();
    return(user);
    console.log(user)
}

const attHeader = async()=>{
    const user = await getUser(idUser);

    const nomeCompleto = user[0].nome
    const nome = nomeCompleto.split(' ')[0]
    document.getElementById("nomeUser").textContent = nome

    const email = user[0].email
    document.getElementById('emailUser').textContent = email

    };

    addCard();
    attHeader();