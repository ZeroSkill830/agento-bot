# 🤖 Regole Cursor - Chatbot Web Iniettabile

## 🎯 Contesto Progetto
Stai sviluppando un **chatbot web iniettabile** che deve essere completamente autonomo e isolato tramite Shadow DOM. Il progetto richiede JavaScript vanilla, HTML e CSS senza framework esterni.

## 📋 Riferimento Task List
**SEMPRE** consulta `task.md` per:
- Verificare lo stato di avanzamento delle task
- Seguire l'ordine delle priorità (HIGH → MEDIUM → LOW)
- Mantenere coerenza con l'architettura definita

**OBBLIGATORIO**: Dopo ogni implementazione completa, segna immediatamente i task come completati con `[x]` in `task.md`.

## 🛠️ Regole Tecniche Obbligatorie

### JavaScript
- ✅ **SOLO JavaScript vanilla** - NO framework (React, Vue, Angular)
- ✅ **Shadow DOM obbligatorio** con `attachShadow({ mode: 'open' })`
- ✅ **Modularità**: separa UI, eventi, messaggi e configurazione
- ✅ **Compatibilità browser**: Chrome, Firefox, Safari, Edge
- ✅ **NO variabili globali** eccetto `window.Chatbot`
- ✅ **Event delegation** per performance ottimali
- ✅ **Memory leak prevention** - cleanup degli event listener

### CSS
- ✅ **CSS Scoped** nel Shadow DOM - NO stili globali
- ✅ **CSS Variables** per temi e configurazione
- ✅ **Mobile-first** responsive design
- ✅ **NO framework CSS** (Bootstrap, Tailwind, etc.)
- ✅ **Font system**: Inter, Roboto o system-ui
- ✅ **Accessibilità WCAG** - contrasti e focus management

### HTML
- ✅ **Template HTML** iniettato dinamicamente
- ✅ **Semantic markup** per accessibilità
- ✅ **ARIA labels** appropriati
- ✅ **NO dipendenze esterne** - tutto self-contained

## 📐 Architettura Obbligatoria

### Struttura File
```
/chatbot/
├── chatbot.js    # Entry point principale
├── chatbot.html  # Template markup
├── chatbot.css   # Stili isolati
└── index.html    # Demo page
```

### Moduli JavaScript
```javascript
const ChatbotUI = { ... };       // Gestione interfaccia
const ChatbotMessages = { ... }; // Sistema messaggi
const ChatbotConfig = { ... };   // Configurazione
const ChatbotCore = { ... };     // Orchestratore principale
```

### API Pubblica Richiesta
```javascript
window.Chatbot = {
  init(config) { ... },
  destroy() { ... },
  isInitialized: false
};
```

## 🎨 Specifiche UI Obbligatorie

### Dimensioni
- **Desktop**: 400x600px
- **Mobile**: 90% width × 100% height
- **Toggle button**: 60x60px fisso bottom-right

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Componenti UI Richiesti
1. **Pulsante toggle** (fisso, bottom-right)
2. **Header chatbot** (titolo + close button)
3. **Area messaggi** (scrollable)
4. **Input utente** (text + submit button)
5. **Loading states** (typing indicator)

## 🔄 Workflow di Sviluppo

### Ordine di Implementazione
1. **Shadow DOM setup** (priorità assoluta)
2. **UI base desktop** (toggle + window)
3. **Sistema messaggi** (array + rendering)
4. **Responsive mobile** 
5. **Configurazione avanzata**
6. **Testing cross-browser**

### Quando Scrivere Codice
- ✅ **Implementa immediatamente** se la task è nella fase corrente
- ✅ **Segui l'ordine** definito in `task.md`
- ✅ **Testing immediato** dopo ogni componente
- ❌ **NO anticipare** fasi future senza completare quella corrente

## 🧪 Testing Obbligatorio

### Ogni Modifica DEVE:
- ✅ Funzionare in tutti i browser target
- ✅ Essere responsive su mobile/desktop  
- ✅ Non interferire con stili del sito host
- ✅ Mantenere performance ottimali
- ✅ Rispettare accessibilità base

### Test Casi Specifici
- Integrazione su siti con Bootstrap/Tailwind
- Funzionamento con CSS reset esistenti
- Performance con molti messaggi (50+)
- Memory usage dopo apertura/chiusura ripetute

## 📝 Stile di Codice

### Commenti Obbligatori
```javascript
/**
 * 🎯 Scopo: [Descrizione funzione]
 * 📥 Input: [Parametri]
 * 📤 Output: [Valore ritornato]
 * 🔧 Esempio: [Uso pratico]
 */
```

### Naming Convention
- **Funzioni**: `camelCase` (es. `initChatbot`)
- **CSS Classes**: `kebab-case` (es. `.chatbot-header`)
- **CSS Variables**: `--chatbot-*` (es. `--chatbot-primary`)
- **Constants**: `UPPER_CASE` (es. `DEFAULT_CONFIG`)

## 🚫 Divieti Assoluti

### NON Utilizzare
- ❌ Framework JavaScript (React, Vue, Angular)
- ❌ CSS Framework (Bootstrap, Tailwind, Foundation)
- ❌ Librerie esterne (jQuery, Lodash, etc.)
- ❌ CDN dependencies
- ❌ Build tools complessi (Webpack, Vite)
- ❌ TypeScript (solo vanilla JS)

### NON Implementare
- ❌ Backend/server components
- ❌ Database integration
- ❌ Authentication systems
- ❌ File upload/download
- ❌ Complex routing

## 🎯 Obiettivi di Qualità

### Performance Target
- ⚡ **Load time**: < 100ms
- ⚡ **Memory usage**: < 5MB
- ⚡ **Bundle size**: < 50KB totali
- ⚡ **First paint**: < 50ms

### Compatibilità Target
- 🌐 **Chrome**: 80+
- 🌐 **Firefox**: 75+  
- 🌐 **Safari**: 13+
- 🌐 **Edge**: 80+
- 📱 **Mobile**: iOS Safari 13+, Chrome Mobile 80+

## 💡 Suggerimenti per l'AI

### Quando Non Sei Sicuro
1. **Consulta `task.md`** per verificare priorità
2. **Chiedi chiarimenti** per requirements ambigui
3. **Implementa la versione più semplice** che soddisfa i requisiti
4. **Testa immediatamente** ogni implementazione

### Pattern Consigliati
- **Progressive enhancement** (base → advanced)
- **Mobile-first** responsive design
- **Graceful degradation** per browser più vecchi
- **Defense in depth** per error handling

### Debugging Approach
1. **Shadow DOM inspector** in DevTools
2. **Console logging** strutturato
3. **Performance tab** per memory leaks
4. **Responsive design mode** per mobile testing

---

**🎯 RICORDA**: L'obiettivo è un chatbot **completamente autonomo** e **facilmente integrabile** che funzioni su qualsiasi sito web senza conflitti! 