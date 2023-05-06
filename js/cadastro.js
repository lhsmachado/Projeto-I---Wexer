//Função que recebe os dados fornecidos pelo usuário.
document.getElementById("form-cadastro").addEventListener("submit", function(e) {
    e.preventDefault()

    const nome = document.getElementById("cadastro-nome").value;  //Leitura do nome digitado.
    const email = document.getElementById("cadastro-email").value; //Leitura do email digitado.
    
    //Verifica se o email cadastrado possui mais de 5 caracteres.
    if(email.length < 5){
        alert("Preencha o campo com um email válido.");
        return;
    }

    const verifyEmail = getEmail(email) //Busca no banco de dados se já existe um usuário com o email fornecido.

    //Faz a verificação se existe algum usuário com o email fornecido, caso sim retorna um erro ao usuário.
    if(verifyEmail.length !== 0){
        alert("Esse email já possui cadastro!")
        return;
    }

    //Passa os dados do usuário para a proxima página de cadastro.
    cadastroEmail({
        email: email,
        nome: nome
    });

    //Encaminha o usuário para a proxima pagina de cadastro.
    window.location.href = "cadastro-senha.html";
});

//Função que salva os dados do usuário no armazenamento do navegador.
function cadastroEmail(data){

    sessionStorage.setItem("cadastro", JSON.stringify(data));

}

//Faz a busca no banco de dados para verificar se existe um usuário com o email fornecido.
const getEmail = async (email) => {
    try {
        const apiResponse = await fetch('http://localhost:3000/cadastros?email=' + email);
        const response = await apiResponse.json();
        return (response);
    }
    catch (error) {
        console.log(error)
    }
}