const emailserial = sessionStorage.getItem('cadastro')
const email = JSON.parse(emailserial)
sessionStorage.removeItem('cadastro')

document.getElementById('form-cadastro').addEventListener('submit', async function(e){
    e.preventDefault();

    const senha = document.getElementById("cadastro-senha").value;
    const verificasenha = document.getElementById("cadastro-senha-repeat").value;   

    if(senha != verificasenha){
        alert("As senhas não coincidem.")
        return;
    }
    else{
        user=({
           nome: email.nome,
           email: email.email,
           senha: senha,
           pacientes: []
        });
        await salvaUsuario(user)
        window.location.href = "index.html";
    }
})

async function salvaUsuario(user){
     await fetch(`http://localhost:3000/cadastros`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
}


