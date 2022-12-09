$(function() {
    
    nome_antigo = "";
    permicao = 0;

    //função ajax do jquery vai "ativar" a rota listar e vai pegar os dados
    $.ajax(
        {
            url: "http://localhost:5000/listar",
            type: "GET",
            success: retorno_positivo,
            error: retorno_negativo
        }
    );

    function retorno_positivo(retorno){
        for (var i in retorno){
            lin = '<tr id="tr-line-'+i+'">'+
            '<td id="td-nome-'+i+'">' + retorno[i].nome + '</td>'+
            '<td id="td-quantidade-'+i+'">' + retorno[i].quantidade + '</td>'+
            '<td id="td-local-'+i+'">' + retorno[i].local + '</td>'+
            '<td id="td-observacao-'+i+'">' + retorno[i].observacao + '</td>'+
            '<td id="td-editar-'+i+'"><button id="bt-editar-'+i+'" type="submit" onclick=botao_editar(this.id)>Editar</button></td>'+
            '<td id="td-remover-'+i+'"><button id="bt-remover-'+i+'" type="submit" onclick=botao_remover(this.id)>Remover</button></td>'+
            '</tr>'; //Cria o codigo em forma html com os dados para inserir no body da tabela do html
            $('#tb-equipamentos').append(lin); //insere os dados na tabela
        }
        lin2 ='<td id="td-input-nome"><input class="input-enviar" type="text" id="input-nome"></td>'+
        '<td id="td-input-quantidade"><input class="input-enviar" type="number" id="input-quantidade"></td>'+
        '<td id="td-input-local"><input class="input-enviar" type="text" id="input-local"></td>'+
        '<td id="td-input-observacao"><input class="input-enviar" type="text" id="input-observacao"></td>'+
        '<td><button class="botao-tabela" type="submit" id="bt-enviar">Enviar</button></td>'+
        '<td></td>'+
        '</tr>';
        $('#tb-equipamentos').append(lin2);
    }

    function retorno_negativo(){
        alert("Ocorreu algum problema ao contactar com o backend :(");
    }

    $(document).on("click", "#bt-enviar", function() { //quando o botao enviar for clicado, chamará esta função

        //pegar os dados dos campos e seus valores
        nome = $("#input-nome").val();
        quantidade = $("#input-quantidade").val();
        local = $("#input-local").val();
        observacao = $("#input-observacao").val();
    
        //transformar os dados em json
        var dados = JSON.stringify({
            nome:nome,
            local:local,
            quantidade:quantidade,
            observacao:observacao
        });
        
        //chamar a função ajax para enviar os dados
        $.ajax(
            {
                url: "http://localhost:5000/inserir",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: dados,
                success: incluir,
                error: retornar_erro
            }
        );
    
        function incluir (retorno) {
            if (retorno.resposta == "erro no backend"){
                alert(retorno.resposta + ", " + retorno.detalhes)
            }else{
                location.reload();
            }       
        }
    
        function retornar_erro (retorno) {
            alert("erro no back: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });

    $(document).on("click", "#bt-buscar", function() {
        nome = $("#campo_pesquisa").val();

        $.ajax(
            {
                url: "http://localhost:5000/listar",
                type: "GET",
                success: buscar,
                error: function(erro){
                    console.log(erro);
                }
            }
        );

        function buscar(dados){
            var cont = 0;
            for (var i in dados){
                if (nome == dados[i].nome){
                    $('#tb-equipamentos').html('');
                    lin = '<tr class="linhas_tabela">' +
                        '<td id="td-nome-0">' + dados[i].nome + '</td>' +
                        '<td id="td-local-0">' + dados[i].local + '</td>' +
                        '<td id="td-qntd-0">' + dados[i].quantidade + '</td>' +
                        '<td id="td-obs-0">' + dados[i].observacao + '</td>' +
                        '<td><button type="submit" id="bt-editar-0" onclick="botao_editar(this.id)">Editar</button></td>'+
                        '<td><button type="submit" id="bt-remover-0" onclick="botao_remover(this.id)">Remover</button></td>'+
                        '</tr>';
                    lin2 = '<td class="linhas_tabela>"' +
                        '<td id="tr-input-nome"><input class="input-enviar" type="text" id="input-nome">'+
                        '<td id="tr-input-local"><input class="input-enviar" type="text" id="input-local">'+
                        '<td id="tr-input-quantidade"><input class="input-enviar" type="text" id="input-quantidade">'+
                        '<td id="tr-input-observacao"><input class="input-enviar" type="text" id="input-observacao">'+
                        '<td><button class="botao-tabela" type="submit" id="bt-enviar">Enviar</button></td>'+
                        '<td></td>'+
                        '</tr>';
                    $('#tb-equipamentos').append(lin);
                    $('#tb-equipamentos').append(lin2);
                    cont += 1;
                    break
                }
            }
            if (cont == 0){
                alert('O equipamento: "'+nome+'" não foi encontrado!')
            }
        }
    });

    $(document).on("click", "#bt-update-enviar", function() {
        nome = $("#input-editar-nome").val();
        local = $("#input-editar-local").val();
        quantidade = $("#input-editar-qntd").val();
        observacao = $("#input-editar-obs").val();

        var dados = JSON.stringify({
            nome:nome,
            local:local,
            quantidade:quantidade,
            observacao:observacao,
            nome_antigo:nome_antigo
        });
            
        $.ajax(
            {
                url: "http://localhost:5000/editar",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: dados,
                success: atualizar,
                error: retornar_erro
            }
        );

        function atualizar (retorno) {
            location.reload();         
        }

        function retornar_erro (retorno) {
            alert("erro no back: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });

});

function botao_editar(id_botao){
    bt_id = id_botao.split("-");
    if (permicao == 0){
        nome_antigo = document.querySelector("#td-nome-"+bt_id[2]).innerHTML;
        quantidade_antiga = document.querySelector("#td-quantidade-"+bt_id[2]).innerHTML;
        local_antigo = document.querySelector("#td-local-"+bt_id[2]).innerHTML;
        observacao_antiga = document.querySelector("#td-observacao-"+bt_id[2]).innerHTML;

        document.getElementById("td-nome-"+bt_id[2]).innerHTML = '<td><input class="input-enviar type="text" id="input-editar-nome" value="'+nome_antigo+'"></td>';
        document.getElementById("td-local-"+bt_id[2]).innerHTML = '<td><input class="input-enviar type="text" id="input-editar-local" value="'+local_antigo+'"></td>';
        document.getElementById("td-quantidade-"+bt_id[2]).innerHTML = '<td><input class="input-enviar type="number" id="input-editar-qntd" value="'+quantidade_antiga+'"></td>';
        document.getElementById("td-observacao-"+bt_id[2]).innerHTML = '<td><input class="input-enviar type="text" id="input-editar-obs" value="'+observacao_antiga+'"></td>';
        document.getElementById("td-remover-"+bt_id[2]).innerHTML = '<td><button type="submit" id="bt-update-enviar">Enviar</button></td>';
        permicao = 1;
    }
}

function botao_remover(id_botao){
    bt_id = id_botao.split("-");
    nome = document.querySelector("#td-nome-"+bt_id[2]).innerHTML;
    var dado = JSON.stringify({
        nome:nome
    });

    $.ajax(
        {
            url: "http://localhost:5000/remover",
            type: "DELETE",
            dataType: "json",
            contentType: "application/json",
            data: dado,
            success: remover,
            error: retornar_erro
        }
    );
    
    function remover () {
        location.reload();       
    }

    function retornar_erro (retorno) {
        alert("erro no back: "+retorno.resultado + ":" + retorno.detalhes);
    }

}