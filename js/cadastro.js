document.getElementById("form-cadastro").addEventListener("submit", function(e) {
    e.preventDefault()

    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    if(email.length < 5){
        alert("Preencha o campo com um email válido.");
        return;
    }
    saveAccount({
        email: email,
        nome: nome
    });

    window.location.href = "cadastro-senha.html";
});

function saveAccount(data){
    localStorage.setItem(data.login, JSON.stringify(data));

}