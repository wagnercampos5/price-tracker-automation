from fastapi import FastAPI
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
class ProdutoCreate(BaseModel):
    termo: str
    preco_alvo: float


produtos_monitorados = [
    {"id": 1, "termo": "Whey Protein Isolado", "preco_alvo": 150.00, "preco_atual": 145.00},
    {"id": 2, "termo": "Creatina Monohidratada 300g", "preco_alvo": 80.00, "preco_atual": 89.90}
]

@app.get("/produtos")
def listar_produtos():
    return produtos_monitorados

@app.post("/produtos")
def adicionar_produto(produto: ProdutoCreate):
    novo_id = len(produtos_monitorados) + 1
    novo_item = {"id": novo_id, "termo": produto.termo, "preco_alvo": produto.preco_alvo, "preco_atual": 0.0}
    produtos_monitorados.append(novo_item)
    return novo_item

@app.post("/rastrear")
def executar_rastreamento():
    alertas = []
    for item in produtos_monitorados:
        novo_preco = round(item["preco_alvo"] * random.uniform(0.80, 1.15), 2)
        item["preco_atual"] = novo_preco
        if novo_preco <= item["preco_alvo"]:
            alertas.append(f"Oportunidade! {item['termo']} baixou para R$ {novo_preco}")
    return {"mensagem": "Rastreamento concluído", "alertas": alertas, "produtos": produtos_monitorados}

@app.delete("/produtos/{produto_id}")
def remover_produto(produto_id: int):
    global produtos_monitorados
    produtos_monitorados = [item for item in produtos_monitorados if item["id"] != produto_id]
    return {"mensagem": "Produto removido com sucesso"}