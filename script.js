const url = "http://localhost:3000/jogos";

let jogos = [];
let jogoEditando = null;

const lista = document.getElementById("listaJogos");
const form = document.getElementById("formJogo");

function buscarJogos() {
    fetch(url)
        .then(response => response.json())
        .then(dados => {
            jogos = dados;

            document.getElementById("totalJogos").textContent = jogos.length;

            document.getElementById("totalJogando").textContent =
                jogos.filter(jogo => jogo.status == "Jogando").length;

            document.getElementById("totalFinalizados").textContent =
                jogos.filter(jogo => jogo.status == "Finalizado").length;

            mostrarJogos();
        });
}

function mostrarJogos() {
    lista.innerHTML = "";

    const pesquisa = document.getElementById("pesquisa").value.toLowerCase();
    const filtro = document.getElementById("filtroStatus").value;

    jogos.forEach(jogo => {

        if (
            !jogo.titulo.toLowerCase().includes(pesquisa) ||
            (filtro != "Todos" && jogo.status != filtro)
        ) {
            return;
        }

        const card = document.createElement("div");
        card.classList.add("card");

        let classeStatus = "";

        if (jogo.status == "Jogando") {
            classeStatus = "jogando";
        } else if (jogo.status == "Quero jogar") {
            classeStatus = "quero-jogar";
        } else if (jogo.status == "Finalizado") {
            classeStatus = "finalizado";
        } else if (jogo.status == "Abandonado") {
            classeStatus = "abandonado";
        }

        card.innerHTML = `
            <h3>${jogo.titulo}</h3>
            <p>${jogo.genero} - ${jogo.plataforma}</p>
            <p>Nota ${jogo.nota}</p>
            <span class="status ${classeStatus}">
                ${jogo.status}
            </span>
        `;

        const editar = document.createElement("button");

        editar.textContent = "EDITAR";
        editar.classList.add("editar");

        editar.onclick = function () {
            abrirEdicao(jogo);
        };

        const excluir = document.createElement("button");

        excluir.textContent = "EXCLUIR";
        excluir.classList.add("excluir");

        excluir.onclick = function () {
            excluirJogo(jogo.id);
        };

        const acoes = document.createElement("div");

        acoes.classList.add("acoes");

        acoes.appendChild(editar);
        acoes.appendChild(excluir);

        card.appendChild(acoes);

        lista.appendChild(card);
    });
}

function abrirEdicao(jogo) {
    jogoEditando = jogo.id;

    document.getElementById("editarTitulo").value = jogo.titulo;
    document.getElementById("editarGenero").value = jogo.genero;
    document.getElementById("editarPlataforma").value = jogo.plataforma;
    document.getElementById("editarNota").value = jogo.nota;
    document.getElementById("editarStatus").value = jogo.status;

    document.getElementById("modalEditar").style.display = "flex";
}

document.getElementById("formEditar").addEventListener("submit", function (event) {
    event.preventDefault();

    const jogo = {
        titulo: document.getElementById("editarTitulo").value,
        genero: document.getElementById("editarGenero").value,
        plataforma: document.getElementById("editarPlataforma").value,
        nota: Number(document.getElementById("editarNota").value),
        status: document.getElementById("editarStatus").value
    };

    fetch(url + "/" + jogoEditando, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jogo)
    })
        .then(response => response.json())
        .then(() => {

            document.getElementById("modalEditar").style.display = "none";

            jogoEditando = null;

            Swal.fire({
                title: "Sucesso!",
                text: "Alterações salvas com sucesso.",
                icon: "success",
                confirmButtonText: "OK"
            });

            buscarJogos();
        });
});

function fecharModal() {
    document.getElementById("modalEditar").style.display = "none";
    jogoEditando = null;
}

document.getElementById("fecharModal").addEventListener("click", fecharModal);

document.getElementById("cancelarEdicao").addEventListener("click", fecharModal);

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const jogo = {
        titulo: document.getElementById("titulo").value,
        genero: document.getElementById("genero").value,
        plataforma: document.getElementById("plataforma").value,
        nota: Number(document.getElementById("nota").value),
        status: document.getElementById("status").value
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jogo)
    })
        .then(response => response.json())
        .then(() => {

            Swal.fire({
                title: "Novo jogo cadastrado!",
                text: "O jogo foi salvo com sucesso.",
                icon: "success",
                confirmButtonText: "OK"
            });

            form.reset();

            buscarJogos();
        });
});

function excluirJogo(id) {

    Swal.fire({
        title: "Você realmente deseja excluir este jogo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#7657c9",
        cancelButtonColor: "#aaa6b8",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
    }).then(result => {

        if (result.isConfirmed) {

            fetch(url + "/" + id, {
                method: "DELETE"
            })
                .then(() => {

                    Swal.fire({
                        title: "Excluído!",
                        text: "O jogo foi excluído com sucesso.",
                        icon: "success"
                    });

                    buscarJogos();
                });
        }
    });
}

document.getElementById("pesquisa").addEventListener("input", mostrarJogos);

document.getElementById("filtroStatus").addEventListener("change", mostrarJogos);

document.getElementById("botaoCancelar").addEventListener("click", function () {
    form.reset();
});

buscarJogos();