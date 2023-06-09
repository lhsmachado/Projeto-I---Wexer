const userserializado = sessionStorage.getItem('logged') //Busca os dados do usuário no armazenamento do navegador.
const idUser = JSON.parse(userserializado) //Converte os dados em uma variavél utilizavel.
let novoPaciente;
let atualizaPaciente;
let idEditar;
let user;

//Verifica se existe algum usuário logado, caso não encontre reencaminha para a tela de login.
if(idUser === null){
  window.location.href = "index.html"
}

//Busca os dados do usuário no banco de dados através do id fornecido pelo login.
const getUser = async (id) => {
  const response = await fetch(`https://banco-de-dados-wexer.onrender.com/cadastros?id=` + id);
  const user = response.json();
  return (user);

}

//Busca a lista de pacientes do usuário no banco de dados.
const getPacientes = async () => {
  try {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes?idPsicologo=` + idUser);
    const pacientes = await response.json();
    return (pacientes);

  } catch (error) {
    console.error("Erro ao recuperar os dados do cadastro:", error);
  }
}

//Busca uma lista de pacientes filtrada pela pesquisa do usuário.
const getPacientesFilter = async (data) => {
  try {
    const response = await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes?q=` + data);
    const pacientes = await response.json();
    return (pacientes);

  } catch (error) {
    console.error("Erro ao recuperar os dados do cadastro:", error);
  }
}

//Recebe os valores adicionados no modal de criação de novo paciente.
document.getElementById("createModal").addEventListener("submit", async function (e) {
  e.preventDefault();

  novoPaciente = {
    cpf: document.getElementById("cpf").value,
    nome: document.getElementById("nome").value,
    nascimento: document.getElementById("nascimento").value,
    email: document.getElementById("email").value,
    genero: document.getElementById("genero").value,
    nacionalidade: document.getElementById("nacionalidade").value,
    naturalidade: document.getElementById("naturalidade").value,
    profissao: document.getElementById("profissao").value,
    escolaridade: document.getElementById("escolaridade").value,
    relacionamento: document.getElementById("relacionamento").value,
    mae: document.getElementById("mae").value,
    pai: document.getElementById("pai").value,
    idPsicologo: idUser
  }

  addPaciente(novoPaciente)
})

//Faz a verificação do input de cpf e coloca automaticamente a pontuação
document.getElementById('cpf').addEventListener('input', function (event) {
  let cpf = event.target.value;
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length > 3) {
    cpf = cpf.replace(/^(\d{3})/, '$1.');
  }

  if (cpf.length > 6) {
    cpf = cpf.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
  }

  if (cpf.length > 9) {
    cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
  }

  event.target.value = cpf;
});

//Adiciona o paciente no banco de dados.
const addPaciente = async (user) => {
  await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  })
  window.location.reload();
}

//Atualiza os dados de um paciente no banco de dados.
const attPaciente = async (dados) => {
  await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes/${idEditar}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados)
  })
  window.location.reload();
}

//Adiciona eventos de cliques na tabela de pacientes.
function adicionarEventosDeClique() {
  const linhas = document.querySelectorAll('[id^="linha-"]');
  linhas.forEach(linha => {
    linha.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = linha.id.split('-')[1];
      mostrarPaciente(id);
    });

    const editarBtn = linha.querySelector(`#editar-${linha.id.split('-')[1]}`);
    editarBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = linha.id.split('-')[1];
      editarPaciente(id);
    });

    const deletarBtn = linha.querySelector('#deletePaciente');
    deletarBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = linha.id.split('-')[1];
      deletarPaciente(id);
    });
  });
}

//Cria um modal com os dados do paciente para serem editados.
const editarPaciente = async (id) => {
  const response = await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes?id=` + id);
  const pacienteresponse = await response.json();
  const paciente = pacienteresponse[0];
  idEditar = id;
  const formEditar = ` <div class="row">
      <div class="col-6 text-start">
          <h5 class="titulo-modal" >Editar dados do paciente</h5>
      </div>
      <div class="col-6 text-end">
          <button type="button" data-bs-dismiss="modal" aria-label="Close" class="btn-closed"><i class="fa-sharp fa-solid fa-circle-xmark "></i></button>
      </div>
      </div>
      <form>
      <div class="row justify-content-center">
      <div class="col-4 tam-form" >
          <label for="">CPF</label>
          <input type="text" name="cpf" id="editarCpf"  value="${paciente.cpf}">
      </div>
      <div class="col-4 tam-form" >
          <label for="">Nome</label>
          <input type="text" id="editarNome" value="${paciente.nome}">
      </div>
      <div class="col-4 tam-form" >
          <label for="">Data de Nascimento</label>
          <input type="date" id="editarNascimento" value="${paciente.nascimento}">
      </div>
      </div>
      <div class="row justify-content-center">
          <div class="col-4 tam-form" >
              <label for="">E-mail</label>
              <input type="email" id="editarEmail" value="${paciente.email}">
          </div>
          <div class="col-4 tam-form" >
              <label for="">Sexo/Gênero</label>
              <select class="form-select " id="editarGenero" value="${paciente.genero}">
                  <option></option>
                  <option ${paciente.genero === "1" ? "selected" : ""} value="1">Masculino</option>
                  <option ${paciente.genero === "2" ? "selected" : ""} value="2">Feminino</option>
                  <option ${paciente.genero === "3" ? "selected" : ""} value="3">Outros</option>
                </select>
          </div>
          <div class="col-4 tam-form" >
              <label for="">Nacionalidade</label>
              <input type="text" id="editarNacionalidade" value="${paciente.nacionalidade}">
          </div>
      </div>
      <div class="row justify-content-center">
          <div class="col-4 tam-form" >
              <label for="">Naturalidade</label>
              <input type="text" id="editarNaturalidade" value="${paciente.naturalidade}">
          </div>
          <div class="col-4 tam-form" >
              <label for="">Profissão</label>
              <input type="text" id="editarProfissao" value="${paciente.profissao}">
          </div>
          <div class="col-4 tam-form" >
              <label for="">Escolaridade</label>
              <input type="text" id="editarEscolaridade" value="${paciente.escolaridade}">
          </div>
      </div>
      <div class="row justify-content-center">
          <div class="col-4 tam-form" >
              <label for="">Estado Civil</label>
              <select class="form-select " id="editarRelacionamento" value="${paciente.relacionamento}">
                  <option></option>
                  <option ${paciente.relacionamento === "1" ? "selected" : ""} value="1">Solteiro(a)</option>
                  <option ${paciente.relacionamento === "2" ? "selected" : ""} value="2">Casado(a)</option>
                  <option ${paciente.relacionamento === "3" ? "selected" : ""} value="3">Viuvo(a)</option>
                  <option ${paciente.relacionamento === "4" ? "selected" : ""} value="1">Separado(a)</option>
                  <option ${paciente.relacionamento === "5" ? "selected" : ""} value="2">Divorciado(a)</option>
                </select>
          </div>
          <div class="col-4 tam-form" >
              <label for="">Mãe</label>
              <input type="text" id="editarMae" value="${paciente.mae}">
          </div>
          <div class="col-4 tam-form" >
              <label for="">Pai</label>
              <input type="text" id="editarPai" value="${paciente.pai}">
          </div>
      </div>`

  const editarBody = document.getElementById("editarBody")
  editarBody.innerHTML = formEditar
  console.log("teste")

}

//Deleta um paciente no banco de dados.
const deletarPaciente = async (id) => {

  await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes/` + id, {
    method: "DELETE"
  });
  window.location.reload();

  console.log("Deletar Paciente: ", id);
}

//Adiciona as linhas na tabela de pacientes.
const addTabela = async () => {

  const pacientes = await getPacientes();
  const tabela = document.getElementById("tabela");


  for (let i = 0; i < pacientes.length; i++) {

    const dadosTabela =
      `<div class="row mx-4 titulo-tabela" id="linha-${pacientes[i].id}" data-bs-toggle="modal" data-bs-target="#mostrarModal">
          <div class="col-sm-2  border text-center">
              <span>${pacientes[i].id}</span>
          </div>
          <div class="col-sm-4  border text-start">
              <span>${pacientes[i].nome}</span>
          </div>
          <div class="col-sm-4  border text-start">
              <span>${pacientes[i].cpf}</span>
          </div>
          <div class="col-sm-2  d-flex border justify-content-center  p-0">
              <div class="row d-flex align-items-center">
                  
                      <a href="./prontuario.html?id=${pacientes[i].id}" class="iconesTabela" ><img src="./image/prontuario-icon.svg" alt="" ></a>
                  
                      <button class="iconesTabela ms-2" id="editar-${pacientes[i].id}" data-bs-toggle="modal" data-bs-target="#editarModal"><img src="./image/editar-icon.svg" alt=""></button>
                  
                  
                      <button class="iconesTabela ms-2" id="deletePaciente"><img src="./image/delete-icon.svg" alt="" ></button>
                  
              </div>
          </div>
        </div>`

    tabela.innerHTML += dadosTabela

  };
  tabela.innerHTML += `<div class="row p-5"></div>`
  adicionarEventosDeClique();
}

//Atualiza o header com os dados do usuário.
const attHeader = async () => {
  const user = await getUser(idUser);

  const nomeCompleto = user[0].nome
  const nome = nomeCompleto.split(' ')[0]
  document.getElementById("nomeUser").textContent = nome

  const email = user[0].email
  document.getElementById('emailUser').textContent = email

};

addTabela();
attHeader();

//Cria um modal com os dados do paciente, porém com os campos desabilitados.
const mostrarPaciente = async (id) => {

  const response = await fetch(`https://banco-de-dados-wexer.onrender.com/pacientes?id=` + id);
  const pacienteresponse = await response.json();
  const paciente = pacienteresponse[0]
  console.log(paciente)
  const formMostrar = `<div class="row">
    <div class="col-6 text-start d-flex">
        <h5 class="titulo-modal">Dados do Paciente</h5>
        
        <button class="iconesTabela ms-4 mt-4" id="editar" data-bs-toggle="modal" data-bs-target="#editarModal"><img src="./image/editar-icon.svg" alt=""></button>
    
    </div>
    <div class="col-6 text-end">
        <button type="button" data-bs-dismiss="modal" aria-label="Close" class="btn-closed"><i class="fa-sharp fa-solid fa-circle-xmark "></i></button>
    </div>
    </div>
    <form>
    <div class="row justify-content-center">
    <div class="col-4 tam-form" >
        <label for="">CPF</label>
        <input type="text" name="cpf"  pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" maxlength="14" id="cpf" value="${paciente.cpf}" disabled>
    </div>
    <div class="col-4 tam-form" >
        <label for="">Nome</label>
        <input type="text" id="nome" value="${paciente.nome}" disabled>
    </div>
    <div class="col-4 tam-form" >
        <label for="">Data de Nascimento</label>
        <input type="date" id="nascimento" value="${paciente.nascimento}" disabled>
    </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-4 tam-form" >
            <label for="">E-mail</label>
            <input type="email" id="email" value="${paciente.email}" disabled>
        </div>
        <div class="col-4 tam-form" >
            <label for="">Sexo/Gênero</label>
            <select class="form-select " id="genero" value="${paciente.genero}" disabled>
                <option></option>
                <option ${paciente.genero === "1" ? "selected" : ""} value="1">Masculino</option>
                <option ${paciente.genero === "2" ? "selected" : ""} value="2">Feminino</option>
                <option ${paciente.genero === "3" ? "selected" : ""} value="3">Outros</option>
              </select>
        </div>
        <div class="col-4 tam-form" >
            <label for="">Nacionalidade</label>
            <input type="text" id="nacionalidade" value="${paciente.nacionalidade}" disabled>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-4 tam-form" >
            <label for="">Naturalidade</label>
            <input type="text" id="naturalidade" value="${paciente.naturalidade}" disabled>
        </div>
        <div class="col-4 tam-form" >
            <label for="">Profissão</label>
            <input type="text" id="profissao" value="${paciente.profissao}" disabled>
        </div>
        <div class="col-4 tam-form" >
            <label for="">Escolaridade</label>
            <input type="text" id="escolaridade" value="${paciente.escolaridade}" disabled>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-4 tam-form" >
            <label for="">Estado Civil</label>
            <select class="form-select " id="relacionamento" value="${paciente.relacionamento}" disabled>
                <option></option>
                <option ${paciente.relacionamento === "1" ? "selected" : ""} value="1">Solteiro(a)</option>
                <option ${paciente.relacionamento === "2" ? "selected" : ""} value="2">Casado(a)</option>
                <option ${paciente.relacionamento === "3" ? "selected" : ""} value="3">Viuvo(a)</option>
                <option ${paciente.relacionamento === "4" ? "selected" : ""} value="1">Separado(a)</option>
                <option ${paciente.relacionamento === "5" ? "selected" : ""} value="2">Divorciado(a)</option>
              </select>
        </div>
        <div class="col-4 tam-form" >
            <label for="">Mãe</label>
            <input type="text" id="mae" value="${paciente.mae}" disabled>
        </div>
        <div class="col-4 tam-form" >
            <label for="">Pai</label>
            <input type="text" id="pai" value="${paciente.pai}" disabled>
        </div>
    </div>`

  const mostrarBody = document.getElementById("mostrarBody")
  mostrarBody.innerHTML = formMostrar

  document.getElementById("editar").addEventListener('click', function (e) {
    e.preventDefault();
    editarPaciente(id);
  }
  );

}

//Faz a leitura dos campos no modal de edição e chama a função de atualização
document.getElementById("editarModal").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("teste")
  atualizaPaciente = {
    id: idEditar,
    cpf: document.getElementById("editarCpf").value,
    nome: document.getElementById("editarNome").value,
    nascimento: document.getElementById("editarNascimento").value,
    email: document.getElementById("editarEmail").value,
    genero: document.getElementById("editarGenero").value,
    nacionalidade: document.getElementById("editarNacionalidade").value,
    naturalidade: document.getElementById("editarNaturalidade").value,
    profissao: document.getElementById("editarProfissao").value,
    escolaridade: document.getElementById("editarEscolaridade").value,
    relacionamento: document.getElementById("editarRelacionamento").value,
    mae: document.getElementById("editarMae").value,
    pai: document.getElementById("editarPai").value,
    idPsicologo: idUser
  }

  attPaciente(atualizaPaciente)

})

//Faz uma pesquisa no banco de dados se existe algum paciente com o dado fornecido e retorna ele na tabela de pacientes.
const pesquisar = async () => {

  const pesquisa = document.getElementById("pesquisar-home-input").value
  const pacientes = await getPacientesFilter(pesquisa)
  const tabela = document.getElementById("tabela");

  if (pesquisa === ' ') {
    window.reload.location
  }

  tabela.innerHTML = ` <div class="row">
    <div class="col-12 col-sm-6">
        <button class="btn-adicionar-paciente" data-bs-toggle="modal" data-bs-target="#createModal" id="btn-create"><i class="fa-solid fa-circle-plus" ></i> Novo Cadastro</button>
    </div>
    <div class="col-12 col-sm-6 mt-4">
        <form class="d-flex pesquisar justify-content-end me-4" role="search" >
            <input class="form-control" type="text" placeholder="Pesquisar" id="pesquisar-home-input">
            <button class="btn btn-outline-success" type="button" onclick="pesquisar()"><i class="fa-solid fa-magnifying-glass m-1"></i>Filtrar</button>
        </form>
    </div>
</div>

<div class="row d-flex mx-4 titulo-tabela mt-5">
    <div class="col-sm-2 border text-center">
        <h4>Código</h4>
    </div>
    <div class="col-sm-4 col-12 border text-start">
        <h4>Nome</h4>
    </div>
    <div class="col-sm-4 col-12 border text-start">
        <h4>CPF</h4>
    </div>
    <div class="col-sm-2 col-12 border text-center">
        <h4>Ações</h4>
    </div>
</div>`
  for (let i = 0; i < pacientes.length; i++) {

    const dadosTabela =
      `<div class="row mx-4 titulo-tabela" id="linha-${pacientes[i].id}" data-bs-toggle="modal" data-bs-target="#mostrarModal">
      <div class="col-sm-2  border text-center">
          <span>${pacientes[i].id}</span>
      </div>
      <div class="col-sm-4  border text-start">
          <span>${pacientes[i].nome}</span>
      </div>
      <div class="col-sm-4  border text-start">
          <span>${pacientes[i].cpf}</span>
      </div>
      <div class="col-sm-2  d-flex border justify-content-center  p-0">
          <div class="row d-flex align-items-center">
              
                  <a href="./prontuario.html?id=${pacientes[i].id}" class="iconesTabela" ><img src="./image/prontuario-icon.svg" alt="" ></a>
              
                  <button class="iconesTabela ms-2" id="editar-${pacientes[i].id}" data-bs-toggle="modal" data-bs-target="#editarModal"><img src="./image/editar-icon.svg" alt=""></button>
              
              
                  <button class="iconesTabela ms-2" id="deletePaciente"><img src="./image/delete-icon.svg" alt="" ></button>
              
          </div>
      </div>
    </div>`

    tabela.innerHTML += dadosTabela
    adicionarEventosDeClique();
  };
  tabela.innerHTML += `<div class="row p-5"></div>`

}

//Remove os dados do usuário do armazenamento do navegador e o encaminha para a tela de login.
document.getElementById("logout").addEventListener("click", function (e) {
  e.preventDefault();
  sessionStorage.removeItem("logged");
  window.location.href = "index.html";

})


