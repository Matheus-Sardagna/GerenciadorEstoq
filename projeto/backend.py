from config import *
from modelo import Equipamentos


@app.route("/listar", methods = ["GET"]) #definir a rota listar para listagem de equipamentos
def listar():
    """Esta função retorna os equipamentos do banco em json, ela é chamada sempre
    que o servidor chamar a rota /listar

    Returns:
        json/dict: Dados gravados na tabela Equipamentos convertidos em json
    """
    equipamentos_em_json = [] #Criando uma lista para guardar os dados em formato json
    equipamentos = db.session.query(Equipamentos).all() #Pegando os dados da tabela do banco de dados
    for x in equipamentos:
        equipamentos_em_json.append(x.json()) #Para cada dado na tabela, transforma-los em json e inseri-los na lista
    resposta = jsonify(equipamentos_em_json) #Jsonificar os dados da lista
    resposta.headers.add("Acess-Control-Allow-Origin", "*") #Dar acesso para os dados
    return resposta


@app.route("/inserir", methods = ["POST"]) #Definindo a rota inserir para inserir dados
def inserir():
    """Esta função adiciona um equipamento com os dados informados no front-end

    Returns:
        json/dict: Resposta que o servidor gerou
    """
    resposta = jsonify({"resposta": "ok", "detalhes":"ok"}) #Preparando uma resposta para o site
    dados = request.get_json() #pegando os dados enviados
    if not dados["nome"] or not dados["local"] or not dados["quantidade"]: #se algum campo estiver vazio retornará erro
        resposta = jsonify({"resposta":"erro no backend", "detalhes":"campo vazio detectado"})
        return resposta
    try:
        equip = Equipamentos(**dados) #criando o objeto para joga-lo no banco de dados
        db.session.add(equip) #adicionando o objeto ao banco
        db.session.commit() #confirmando a operação
    except Exception as e: #caso dê erro:
        resposta = jsonify({"resposta":"erro no backend", "detalhes":str(e)}) #Definir uma resposta negativa para o front
    resposta.headers.add("Acess-Control-Allow-Origin", "*") #Dar acesso aos dados
    return resposta #retornar a resposta


@app.route("/remover", methods = ["DELETE"]) #Definindo a rota para remover dados do banco
def remover():
    """Esta função tem a finalidade de remover equipamentos do banco de dados usando
    o nome do equipamento como chave

    Returns:
        json/dict: resposta para o front-end
    """
    resposta = jsonify({"resposta": "ok", "detalhes":"ok"}) #Preparando uma resposta para o site
    dados = request.get_json() #pegando os dados enviados
    try:
        Equipamentos.query.filter_by(nome=dados["nome"]).delete() #Removendo o equipamento do banco pelo seu nome
        db.session.commit() #Confirmando a operação
    except Exception as e:
        resposta = jsonify({"resposta":"erro no backend", "detalhes":str(e)}) #Definir uma resposta negativa para o front
    resposta.headers.add("Acess-Control-Allow-Origin", "*") #Dar acesso aos dados
    return resposta  #retornando a resposta para o front


@app.route("/editar", methods=["POST"]) #criando a rota para editar os dados da tabela
def editar():
    """Esta função é responsável por editar as informações do banco de dados

    Returns:
        json/dict: resposta para o front-end
    """
    Equipamentos.query.filter_by(nome="Martelo").update({
        "nome":"teste",
        "quantidade":"sapo",
        "local":"batata",
        "observacao":"cleber"
    })
    db.session.commit()
    resposta = jsonify({"resposta": "ok", "detalhes":"ok"}) #Preparando uma resposta para o site
    dados = request.get_json() #pegando os dados enviados
    try:
        Equipamentos.query.filter_by(nome=dados["nome_antigo"]).update({
            "nome":dados["nome"],
            "quantidade":dados["quantidade"],
            "local":dados["local"],
            "observacao":dados["observacao"]
            })
        db.session.commit() #Confirmando a operação
    except Exception as e:
        resposta = jsonify({"resposta":"erro no backend", "detalhes":str(e)}) #Definir uma resposta negativa para o front
    resposta.headers.add("Acess-Control-Allow-Origin", "*") #Dar acesso aos dados
    return resposta  #retornando a resposta para o front


app.run(debug = True) #aqui ligamos o servidor