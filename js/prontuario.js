const urlParams = new URLSearchParams(window.location.search);
const idPaciente = urlParams.get("id");
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
    for (let i = card.length -1;i>= 0; i--){
        
        if(card[i].tipo === "fato"){
            const dadosCard = `<div class="col-12">
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
                            <ul class="dropdown-menu">
                              <li><button class="dropdown-item" href="#">Action</button></li>
                              <li><button class="dropdown-item" href="#">Another action</button></li>
                            </ul>
                          </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span>${card[i].data}</span>
                    </div>
                </div>
                <div class="row mt-5">
                    <div class="col-12">
                        <span id="resumoCard">${card[i].ocorrido}</span>
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
            const dadosCard = `<a href="./sessao.html?id=${card[i].id}" style="text-decoration:none"><div class="col-12">
            <div class="container-fluid cardProntuario" style = "border-color:#00995D">
                <div class="row d-flex ">
                    <div class="col-12">
                    <img src="./image/mental-prontuario.svg" alt="" class="imgProntuario">
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col ">
                        <h4>Sessão </h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <div class="dropdown">
                            <button type="button" data-bs-toggle="dropdown" aria-expanded="false" class="moreBtn">
                              ...
                            </button>
                            <ul class="dropdown-menu">
                              <li><button class="dropdown-item" href="#">Action</button></li>
                              <li><button class="dropdown-item" href="#">Another action</button></li>
                            </ul>
                          </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span>${card[i].data}</span>
                    </div>
                </div>
                <div class="row mt-5">
                    <div class="col-12">
                        <span id="resumoCard">${card[i].resumo}</span>
                    </div>
                </div>
            </div>
        </div></a>` 

        if(verlinha > 0){
            cardHtml.innerHTML += `<div class="vertical-line" style="border-color: #00995D"></div>`;
        }

        cardHtml.innerHTML += dadosCard;
        }
        console.log(verlinha)
        verlinha += verlinha + 1;
};

}
addCard();