import axios from 'axios'

import {
  selecaoPista,
  selecaoCorredor,
  realizarCorrida,
} from '../src/metodos'

let responsePista
let responseCorredor

beforeAll(async () => {
  responsePista = (await axios.get("https://gustavobuttenbender.github.io/gus.github/corrida-maluca/pistas.json")).data
  responseCorredor = (await axios.get("https://gustavobuttenbender.github.io/gus.github/corrida-maluca/personagens.json")).data
})


describe('Testes corrida maluca', () => {
  it('Deve conseguir obter a pista corretamente', () => {

    const pista = selecaoPista(responsePista, "Deserto do Saara")
    expect(pista.nome).toBe("Deserto do Saara")

  })

  it('Deve conseguir obter o corredor corretamente', () => {

    const dick = selecaoCorredor(responseCorredor, "Dick Vigarista","Irmãos Rocha","Professor Aéreo")
    expect(dick.nome).toBe("Dick Vigarista")


  })

  it('Deve conseguir calcular a vantagem de tipo pista corretamente', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const quadrilha = selecaoCorredor(responseCorredor,"Quadrilha da Morte",null,null)
    const corredores = [quadrilha]
    const corrida = realizarCorrida(pista, corredores)
    
    //buff de +2 da do tipo da pista
    expect(quadrilha.buffs).toBe(2)

  })

  it('Deve conseguir calcular o debuff de pista corretamente', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", null, null)
    const corredores = [tomas]
    const corrida = realizarCorrida(pista, corredores)
    
    //debuff de -2 da pista
    expect(tomas.debuffs).toBe(-2)
  })

  it('Deve conseguir calcular o buff de posição de pista para 3 corredores', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", null, null)
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa", null, null)
    const sargento = selecaoCorredor(responseCorredor,"Sargento Bombarda", null, null)
    const corredores = [tomas,penelope,sargento]
    const corrida = realizarCorrida(pista, corredores)
    
  
    expect(tomas.buffPosicao).toBe(0)

    //buff de segundo lugar uma vez
    expect(penelope.buffPosicao).toBe(1)

    //buff de terceiro lugar uma vez
    expect(sargento.buffPosicao).toBe(2)

  })

  it('Deve conseguir calcular a próxima posição corretamente se estiver sob o buff de um aliado', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", "Penélope Charmosa", null)
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa", null, null)
    const corredores = [tomas,penelope]
    const corrida = realizarCorrida(pista, corredores)
    
    //recebeu buff uma vez
    expect(tomas.buffs).toBe(1)
    
  })

  it('Deve conseguir calcular a próxima posição corretamente se estiver sob o debuff de um inimigo', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", null, "Penélope Charmosa")
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa", null, null)
    const corredores = [tomas,penelope]
    const corrida = realizarCorrida(pista, corredores)
    
    //recebeu desbuff uma vez de inimigo (-1) e desbuff de pista(-2) = (-3)
    expect(tomas.debuffs).toBe(-3)
    
  })

  it('Deve conseguir completar uma corrida com um vencedor', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", null, "Penélope Charmosa")
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa", null, null)
    const corredores = [tomas,penelope]
    const corrida = realizarCorrida(pista, corredores)
    
    expect(corrida.vencedor).toEqual(tomas)
   
  })

  it('Deve conseguir criar corredor corretamente somente com aliado', () => {
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", "Penélope Charmosa", null)
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa","Tio Tomás", null)
   
    expect(tomas.aliado).toEqual({"id":penelope.id,"nome":penelope.nome})
   
  })

  it('Deve conseguir criar corredor corretamente somente com inimigo', () => {
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", null , "Penélope Charmosa")
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa","Tio Tomás", null)
   
    expect(tomas.inimigo).toEqual({"id":penelope.id,"nome":penelope.nome})
   
  })

  it('Deve conseguir criar corredor corretamente com aliado e inimigo', () => {
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", "Rufus Lenhador", "Penélope Charmosa")
    const rufus = selecaoCorredor(responseCorredor,"Rufus Lenhador", null , null)
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa","Tio Tomás", null)
   
    expect(tomas.aliado).toEqual({"id":rufus.id,"nome":rufus.nome})
    expect(tomas.inimigo).toEqual({"id":penelope.id,"nome":penelope.nome})
   
  })

  it('Deve conseguir calcular as novas posições corretamente de uma rodada para a próxima', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", "Rufus Lenhador", "Penélope Charmosa")
    const penelope = selecaoCorredor(responseCorredor,"Penélope Charmosa","Tio Tomás", null)
    const corredores = [tomas,penelope]
    const corrida = realizarCorrida(pista, corredores)
    
    //posições sendo alteradas
    expect(tomas.posicao).toBeGreaterThan(0)
    expect(penelope.posicao).toBeGreaterThan(0)
   
  })

  it('Deve impedir que corredor se mova negativamente mesmo se o calculo de velocidade seja negativo', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const tomas = selecaoCorredor(responseCorredor,"Tio Tomás", null, null)
    tomas.aceleracao = -1
    tomas.velocidade = -1
    tomas.drift = -1
    const corredores = [tomas]
    const corrida = realizarCorrida(pista, corredores)
    
    //posição 0 ja que nao pode se mover negativamente
    expect(tomas.posicao).toBe(0)
   
  })

  it('Deve impedir que o Dick Vigarista vença a corrida se estiver a uma rodada de ganhar', () => {
    const pista = selecaoPista(responsePista, "Nova York")
    const dick = selecaoCorredor(responseCorredor,"Dick Vigarista", "Rufus Lenhador", "Penélope Charmosa")
    const corredores = [dick]
    const corrida = realizarCorrida(pista, corredores)
    
    //Nunca chega ao fim da corrida (posição 30)
    expect(dick.posicao).toBe(29)
    
  })

})

