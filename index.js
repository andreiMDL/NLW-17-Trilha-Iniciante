const start = () => {
    
    while(true){
        let opcao = "cadastrar"
        switch(opcao){
            case "cadastrar":
                console.log("Vamos cadastrar")
                break
            case "listar":
                console.log("Vamos listar")
                break
            case "sair":
                console.log("saindo...")
                return
        }
    }
}
start()