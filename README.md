# ● FocusCycle

> Gerenciador de sessões de trabalho baseado na técnica Pomodoro — 100% offline, sem dependências externas.

**[→ Acessar o projeto](URL_DO_DEPLOY)**

---

## Sobre o projeto

FocusCycle é um timer Pomodoro construído do zero com HTML, CSS e JavaScript puro. O diferencial está na ausência total de frameworks, bibliotecas ou bundlers — cada funcionalidade foi implementada diretamente com APIs nativas do browser.

O projeto nasceu como um exercício de domínio de fundamentos de frontend:

- Máquina de estados finitos para controle do timer
- Contagem precisa baseada em timestamps (`Date.now()`) em vez de `setInterval`
- Animação SVG via `stroke-dashoffset`
- Síntese de áudio com Web Audio API
- Persistência de dados com `localStorage`
- Tema claro/escuro via CSS custom properties

---

## Funcionalidades

- ⏱ Timer configurável: foco (25 min), pausa curta (5 min) e pausa longa (15 min)
- ○ Indicador de progresso circular animado em SVG puro
- 🔔 Notificações sonoras ao fim de cada fase, geradas pela Web Audio API
- 📋 Registro das sessões concluídas no dia, persistido em localStorage
- 🌙 Toggle de tema claro/escuro com preferência salva entre sessões
- ♿ Acessível: navegação por teclado, `aria-live`, `aria-pressed`, `prefers-reduced-motion`

---

## Stack

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica e acessibilidade |
| CSS3 | Custom properties, animações, tema claro/escuro |
| JavaScript ES6+ | Lógica, módulos, manipulação de DOM |
| ES Modules nativos | Sem bundler — o browser resolve os imports diretamente |
| Web Audio API | Geração de sons sem arquivos de áudio externos |
| localStorage | Persistência do histórico diário de sessões |

---

## Arquitetura

```
focuscycle/
├── index.html       # Shell HTML + ponto de entrada
├── style.css        # Estilos globais e custom properties de tema
└── js/
    ├── main.js      # Entry point — conecta os módulos e registra eventos
    ├── timer.js     # Máquina de estados (idle → running → paused) e contagem por timestamp
    ├── ui.js        # Manipulação de DOM: display, anel SVG, rótulo de fase
    ├── sound.js     # Síntese de áudio via Web Audio API
    └── storage.js   # Leitura e escrita do histórico no localStorage
```

### Decisões de arquitetura

**Máquina de estados finitos**
O timer é modelado como uma FSM com estados explícitos (`idle`, `running`, `paused`) e transições validadas. Isso elimina estados impossíveis — pausar um timer que não está rodando, por exemplo, é silenciosamente ignorado.

**Contagem por timestamp**
Em vez de decrementar um contador a cada callback do `setInterval`, o timer grava `Date.now()` no início e calcula o tempo restante como `endTime - Date.now()` a cada tick. Atrasos do browser não acumulam erro.

**Separação de responsabilidades**
`timer.js` não conhece o DOM. `ui.js` não conhece a lógica do timer. `main.js` é o único que conecta os dois via callbacks (`onTick`, `onComplete`). Cada módulo pode ser testado e modificado de forma independente.

**CSS orientado a estado**
O JavaScript aplica classes de estado ao `body` (`is-running`, `is-paused`, `is-idle`). O CSS reage a essas classes para ativar animações — o JS nunca escreve estilos diretamente.

---

## Como rodar localmente

ES Modules exigem um servidor HTTP — não funcionam via `file://`.

**Com Python (sem instalação adicional):**
```bash
python3 -m http.server 8080
```

**Com Node.js:**
```bash
npx live-server
```

Acesse `http://localhost:8080` no browser.

---

## Autor

Desenvolvido por **Hugo Pereira Vital**

[![GitHub](https://img.shields.io/badge/GitHub-hugoPereir4-181717?logo=github)](https://github.com/hugoPereir4)