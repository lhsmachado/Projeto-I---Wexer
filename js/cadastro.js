document.getElementById("form-cadastro").addEventListener("submit", function(e) {
    e.preventDefault()

    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    if(email.length < 5){
        alert("Preencha o campo com um email válido.");
        return;
    }
    cadastroEmail({
        email: email,
        nome: nome
    });

    window.location.href = "cadastro-senha.html";
});

function cadastroEmail(data){

    sessionStorage.setItem("cadastro", JSON.stringify(data));

}