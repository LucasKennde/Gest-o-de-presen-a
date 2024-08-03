document.addEventListener('DOMContentLoaded', () => {
    const formCadastroTurma = document.querySelector("#formCadastroTurma")
    const formCadastroAluno = document.querySelector("#formCadastroAluno")
    


    const datalistTurma = document.querySelector("#turmas")
    let turmas = JSON.parse(localStorage.getItem('turma')) || [];
    let alunos = JSON.parse(localStorage.getItem('alunos')) || [];

    let listaAlunos = document.querySelector(".listaAlunos")
    const faltasAlunos = document.querySelector('#faltasAlunos')
    const presencaAlunos = document.querySelector("#presenca-alunos")

    
    

    let faltasChart = null;
    let presencaChart = null;


    //função para cadastrar turma
    formCadastroTurma.addEventListener('submit', (e) => {
        e.preventDefault();

        const turma = document.querySelector('#inputTurma');
        if(turma.value ===''){
            alert('Preencha o campo turma')
            return
        }    
        turmas.push(turma.value);
        localStorage.setItem('turma', JSON.stringify(turmas));
        turma.value = '';
        atualizarDashboard()
    })


    //função para cadastrar aluno
    formCadastroAluno.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.querySelector('#inputAluno');
        const listTurma = document.querySelector('#listTurma');
        if(listTurma.value === ''){
            alert('Selecione uma turma para o aluno')
        }else{
            alunos.push({ nome: nome.value, turma: listTurma.value, presenca: [] });
            localStorage.setItem('alunos', JSON.stringify(alunos));
            nome.value = '';
            listTurma.value = '';
            atualizarDashboard()
        }
        
    })

    //função para marcar presenca
    function marcarPresenca(id) {
        alunos[id].presenca.push({ data: new Date().toLocaleString(), status: 'presente' });
        localStorage.setItem('alunos', JSON.stringify(alunos));
        alert(`Presença marcada para ${alunos[id].nome}`);
        atualizarDashboard()
    }
    //função para marcar falta
    function marcarFalta(id) {
        alunos[id].presenca.push({ data: new Date().toLocaleString(), status: 'Faltou' });
        localStorage.setItem('alunos', JSON.stringify(alunos));
        alert(`Ahh' que pena o ${alunos[id].nome} Faltou`);
        atualizarDashboard()
    }


    function atualizarDashboard() {
        datalistTurma.innerHTML = '';
        listaAlunos.innerHTML = '';
        faltasAlunos.innerHTML = '';
        turmas.forEach(lista => {
            datalistTurma.innerHTML += `<option value='${lista}'></option>`
        });

        const GraficoAlunos = []; 
        const faltas = []; 
        const presenca = [];
        alunos.forEach((lista, id) => {
            listaAlunos.innerHTML += `<div class='aluno'>
        <div class='nome idAluno'>Aluno: ${lista.nome}</div> 
        <div class='turma'>Turma: ${lista.turma}</div>
        <button class='marcarPresenca' data-id='${id}'>Presente</button>
        <button class='marcarFalta' data-id='${id}'>Faltou</button>
        </div> `;

            const totalFaltas = lista.presenca.filter(presenca => presenca.status === 'Faltou').length;
            const totalPresenca = lista.presenca.filter(presenca => presenca.status === 'presente').length;
            GraficoAlunos.push(lista.nome);
            faltas.push(totalFaltas);
            presenca.push(totalPresenca)
        });


        
        if (faltasChart) faltasChart.destroy();
        if (presencaChart) presencaChart.destroy();

        // Criar novos gráficos
        faltasChart = new Chart(faltasAlunos, {
            type: 'doughnut',
            data: {
                labels: GraficoAlunos,
                datasets: [{
                    label: 'Número de faltas',
                    data: faltas,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        presencaChart = new Chart(presencaAlunos, {
            type: 'line',
            data: {
                labels: GraficoAlunos,
                datasets: [{
                    label: 'Número de Presenças',
                    data: presenca,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        document.querySelectorAll('.marcarPresenca').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                marcarPresenca(id);
            });
        });
        document.querySelectorAll('.marcarFalta').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                marcarFalta(id);
            });
        });





    }



    atualizarDashboard();





});

