const userserializado = sessionStorage.getItem('logged')
const user = JSON.parse(userserializado)
let novoPaciente;
console.log(user)




document.getElementById("exampleModal").addEventListener("submit", async function(e) {
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
        }

        console.log(novoPaciente)
    })