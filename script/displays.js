const formLogar = document.querySelector('#login')
const formCadastro = document.querySelector('#cadastro')
let users = JSON.parse(localStorage.getItem('usuarios')) || [];
let logado = JSON.parse(localStorage.getItem('logado')) || [];

const displayLogin = document.querySelector('.display-login')
const displaySystem = document.querySelector('.display-system')

const statusProfessor = document.querySelector("#relatorios-professores")
const statusAcademico = document.querySelector("#academico")
const statusMonitor = document.querySelector("#frequencia")
// console.log(users)



function displayAcesso() {
    displayLogin.style.display = 'none'
    displaySystem.style.display = 'block'
    atualizarUsers()
    spacoDeInformacao()
    // 
}

function displayLogout() {
    displayLogin.style.display = 'block'
    displaySystem.style.display = 'none'
    // 
}
function displayLogar() {
    formCadastro.style.display = 'none'
    formLogar.style.display = 'flex'
}

function displayCadastrar() {
    formLogar.style.display = 'none'
    formCadastro.style.display = 'flex'
}
function verificarStatus() {
    if (logado[0].status == "professor") {
        statusAcademico.style.display = 'none'
        displayAcesso()
    } else if (logado[0].status == "monitor") {
        statusAcademico.style.display = 'none'
        statusProfessor.style.display = 'none'
        displayAcesso()
    } else if (logado[0].status == "user") {
        alert('Olá, aguarde! o seu perfil está sendo avaliado!')
        statusAcademico.style.display = 'none'
        statusProfessor.style.display = 'none'
        statusMonitor.style.display = 'none'
        localStorage.removeItem('logado');
        spaceInf.style.display = 'none'
        displayLogout()
        location.reload();
    }
    else if (logado[0].status == "admin") {
        displayAcesso()
    } else {
        alert('Você não tem acesso a essa página!')
    }
}
//função para criptografar a senha

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

//função para cadastrar usuarios

//OBS -- O PRIMEIRO USUARIO VAI TER ACESSO ACADEMICO
formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuarioInput = document.querySelector('#cadUser');
    const senhaInput = document.querySelector('#cadSenha');
    const confSenhaInput = document.querySelector('#confCadSenha');

    if (usuarioInput.value === '' || senhaInput.value === "" || confSenhaInput.value === '') {
        alert('Preencha todos os campos');
    } else if (senhaInput.value !== confSenhaInput.value) {
        alert('As senhas não conferem');
    } else {

        const hashedPassword = await hashPassword(senhaInput.value)
        const novoUsuario = {
            usuario: usuarioInput.value,
            senha: hashedPassword,
            status: users.length === 0 ? 'admin' : 'user'
        };

        users.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(users));

        usuarioInput.value = '';
        senhaInput.value = '';
        confSenhaInput.value = '';
        alert('Cadastro realizado com sucesso!');
        displayLogar()
    }
});


//função para logar
formLogar.addEventListener('submit', async (e) => {
    e.preventDefault()
    const login = document.querySelector('#usuario')
    const senha = document.querySelector('#senha')
    const usuario = users.find(user => user.usuario === login.value)
    const hashedPassword = await hashPassword(senha.value)
    if (usuario.senha === hashedPassword) {
        alert('Login realizado com sucesso')
        const statusLOG = {
            usuario: usuario.usuario,
            status: usuario.status,
            log: 'logado'
        }
        logado.push(statusLOG)
        localStorage.setItem('logado', JSON.stringify(logado));
        verificarStatus()



    } else {
        verificarStatus()
    }


})

function spacoDeInformacao() {
    const spaceInf = document.querySelector('.infLogin')
    spaceInf.innerHTML = `<span>Seja bem vindo,  ${logado[0].usuario}</span> <span id='logout'>Sair</span>`
    const logoutButton = document.querySelector('#logout')
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.removeItem('logado');
            spaceInf.style.display = 'none'
            displayLogout()
            location.reload();
        })
    }
}

function logoutBTN(e) {
    e.preventDefault()
    localStorage.removeItem('logado');
    spaceInf.style.display = 'none'
    displayLogout()
    location.reload();
}
//função para tornar professor
function tornarProfessor(id) {
    users[id].status = 'professor'
    localStorage.setItem('usuarios', JSON.stringify(users));
    alert(`${users[id].usuario} agora é Professor`);
    atualizarUsers()
}
//função para tornar monitor
function tornarMonitor(id) {
    users[id].status = 'monitor'
    localStorage.setItem('usuarios', JSON.stringify(users));
    alert(`${users[id].usuario} agora é Monitor`);
    atualizarUsers()
}

function atualizarUsers() {
    let usuarios = document.querySelector('.usuarios')
    usuarios.innerHTML = ''
    users.forEach((lista, id) => {
        usuarios.innerHTML += `<div>
        <span>Usuarios: ${lista.usuario} </span> 
        <span>status: ${lista.status}</span> 
        <button class='tornarProfessor' data-id='${id}'>Professor</button>
        <button class='tornarMonitor' data-id='${id}'>Monitor</button></div>`
    });


    document.querySelectorAll('.tornarProfessor').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            tornarProfessor(id);
        });
    });
    document.querySelectorAll('.tornarMonitor').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            tornarMonitor(id);
        });
    });


}


document.addEventListener('DOMContentLoaded', () => {
    if (logado.length != 0) {
        displayAcesso()
        spacoDeInformacao()
    }
    atualizarUsers()
})