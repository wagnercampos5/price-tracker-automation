const API_URL = "http://127.0.0.1:8000";
const listaProdutos = document.getElementById("listaProdutos");
const alertasBox = document.getElementById("alertas");

async function carregarProdutos() {
    const resposta = await fetch(`${API_URL}/produtos`)
    const produtos = await resposta.json();
    listaProdutos.innerHTML = "";
    produtos.forEach(produto => {
        const li = document.createElement("li");
        li.className = "product-item";
        let html = '<span><strong>' + produto.termo + '</strong><br>';
        html += '<small>Alvo: R$ ' + produto.preco_alvo.toFixed(2) + ' | Atual: R$ ' + produto.preco_atual.toFixed(2) + '</small></span>';
        html += '<button class="btn-delete" onclick="removerProduto(' + produto.id + ')">Remover</button>';
        li.innerHTML = html;
        listaProdutos.appendChild(li);
    } )
}

document.getElementById("btnAdicionar").addEventListener("click", async () => {
    const termo = document.getElementById("termo").value;
    const precoAlvo = parseFloat(document.getElementById("precoAlvo").value);
    if (!termo || isNaN(precoAlvo)) return alert("Preencha todos os campos!");
    await fetch(API_URL + "/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termo: termo, preco_alvo: precoAlvo })
    })
    document.getElementById("termo").value = "";
    document.getElementById("precoAlvo").value = "";
    carregarProdutos();
})

document.getElementById("btnRastrear").addEventListener("click", async () => {
    const resposta = await fetch(API_URL + "/rastrear", { method: "POST" });
    const dados = await resposta.json();
    alertasBox.innerHTML = "";
    dados.alertas.forEach(msg => {
        alertasBox.innerHTML += '<div class="alerta-item">' + msg + '</div>';
    })
    carregarProdutos();
})

async function removerProduto(id) {
    await fetch(API_URL + "/produtos/" + id, { method: "DELETE" });
}

carregarProdutos()