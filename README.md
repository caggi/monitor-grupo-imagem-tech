# Monitor Grupo Imagem Tech

Painel web para acompanhar a disponibilidade do endereço de atendimento do Grupo Imagem Tech.

- Site monitorado: https://atendimento.grupoimagetech.com.br/
- Aplicação publicada: https://monitor-grupo-imagem-tech.felipecaggi.chatgpt.site

## Funcionalidades

- Verificação manual e automática de disponibilidade.
- Intervalos configuráveis entre 15 segundos e 5 minutos.
- Contagem regressiva até a próxima tentativa.
- Histórico das verificações recentes.
- Notificação do navegador e alerta sonoro quando o endereço volta a responder.
- Interface responsiva em tema escuro.
- Preferência de intervalo preservada no navegador.

## Tecnologias

- React
- TypeScript
- Vinext
- Vite
- Lucide React
- Cloudflare Workers

## Requisitos

- Node.js 22.13 ou superior
- npm

## Executar localmente

```powershell
git clone https://github.com/caggi/monitor-grupo-imagem-tech.git
Set-Location "monitor-grupo-imagem-tech"

npm ci
npx vite
```

Abra o endereço informado no terminal, normalmente `http://localhost:5173`.

## Gerar o build

```powershell
npm run build
```

## Como o monitoramento funciona

A aplicação realiza periodicamente uma requisição externa com `fetch` e `mode: "no-cors"`. Uma resposta de rede indica que o endereço voltou a responder, independentemente do código HTTP retornado.

> [!IMPORTANT]
> O painel precisa permanecer aberto no navegador para continuar monitorando. Ele confirma que o endereço respondeu, mas não garante que autenticação, páginas internas ou demais funcionalidades do sistema estejam operacionais.

## Publicação

O projeto está vinculado ao ChatGPT Sites. Enviar alterações ao GitHub não republica automaticamente a aplicação. Uma nova versão precisa ser criada e publicada pelo Sites.

## Integração contínua

O workflow `Build` executa a instalação limpa das dependências e valida o build em pushes e pull requests direcionados à branch `main`.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
