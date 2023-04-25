


document.getElementById("form-login").addEventListener("submit", async function(e) {
    e.preventDefault();

const email = document.getElementById("email-input").value;
const password = document.getElementById("password-input").value;
console.log(email)
console.log(password)

const user = await getemail();

console.log(user)

const veremail = await user.filter(user => (user.email === email))
console.log(veremail)

const verificaemail = veremail[0].email;
const verificasenha = veremail[0].password;
const id = veremail[0].id


if(verificaemail === email){
    if(verificasenha === password){
        const userserializado = JSON.stringify(id)
        sessionStorage.setItem("logged", userserializado);
        window.location.href = "home.html"
    }
}

})

const getemail = async () =>{
    try{
    const apiResponse = await fetch ('http://localhost:3000/cadastros');
    const verifica = await apiResponse.json();
    return(verifica);}
    catch (error){
        console.log(error)
    }}

