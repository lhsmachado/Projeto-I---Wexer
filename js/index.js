//Função que recebe os dados fornecidos pelo usuario e os compara com os do banco de dados.
document.getElementById("form-login").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email-input").value; //Leitura do email digitado
    const password = document.getElementById("password-input").value; //Leitura da senha digitada

    const user = await getemail(email); //Busca no banco de dados se o email fornecido existe no banco de dados.

    //Verifica se foi retornado algum usuario, caso a variavel esteja vazia, retorna um erro ao usuario.
    if(user.length === 0){
        alert("Email ou senha inválidos.")
        return;
    }

    //Verifica se a senha confere com a armazenada, caso elas não estejam iguais retorna um erro ao usuário.
    if(user[0].password !== password){
        alert("Email ou senha inválidos.")
        return;
    }

    //Após passar nas verificações de segurança, salva o ID do usuário no armazenamento do navegador e passa para a proxima página.
    const id = user[0].id 
    const idSerial = JSON.stringify(id)
    sessionStorage.setItem("logged", idSerial);
    window.location.href = "home.html"
})

//Faz a busca no banco de dados para verificar se existe um usuário com o email fornecido.
const getemail = async (email) => {
    try {
        const apiResponse = await fetch('http://localhost:3000/cadastros?email=' + email);
        const response = await apiResponse.json();
        return (response);
    }
    catch (error) {
        console.log(error)
    }
}

