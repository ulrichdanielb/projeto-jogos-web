
const tecla = document.getElementById("tecla");
const mensagem = document.getElementById("mensagem");
const iniciar = document.getElementById("iniciar");
const reiniciar = document.getElementById("reiniciar");
const resultado = document.getElementById("resultado");


const pares = [
    { p1: "w", p2: "↑", teclaReal2: "ArrowUp" },
    { p1: "a", p2: "←", teclaReal2: "ArrowLeft" },
    { p1: "s", p2: "↓", teclaReal2: "ArrowDown" },
    { p1: "d", p2: "→", teclaReal2: "ArrowRight" }
];

const teclasPlayer1 = ["w", "a", "s", "d"];
const teclasPlayer2 = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];

const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

const vidaPreenchimento1 = document.getElementById("vidaPreenchimento1");
const vidaPreenchimento2 = document.getElementById("vidaPreenchimento2");

const arena = document.getElementById("arena");


let teclaAtual1 = "";
let teclaAtual2 = "";

let jogoAtivo = false;
let jogoEncerrado = false;
let timerRodada = null;
let preparandoRodada = false;

let vida1 = 10;
let vida2 = 10;
let tempoInicio = 0;

function atualizarBarras()
{
    vidaPreenchimento1.style.height = (vida1 * 10) + "%";
    vidaPreenchimento2.style.height = (vida2 * 10) + "%";
}

function novaRodada()
{

    if (jogoEncerrado === true)
    {
        return;
    }

    preparandoRodada = true;
    jogoAtivo = false;
    tecla.innerText = "";
    resultado.innerText = "";
    mensagem.innerText = "Prepare-se...";

    const tempo = Math.random() * 3000 + 1000;

    if(timerRodada !== null)
    {
        clearTimeout(timerRodada);
    }

    timerRodada = setTimeout(function ()
    {
        if (jogoEncerrado === true)
        {
            return;
        }

        const sorteio = Math.floor(Math.random() * pares.length);

        teclaAtual1 = pares[sorteio].p1;
        teclaAtual2 = pares[sorteio].teclaReal2;

        tecla.innerText = teclaAtual1 + " | " + pares[sorteio].p2;
        tempoInicio = Date.now();
        mensagem.innerText = "Aperte a tecla correta!";

        preparandoRodada = false;
        jogoAtivo = true;
        timerRodada = null;

    }, tempo);
}

function mostrarEfeito(dano, tempoReacao)
{
    if (dano === 3)
    {
        resultado.innerText = "CRÍTICO! " + tempoReacao + "ms";
        arena.classList.add("tremor-forte");
    }
    else if (dano === 2)
    {
        resultado.innerText = "Bom golpe! " + tempoReacao + "ms";
        arena.classList.add("tremor-medio");
    }
    else
    {
        resultado.innerText = "Golpe fraco! " + tempoReacao + "ms";
        arena.classList.add("tremor-fraco");
    }

    setTimeout(function()
    {
        arena.classList.remove("tremor-forte");
        arena.classList.remove("tremor-medio");
        arena.classList.remove("tremor-fraco");
    }, 250);
    
}

reiniciar.addEventListener("click", function()
{


    player1.classList.remove("atacando");
    player2.classList.remove("atacando");

    player1.src = "imgs/macacoBase.png";
    player2.src = "imgs/macacoBase.png";

    vida1 = 10;
    vida2 = 10;
    atualizarBarras();

    jogoAtivo = false;
    jogoEncerrado = false;

    tecla.innerText = "";
    resultado.innerText = "";
    mensagem.innerText = "Clique para começar"; 

    novaRodada();
});


iniciar.addEventListener("click", function ()
{
    if (jogoAtivo === true || preparandoRodada == true || jogoEncerrado === true)
    {
        return;
    }

    novaRodada();
});

document.addEventListener("keydown", function(event)
{
    if (jogoEncerrado === true)
    {
        return;
    }

    if (jogoAtivo === false && teclasPlayer1.includes(event.key))
    {
        resultado.innerText = "Player 1 quebrou as regras!";
        setTimeout(novaRodada, 1000);
        return;
    }

    if (jogoAtivo === false && teclasPlayer2.includes(event.key))
    {
        resultado.innerText = "Player 2 quebrou as regras!";
        setTimeout(novaRodada, 1000);
        return;
    }

    if (event.key === teclaAtual1 && jogoAtivo === true)
    {
        jogoAtivo = false;

        const tempoReacao = Date.now() - tempoInicio;
        let dano = 1;

        if (tempoReacao < 350)
        {
            dano = 3;
        }
        else if (tempoReacao < 450)
        {
            dano = 2;
        }
        
        vida2 -= dano;
        atualizarBarras();
        mostrarEfeito(dano, tempoReacao);
        player1.src = "imgs/macacoGolpe.png";
        player2.src = "imgs/macacoDano.png";


        if (vida2 <= 0)
        {
            atualizarBarras();
            player1.classList.add("atacando");

            resultado.innerText = "PLAYER 1 VENCEU!";
            tecla.innerText = "";

            player1.src = "imgs/macacoVitorioso.png";
            player2.src = "imgs/macacoDerrotado.png";


            jogoEncerrado = true;
            return;
        }

        setTimeout(function()
        {
            player2.src = "imgs/macacoBase.png";
            player1.src = "imgs/macacoBase.png";
        }, 600);

        player1.classList.add("atacando");

        setTimeout(function()
        {
            player1.classList.remove("atacando");
        }, 400);

        setTimeout(novaRodada, 1000);
        return;
    }

    if (event.key === teclaAtual2 && jogoAtivo === true)
    {
        jogoAtivo = false;

        const tempoReacao = Date.now() - tempoInicio;
        let dano = 1;

        if (tempoReacao < 350)
        {
            dano = 3;
        }
        else if (tempoReacao < 450)
        {
            dano = 2;
        }
        
        vida1 -= dano;
        atualizarBarras();
        mostrarEfeito(dano, tempoReacao);

        player2.src = "imgs/macacoGolpe.png";
        player1.src = "imgs/macacoDano.png";



        if (vida1 <= 0)
        {
            atualizarBarras();
            player2.classList.add("atacando");

            resultado.innerText = "PLAYER 2 VENCEU!";
            tecla.innerText = "";

            player2.src = "imgs/macacoVitorioso.png";
            player1.src = "imgs/macacoDerrotado.png";

            jogoEncerrado = true;
            return;
        }

        setTimeout(function()
        {
            player2.src = "imgs/macacoBase.png";
            player1.src = "imgs/macacoBase.png";
        }, 600);

        player2.classList.add("atacando");

        setTimeout(function()
        {
            player2.classList.remove("atacando");
        }, 400);

        setTimeout(novaRodada, 1000);
        return;
    }

    if (teclasPlayer1.includes(event.key))
    {
        jogoAtivo = false;
        resultado.innerText = "Player 1 errou!";
        setTimeout(novaRodada, 1000);
        return;
    }

    if (teclasPlayer2.includes(event.key))
    {
        jogoAtivo = false;
        resultado.innerText = "Player 2 errou!";
        setTimeout(novaRodada, 1000);
        return;
    }
});