# José Maria — índice de ideias

Site pessoal / portfólio de projetos, com o design inspirado na loja da Palantir (store.palantir.com).
Site estático, sem build e sem dependências: HTML, CSS e JavaScript simples.
Não tem qualquer afiliação com a Palantir Technologies.

## Correr localmente

Abre o `index.html` diretamente no browser, ou corre:

```bash
python3 -m http.server 8080
```

e abre http://localhost:8080.

## Adicionar um projeto (site)

1. Tira screenshots do site (1440×900 fica bem) e guarda-os em `images/`: um em modo claro e outro em modo escuro,
   se o projeto tiver os dois.
2. Em `js/data.js`, copia um objeto de `PROJECTS` e cola-o no fim da lista.
3. Preenche `handle`, `name`, `pitch`, `problem`, `status`, `date`, `live`, `image`, etc.
   `image: { light: '…', dark: '…' }` faz o preview mudar com o modo claro/escuro de quem visita.

O último projeto da lista aparece em destaque no topo da página (muda com `SITE.featured`).
Os espaços vazios da grelha são preenchidos com cartões "CLASSIFIED" até completar a linha.

## O terminal

O terminal no canto inferior esquerdo aceita comandos. Qualquer outra coisa responde com
`unknown command: <o que foi escrito>`.

| Comando | O que faz |
|---|---|
| `ls` | lista as secções; `ls projects` lista os projetos com o número de cada um |
| `cd <sítio>` | vai para uma página: `cd projects`, `cd about`, `cd recovery-lens`, `cd 2`, `cd ..` |
| `open <projeto>` | abre o site do projeto num separador novo: `open recovery lens`, `open 1`; sem nome lista o que se pode abrir |
| `help [comando]` | lista os comandos, ou mostra exemplos de um (`help open`) |
| `clear` | limpa o terminal (ou Ctrl+L) |
| `history` | mostra os comandos já escritos (↑ ↓ repetem-nos) |
| `date` | data e hora |
| `whoami` | quem és no sistema |

Tab completa comandos e nomes de projetos.

Para escrever não é preciso clicar: basta começar a escrever em qualquer parte da página.

## Easter eggs (palavras secretas)

Uma palavra secreta escrita no terminal leva a uma página escondida.
As palavras nunca ficam escritas no código, só o hash (SHA-256), por isso não se descobrem no código-fonte.

1. Abre `tools/hash.html` no browser e escreve a palavra.
2. Copia a linha gerada para a lista em `js/easter-eggs.js`.
3. Duplica `secret/exemplo.html` com o nome sugerido e edita o conteúdo.
   As páginas secretas não podem ter `<script>` nem `<style>` dentro do HTML (ver Segurança):
   usam `secret/secret.css` e `secret/secret.js`, e estilos próprios vão num ficheiro `.css` à parte.

Maiúsculas, acentos e espaços extra são ignorados ("Coração" = "coracao").

> Existe um easter egg de demonstração: a palavra **exemplo**. Apaga essa linha em `js/easter-eggs.js`
> (e o ficheiro `secret/exemplo.html`) quando criares os teus.

## Estrutura

```
index.html            página principal
css/styles.css        estilos
js/data.js            ← os teus dados e projetos (o ficheiro a editar)
js/easter-eggs.js     ← palavras secretas (hashes)
js/app.js             páginas e navegação
js/terminal.js        terminal
js/art.js             hero, molduras de preview, cartões "classified"
js/secret.js          hashing das palavras secretas
images/               screenshots dos projetos
secret/               páginas escondidas (+ secret.css / secret.js partilhados)
tools/hash.html       gerador de hashes para easter eggs
vercel.json           cabeçalhos de segurança
```

## Publicar (Vercel)

1. Em vercel.com, **Add New → Project**, importa este repo e faz deploy. Não é preciso configurar nada.
2. Opcional: em **Settings → Domains**, adiciona o teu domínio.

## Segurança e privacidade

- O `vercel.json` define uma Content Security Policy estrita: só correm scripts e estilos do próprio site
  (sem `<script>`/`<style>` inline) e o site não pode ser embebido noutras páginas.
- Todos os valores de `js/data.js` são escapados antes de irem para a página, e os links têm de começar
  por `http(s)://` ou `mailto:`.
- Sem cookies, sem analytics, sem formulários. O único pedido a terceiros são as fontes (Google Fonts:
  Inter Tight e Geist Mono).

## Logo

O símbolo é um "i" minúsculo: um ponto quadrado vermelho (a ideia) sobre uma haste (o trabalho).
- `favicon.svg`: ícone do separador
- `logo.svg` / `logo.png` (800×800): versão quadrada para fotos de perfil
- `logo-thumb.svg` / `logo-thumb.png` (800×800): corte mais apertado para miniaturas (botões do Linktree)
- `logo-thumb-dark.svg` / `logo-thumb-dark.png` (800×800): o mesmo sobre fundo escuro
- `linktree-banner.svg` / `linktree-banner.png` (1600×900): banner largo para o layout Featured do Linktree

Cores: vermelho `#b3341c`, tinta `#161513`, papel `#f4f2ee`.
