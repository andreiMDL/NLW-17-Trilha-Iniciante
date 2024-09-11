const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises


let mensagem = "Bem-Vindo ao App de Metas"

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "})

    if(meta.length == 0) {
        mensagem = "A meta não pode ser vazia."
        return cadastrarMeta()
    }

    metas.push(
        { value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    if(metas.lenght == 0){
        messagem = "Não existem metas!"
        return
    }
    const respostas = await checkbox(
        { message: "Use as Setas para mudar de meta, o Espaço para marcar/desmarcar e Enter para finalizar essa etapa",
            choices: [...metas],
            instructions: false
        }
    )
    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.lenght == 0){
        mensagem = "Nenhuma meta selecionada!"
        return
    }


    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "Metas(s) marcada(s) como concluída(s)!"
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked 
    })

    if(realizadas.length == 0) {
        console.log("Não existem metas realizadas!")
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
    
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0) {
        console.log("Não existem metas abertas!")
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itensADeletar = await checkbox({
            message: "Selecione qual meta você quer deletar",
            choices: [...metasDesmarcadas],
            instructions: false
        })

    if(itensADeletar.length == 0) {
        mensagem = "Nenhum item para deletar."
        return
    }
    
    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
            
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()
    
    
    while(true){
        await mostrarMensagem()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "Cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "Listar"
                },
                {
                    name: "Metas realizadas",
                    value: "Realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "Abertas"
                },
                {
                    name: "Deletar metas",
                    value: "Deletar"
                },
                {
                    name: "Sair",
                    value: "Sair"
                }
            ]
        })


        
        switch(opcao){
            case "Cadastrar":
                await cadastrarMeta()
                await salvarMetas()
                break
            case "Listar":
                await listarMetas()
                await salvarMetas()
                break
            case "Realizadas":
                await metasRealizadas()
                break
            case "Abertas":
                await metasAbertas()
                break
            case "Deletar":
                await deletarMetas()
                await salvarMetas()
                break
            case "Sair":
                console.log("Até a próxima!")
                return
        }
    }
}
start()