export function selecaoPista(pistas, nomePista) {
    return pistas.find(pista => pista.nome === nomePista)
}

export function selecaoCorredor(corredores, nomeCorredor, nomeAliado, nomeInimigo){
    const corredor = corredores.find(corredor => corredor.nome === nomeCorredor)
    let aliado = corredores.find(corredor => corredor.nome === nomeAliado)
    let inimigo = corredores.find(corredor => corredor.nome === nomeInimigo)

    if (!aliado) {
        aliado = null
    }
    if (!inimigo) {
        inimigo = null
    }
    
    return {
        "id": corredor.id,
        "nome": corredor.nome,
        "velocidade": corredor.velocidade,
        "drift": corredor.drift,
        "aceleracao": corredor.aceleracao,
        "vantagem": corredor.vantagem,
        "aliado": aliado ? {"id": aliado.id, "nome": aliado.nome} : {"id": null, "nome": null},
        "inimigo": inimigo ? {"id": inimigo.id, "nome": inimigo.nome} : {"id": null, "nome": null},
        "posicao": 0,
        "buffs":0,
        "buffPosicao":0,
        "debuffs":0,
        "vantagemAplicada": false,
        "desvantagemAplicada": false,
        "buffAliado":false,
        "desbuffInimigo":false
    }
}

export function realizarCorrida(pista,corredores) {
    let primeiroLugar = null
    for (let i = 1; i <= pista.tamanho; i++) {
        if(primeiroLugar) break;
        corredores.forEach(corredor => {
            if(primeiroLugar) return
            let atributo
            

            if(i <= 3){
                atributo = corredor.aceleracao
            }
            else if(i % 4 == 0){
                atributo = corredor.drift
            }
            else{
                atributo = corredor.velocidade
            }

            if (!corredor.vantagemAplicada && corredor.vantagem == pista.tipo) {
                atributo += 2
                corredor.buffs += 2
                corredor.vantagemAplicada = true
            }

            if (!corredor.desvantagemAplicada) {
                atributo += pista.debuff
                corredor.debuffs += pista.debuff
                corredor.desvantagemAplicada = true
            }

            if (corredor.posicao < 0) {
                corredor.posicao = 0;
            }
            

            if (corredor.nome === "Dick Vigarista" && corredor.posicao >= pista.tamanho - 1) {
                corredor.posicao = pista.tamanho - 1
                return
            }

            corredores.forEach(cAI => {
                if (cAI.id == corredor.aliado.id) {
                    let distancia = Math.abs(cAI.posicao - corredor.posicao)
                    if(distancia <= 2 && !corredor.buffAliado){
                        atributo+=1
                        corredor.buffAliado = true
                        corredor.buffs+=1
                    }else if(distancia > 2 && corredor.buffAliado){
                        atributo-=1
                        corredor.buffAliado = false
                    }
                }


                if (cAI.id == corredor.inimigo.id) {
                    let distancia = Math.abs(cAI.posicao - corredor.posicao)
                    if(distancia <= 2 && !corredor.desbuffInimigo){
                        atributo-=1
                        corredor.desbuffInimigo = true
                        corredor.debuffs -= 1
                    }else if(distancia > 2 && corredor.desbuffInimigo){
                        atributo-=1
                        corredor.desbuffInimigo = false
                    }
                }
            })

            if (pista.posicoesBuffs.includes(i)){
                corredores.sort((a, b) => b.posicao - a.posicao); 
                corredores.forEach((c, index) => {
                    if (index !== 0 && c.id === corredor.id) {
                        atributo+=index
                        corredor.buffPosicao+=index
                    }
                });
            }

            if (atributo > 0) {
                corredor.posicao += atributo
            }

            if(corredor.posicao >= pista.tamanho){
                corredor.posicao = pista.tamanho
                primeiroLugar = corredor
            }

            const vencedor = corredores.find(corredor => corredor.posicao >= pista.tamanho)
            if (vencedor) return vencedor
            
            
        });
    }

    corredores.sort((a, b) => 
        b.posicao - a.posicao
    )

    return {"vencedor": corredores[0]}
    

}