// Configuração do Scanner (Quagga)
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner"),
        constraints: { facingMode: "environment" } // Usa a câmera traseira
    },
    decoder: {
        readers: ["ean_reader"]
    }
}, (err) => {
    if (err) console.error(err);
    Quagga.start();
});

// Detectar código de barras
Quagga.onDetected(async (result) => {
    const codigo = result.codeResult.code;
    const produto = await buscarProduto(codigo);
    if (produto) {
        alert(`Produto: ${produto[1]} (${produto[2]})`);
        document.getElementById("unidade").value = produto[2];
    } else {
        alert("Produto não cadastrado!");
    }
});

// Buscar produto no Google Sheets
async function buscarProduto(codigo) {
    const API_URL = "https://script.google.com/macros/s/AKfycbzIFWJEYE7HSbHIptTwOIYEZmzvhkMY4NxaJkQoi5I/dev"; // Cole a URL aqui!
    const resposta = await fetch(`${API_URL}?action=buscarProduto&codigo=${codigo}`);
    return await resposta.json();
}

// Enviar registro para o Google Sheets
async function enviarRegistro() {
    const API_URL = "https://script.google.com/macros/s/AKfycbzIFWJEYE7HSbHIptTwOIYEZmzvhkMY4NxaJkQoi5I/dev"; // Cole a URL aqui!
    const data = {
        codigo: "123456", // Substitua pelo código escaneado
        quantidade: document.getElementById("quantidade").value,
        unidade: document.getElementById("unidade").value
    };

    await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data, tipo: "registro" })
    });

    alert("Registro salvo!");
}

// Cadastrar novo produto
async function cadastrarProduto() {
    const API_URL = "https://script.google.com/macros/s/AKfycbzIFWJEYE7HSbHIptTwOIYEZmzvhkMY4NxaJkQoi5I/dev"; // Cole a URL aqui!
    const data = {
        codigo: document.getElementById("codigo").value,
        nome: document.getElementById("nome").value,
        fator: document.getElementById("fator").value
    };

    await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data, tipo: "cadastro" })
    });

    alert("Produto cadastrado!");
}