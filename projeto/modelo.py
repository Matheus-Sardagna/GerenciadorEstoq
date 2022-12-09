from config import *


class Equipamentos(db.Model):
    """Esta classe representa uma tabela do banco de dados,
    nela criamos as colunas junto com seus atributos e definimos funções
    para retornar os dados de acordo com nossas necissidades
    """

    #atributos
    id = db.Column(db.Integer, primary_key=True)  # Aqui é criado a coluna id do equipamento com o atributo primary_key
    nome = db.Column(db.String(254), nullable=False)  # Aqui é criado a coluna nome do equipamento com o atributo not null
    quantidade = db.Column(db.Integer, nullable=False)  # Aqui é criado a coluna quantidade  do equipamento com o atributo not null
    local = db.Column(db.String(254), nullable=False)  # Aqui é criado a coluna local do equipamento com o atributo not null
    observacao = db.Column(db.String(254))  # Aqui é criado a coluna observacao

    def __str__(self) -> str:
        """Esta função retorna os atributos do objeto criado em forma de string

        Returns:
            str: retorna o objeto em string
        """
        return f"Nome: {self.nome} | Quantidade: {self.quantidade} | Local: {self.local} | Observação: {self.observacao}"

    def json(self):
        """Esta função retorna os objetos em forma de dict para mais tarde ser usado
        em formato json

        Returns:
            dict: É retornado todos os atributos do objeto dentro de uma dict
        """
        return {
            "id": self.id,
            "nome": self.nome,
            "quantidade": self.quantidade,
            "local": self.local,
            "observacao": self.observacao,
        }


# teste de classe
if __name__ == "__main__":

    db.create_all()  # Aqui é criado a tabela Equipamentos

    e1 = Equipamentos(
        nome="Martelo",
        quantidade=20,
        local="Armario a10",
        observacao="3 estao quebrados",
    ) #Criando um objeto para ser inserido na tabela, somente para testes

    db.session.add(e1) #Inserindo definitivamente o equipamento na tabela
    db.session.commit() #Confirmando a operação, (salvando a adesão)

    print(e1) #Verificando os dados em str
    print(e1.json()) #Verificando os dados em json
