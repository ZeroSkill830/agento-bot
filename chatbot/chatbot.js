/**
 * 🤖 Chatbot Web Iniettabile - Versione Vanilla JavaScript
 * 🎯 Scopo: Entry point principale per il chatbot autonomo
 * 📦 Versione: 1.0.0
 * 🔧 Uso: window.Chatbot.init({ language: 'it' })
 */

(function() {
    'use strict';

    // 🚫 Previeni inizializzazione multipla
    if (window.Chatbot) {
        console.warn('🤖 Chatbot già inizializzato');
        return;
    }

    /**
     * 🎨 MODULO: ChatbotUI
     * 🎯 Scopo: Gestisce interfaccia utente e Shadow DOM
     * 📋 Responsabilità: Creazione Shadow DOM, caricamento template/stili, eventi UI
     */
    const ChatbotUI = {
            /**
     * 📝 Proprietà del modulo
     */
    shadowRoot: null,
    isVisible: false,
    isInitializing: true,

        /**
         * 🎯 Scopo: Inizializza Shadow DOM e carica UI
         * 📥 Input: Container element (HTMLElement)
         * 📤 Output: Shadow DOM completo e funzionante
         * 🔧 Esempio: await ChatbotUI.init(document.body)
         */
        async init(container) {
            try {
                console.log('🚀 Inizializzazione ChatbotUI...');
                
                await this.createShadowDOM(container);
                await this.loadTemplate();
                
                // Disabilita transizioni durante l'inizializzazione
                const window = this.shadowRoot.querySelector('.chatbot-window');
                if (window) {
                    window.classList.add('chatbot-window--no-transition');
                }
                
                await this.loadStyles();
                this.setupEventListeners();
                
                // Riabilita transizioni dopo un piccolo delay
                setTimeout(() => {
                    if (window) {
                        window.classList.remove('chatbot-window--no-transition');
                    }
                    this.isInitializing = false;
                    console.log('✅ ChatbotUI inizializzato con successo');
                }, 100);
                
                return true;
                
            } catch (error) {
                console.error('❌ Errore inizializzazione ChatbotUI:', error);
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Crea Shadow DOM isolato
         * 📥 Input: Container element
         * 📤 Output: Shadow DOM creato
         */
        async createShadowDOM(container) {
            try {
                // Crea Shadow DOM con isolamento completo
                this.shadowRoot = container.attachShadow({ mode: 'open' });
                
                // Verifica supporto Shadow DOM
                if (!this.shadowRoot) {
                    throw new Error('Browser non supporta Shadow DOM');
                }
                
                console.log('✅ Shadow DOM creato con successo');
                
            } catch (error) {
                console.error('❌ Errore creazione Shadow DOM:', error);
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Carica template HTML nel Shadow DOM
         * 📥 Input: Nessuno
         * 📤 Output: HTML template caricato
         */
        /**
         * 🎯 Scopo: Carica template HTML hardcoded
         * 📥 Input: Nessuno
         * 📤 Output: Template HTML caricato nel Shadow DOM
         */
        async loadTemplate() {
            const htmlTemplate = `
                <!-- Pulsante Toggle Chatbot -->
                <button class="chatbot-toggle" aria-label="Apri chat" type="button">
                    <svg class="chatbot-toggle-icon" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                </button>

                <!-- Finestra Chatbot -->
                <div class="chatbot-window" aria-hidden="true" role="dialog" aria-labelledby="chatbot-title">
                    <!-- Header -->
                    <header class="chatbot-header">
                        <h2 class="chatbot-title" id="chatbot-title">Assistente Virtuale</h2>
                        <button class="chatbot-close" aria-label="Chiudi chat" type="button">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </header>

                    <!-- Area Messaggi -->
                    <div class="chatbot-messages" role="log" aria-live="polite" aria-label="Cronologia conversazione">
                        <div class="chatbot-welcome-message chatbot-message chatbot-message--bot">
                            <div class="chatbot-message-content">
                                Ciao! 👋 Sono il tuo assistente virtuale. Come posso aiutarti oggi?
                            </div>
                        </div>
                    </div>

                    <!-- Indicatore Typing -->
                    <div class="chatbot-typing" aria-label="L'assistente sta scrivendo">
                        <div class="chatbot-typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="chatbot-typing-text">L'assistente sta scrivendo...</span>
                    </div>

                    <!-- Quick Actions -->
                    <div class="chatbot-quick-actions">
                        <button class="chatbot-quick-action" data-text="Organizzate visite?" data-api-url="https://macaw-eager-gradually.ngrok-free.app/api/winery/experiences">
                            Organizzate visite?
                        </button>
                        <button class="chatbot-quick-action" data-text="Degustiamo insieme?" data-api-url="https://macaw-eager-gradually.ngrok-free.app/api/wine-knowledge/wines">
                            Degustiamo insieme?
                        </button>
                    </div>

                    <!-- Area Input -->
                    <div class="chatbot-input-area">
                        <form class="chatbot-input-form">
                            <div class="chatbot-input-container">
                                <input 
                                    type="text" 
                                    class="chatbot-input" 
                                    placeholder="Scrivi un messaggio..." 
                                    autocomplete="off"
                                    aria-label="Scrivi il tuo messaggio"
                                    maxlength="500"
                                />
                                <button 
                                    type="submit" 
                                    class="chatbot-send-button" 
                                    disabled 
                                    aria-label="Invia messaggio"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Footer -->
                    <footer class="chatbot-footer">
                        <div class="chatbot-powered">Powered by Chatbot v1.0</div>
                    </footer>
                </div>

                <!-- Template per Messaggi Dinamici -->
                <template class="chatbot-message-template">
                    <div class="chatbot-message">
                        <div class="chatbot-message-content"></div>
                        <div class="chatbot-message-time"></div>
                    </div>
                </template>
            `;
            
            this.shadowRoot.innerHTML = htmlTemplate;
            console.log('✅ Template HTML caricato nel Shadow DOM');
        },

            /**
     * 🎯 Scopo: Carica stili CSS nel Shadow DOM
     * 📥 Input: Nessuno
     * 📤 Output: Stili applicati
     */
    async loadStyles() {
        try {
            // Usa <link> invece di fetch per evitare problemi CORS con file://
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = 'chatbot/chatbot.css';
            
            // Promessa per sapere quando il CSS è caricato
            const loadPromise = new Promise((resolve, reject) => {
                linkElement.onload = () => {
                    console.log('✅ Stili CSS caricati da file esterno nel Shadow DOM');
                    resolve();
                };
                linkElement.onerror = () => {
                    console.error('❌ Errore caricamento CSS file');
                    this.loadFallbackStyles();
                    reject(new Error('CSS file non trovato'));
                };
            });
            
            this.shadowRoot.appendChild(linkElement);
            await loadPromise;
            
        } catch (error) {
            console.error('❌ Errore caricamento stili CSS:', error);
            // Fallback già caricato nell'onerror
        }
    },

        /**
         * 🎯 Scopo: Carica stili CSS di fallback
         * 📥 Input: Nessuno
         * 📤 Output: Stili minimi applicati
         */
        loadFallbackStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                :host {
                  --chatbot-primary: #2563eb;
                  --chatbot-spacing-lg: 24px;
                  --chatbot-radius-lg: 12px;
                  --chatbot-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .chatbot-toggle {
                  position: fixed;
                  bottom: var(--chatbot-spacing-lg);
                  right: var(--chatbot-spacing-lg);
                  width: 60px; height: 60px;
                  background: var(--chatbot-primary);
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: var(--chatbot-shadow-xl);
                  z-index: 1000;
                }
                .chatbot-window {
                  position: fixed;
                  bottom: 100px; right: var(--chatbot-spacing-lg);
                  width: 400px; height: 600px;
                  background: white;
                  border-radius: var(--chatbot-radius-lg);
                  box-shadow: var(--chatbot-shadow-xl);
                  z-index: 1001;
                  opacity: 0;
                }
                .chatbot-window--visible { opacity: 1; }
            `;
            
            this.shadowRoot.appendChild(styleElement);
            console.log('⚠️ Stili CSS di fallback caricati');
        },

        /**
         * 🎯 Scopo: Mostra/nasconde chatbot
         * 📥 Input: Nessuno
         * 📤 Output: Aggiorna stato visibilità
         * 🔧 Esempio: toggle() per cambiare visibilità
         */
        toggle() {
            if (!this.shadowRoot) {
                console.error('❌ Shadow DOM non inizializzato');
                return;
            }

            // Ignora toggle durante l'inizializzazione
            if (this.isInitializing) {
                console.log('⏳ Toggle ignorato durante inizializzazione');
                return;
            }

            const window = this.shadowRoot.querySelector('.chatbot-window');
            const toggle = this.shadowRoot.querySelector('.chatbot-toggle');
            
            if (!window || !toggle) {
                console.error('❌ Elementi UI non trovati');
                return;
            }

            console.log('🔄 Toggle chiamato, stato attuale:', this.isVisible);
            this.isVisible = !this.isVisible;
            console.log('🔄 Nuovo stato:', this.isVisible);
            
            if (this.isVisible) {
                this.openChatbot(window, toggle);
            } else {
                this.closeChatbot(window, toggle);
            }
        },

        /**
         * 🎯 Scopo: Apre la finestra chatbot
         * 📥 Input: Elementi window e toggle
         * 📤 Output: Finestra aperta con animazione
         */
        openChatbot(window, toggle) {
            // Aggiorna attributi ARIA
            window.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-label', 'Chiudi chat');
            
            // Aggiunge classe per animazione
            window.classList.add('chatbot-window--visible');
            
            // Focus management per accessibilità
            setTimeout(() => {
                const firstInput = window.querySelector('.chatbot-input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 300); // Dopo l'animazione
            
            console.log('✅ Chatbot aperto');
        },

        /**
         * 🎯 Scopo: Chiude la finestra chatbot
         * 📥 Input: Elementi window e toggle
         * 📤 Output: Finestra chiusa con animazione
         */
        closeChatbot(window, toggle) {
            // Aggiorna attributi ARIA
            window.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-label', 'Apri chat');
            
            // Rimuove classe per animazione
            window.classList.remove('chatbot-window--visible');
            
            // Non dare focus durante l'inizializzazione
            // toggle.focus();
            
            console.log('✅ Chatbot chiuso');
        },

        /**
         * 🎯 Scopo: Imposta event listeners per UI
         * 📥 Input: Nessuno
         * 📤 Output: Eventi collegati
         */
        setupEventListeners() {
            if (!this.shadowRoot) {
                console.error('❌ Shadow DOM non inizializzato per eventi');
                return;
            }

            const toggle = this.shadowRoot.querySelector('.chatbot-toggle');
            const closeButton = this.shadowRoot.querySelector('.chatbot-close');
            const form = this.shadowRoot.querySelector('.chatbot-input-form');
            const input = this.shadowRoot.querySelector('.chatbot-input');
            const sendButton = this.shadowRoot.querySelector('.chatbot-send-button');
            const quickActions = this.shadowRoot.querySelectorAll('.chatbot-quick-action');

            // Event listener per pulsante toggle
            if (toggle) {
                toggle.addEventListener('click', () => this.toggle());
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });
            }

            // Event listener per pulsante close
            if (closeButton) {
                closeButton.addEventListener('click', () => this.toggle());
                closeButton.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });
            }

            // Event listener per form submit
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleMessageSubmit();
                });
            }

            // Event listener per input (abilita/disabilita send button)
            if (input && sendButton) {
                input.addEventListener('input', () => {
                    const hasText = input.value.trim().length > 0;
                    const botNotWaiting = !ChatbotMessages.isWaitingForBotResponse;
                    sendButton.disabled = !(hasText && botNotWaiting);
                });

                // Gestione Enter key
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const hasText = input.value.trim().length > 0;
                        const botNotWaiting = !ChatbotMessages.isWaitingForBotResponse;
                        
                        // Invia solo se c'è testo E il bot non sta rispondendo
                        if (hasText && botNotWaiting) {
                            this.handleMessageSubmit();
                        }
                    }
                });
            }

            // Event listener per click fuori dalla finestra (mobile)
            document.addEventListener('click', (e) => {
                if (this.isVisible && !e.composedPath().includes(this.shadowRoot.host)) {
                    // Su mobile, chiudi se clicchi fuori
                    if (window.innerWidth <= 768) {
                        this.toggle();
                    }
                }
            });

            // Event listener per Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.toggle();
                }
            });

            // Event listeners per quick actions
            if (quickActions) {
                quickActions.forEach(button => {
                    button.addEventListener('click', () => {
                        const text = button.getAttribute('data-text');
                        const apiUrl = button.getAttribute('data-api-url');
                        
                        if (text && apiUrl) {
                            this.handleQuickAction(text, apiUrl);
                        }
                    });
                });
            }

            console.log('✅ Event listeners configurati');
        },

        /**
         * 🎯 Scopo: Gestisce invio messaggio
         * 📥 Input: Nessuno (legge da input field)
         * 📤 Output: Messaggio aggiunto, input resettato
         */
        handleMessageSubmit() {
            const input = this.shadowRoot.querySelector('.chatbot-input');
            const sendButton = this.shadowRoot.querySelector('.chatbot-send-button');
            
            if (!input || !sendButton) {
                console.error('❌ Elementi input non trovati');
                return;
            }

            const message = input.value.trim();
            if (!message) return;

            // Disabilita solo il pulsante send durante il processing
            sendButton.disabled = true;

            // Aggiungi messaggio utente
            ChatbotMessages.addMessage(message, 'user');
            
            // Reset input
            input.value = '';
            
            // Ottieni risposta bot (API o fallback)
            ChatbotMessages.getBotResponse(message);
            
            console.log('📤 Messaggio inviato:', message);
        },

        /**
         * 🎯 Scopo: Riabilita il pulsante send dopo risposta bot
         * 📥 Input: Nessuno
         * 📤 Output: Pulsante send riabilitato se c'è testo nell'input e bot ha finito
         */
        enableInput() {
            const input = this.shadowRoot.querySelector('.chatbot-input');
            const sendButton = this.shadowRoot.querySelector('.chatbot-send-button');
            
            if (input && sendButton) {
                // Riabilita il pulsante solo se:
                // 1. C'è del testo nell'input
                // 2. Il bot non sta aspettando una risposta
                const hasText = input.value.trim().length > 0;
                const botNotWaiting = !ChatbotMessages.isWaitingForBotResponse;
                sendButton.disabled = !(hasText && botNotWaiting);
                
                // Focus sull'input per continuare la conversazione
                input.focus();
            }
        },

        /**
         * 🎯 Scopo: Gestisce click su quick action
         * 📥 Input: text (string), apiUrl (string)
         * 📤 Output: Messaggio inviato con API custom
         */
        handleQuickAction(text, apiUrl) {
            // Verifica che il bot non stia già rispondendo
            if (ChatbotMessages.isWaitingForBotResponse) {
                return;
            }

            // Disabilita le quick actions durante il processing
            this.disableQuickActions();

            // Aggiungi messaggio utente
            ChatbotMessages.addMessage(text, 'user');
            
            // Ottieni risposta bot usando API custom
            ChatbotMessages.getBotResponseFromCustomAPI(text, apiUrl);
            
            console.log('⚡ Quick action cliccata:', text, 'API:', apiUrl);
        },

        /**
         * 🎯 Scopo: Disabilita le quick actions durante il processing
         * 📥 Input: Nessuno
         * 📤 Output: Quick actions disabilitate
         */
        disableQuickActions() {
            const quickActions = this.shadowRoot.querySelectorAll('.chatbot-quick-action');
            quickActions.forEach(button => {
                button.disabled = true;
            });
        },

        /**
         * 🎯 Scopo: Riabilita le quick actions dopo la risposta
         * 📥 Input: Nessuno
         * 📤 Output: Quick actions riabilitate
         */
        enableQuickActions() {
            const quickActions = this.shadowRoot.querySelectorAll('.chatbot-quick-action');
            quickActions.forEach(button => {
                button.disabled = false;
            });
        },

        /**
         * 🎯 Scopo: Aggiorna layout per responsive
         * 📥 Input: Nessuno (rileva dimensioni finestra)
         * 📤 Output: Classi CSS aggiornate
         */
        updateResponsiveLayout() {
            if (!this.shadowRoot) return;
            
            const window = this.shadowRoot.querySelector('.chatbot-window');
            if (!window) return;
            
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                window.classList.add('chatbot-window--mobile');
            } else {
                window.classList.remove('chatbot-window--mobile');
            }
        }
    };

    /**
     * 💬 MODULO: ChatbotMessages  
     * 🎯 Scopo: Gestisce sistema di messaggi
     * 📋 Responsabilità: CRUD messaggi, rendering, bot responses
     */
    const ChatbotMessages = {
        /**
         * 📝 Proprietà del modulo
         */
        messages: [],
        isWaitingForBotResponse: false,
        welcomeMessageShown: true,

        /**
         * 🎯 Scopo: Aggiunge nuovo messaggio alla conversazione
         * 📥 Input: text (string), type ('user'|'bot') 
         * 📤 Output: Messaggio aggiunto e renderizzato
         * 🔧 Esempio: addMessage('Ciao!', 'user')
         */
        addMessage(text, type = 'user') {
            const message = {
                id: Date.now() + Math.random(),
                text: text.trim(),
                type: type,
                timestamp: new Date()
            };

            this.messages.push(message);
            
            // Rimuovi messaggio di benvenuto al primo messaggio utente
            if (type === 'user' && this.welcomeMessageShown) {
                this.removeWelcomeMessage();
                this.welcomeMessageShown = false;
            }
            
            this.render();
            console.log(`💬 Messaggio ${type} aggiunto:`, text);
        },

        /**
         * 🎯 Scopo: Renderizza tutti i messaggi nell'interfaccia
         * 📥 Input: Nessuno
         * 📤 Output: DOM aggiornato con messaggi
         */
        render() {
            const messagesContainer = ChatbotUI.shadowRoot?.querySelector('.chatbot-messages');
            if (!messagesContainer) {
                console.error('❌ Container messaggi non trovato');
                return;
            }

            // Mantieni messaggio benvenuto se necessario
            const welcomeMsg = messagesContainer.querySelector('.chatbot-welcome-message');
            
            // Rimuovi solo i messaggi dinamici (non il welcome)
            const dynamicMessages = messagesContainer.querySelectorAll('.chatbot-message:not(.chatbot-welcome-message)');
            dynamicMessages.forEach(msg => msg.remove());

            // Renderizza tutti i messaggi
            this.messages.forEach(message => {
                const messageElement = this.createMessageElement(message);
                messagesContainer.appendChild(messageElement);
            });

            this.scrollToBottom();
        },

        /**
         * 🎯 Scopo: Crea elemento DOM per singolo messaggio
         * 📥 Input: message object {id, text, type, timestamp}
         * 📤 Output: HTMLElement del messaggio
         */
        createMessageElement(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message chatbot-message--${message.type}`;
            messageDiv.setAttribute('data-message-id', message.id);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'chatbot-message-content';

            console.log(message, 'xxx');
            
            // Gestione speciale per wine cards
            if (message.isWineCards && message.wineCardsHtml) {
                contentDiv.innerHTML = message.wineCardsHtml;
            } 
            // Gestione speciale per experience cards
            else if (message.isExperienceCards && message.experienceCardsHtml) {
                contentDiv.innerHTML = message.experienceCardsHtml;
            } 
            else {
                contentDiv.textContent = message.text;
            }

            const timeDiv = document.createElement('div');
            timeDiv.className = 'chatbot-message-time';
            timeDiv.textContent = this.formatTime(message.timestamp);

            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);

            return messageDiv;
        },

        /**
         * 🎯 Scopo: Formatta timestamp per visualizzazione
         * 📥 Input: Date object
         * 📤 Output: Stringa formattata (HH:MM)
         */
        formatTime(timestamp) {
            return timestamp.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        /**
         * 🎯 Scopo: Scrolla automaticamente all'ultimo messaggio
         * 📥 Input: Nessuno
         * 📤 Output: Scroll aggiornato
         */
        scrollToBottom() {
            const messagesContainer = ChatbotUI.shadowRoot?.querySelector('.chatbot-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        },

        /**
         * 🎯 Scopo: Ottiene risposta bot (API o fallback)
         * 📥 Input: userMessage (string) - messaggio dell'utente
         * 📤 Output: Risposta bot dopo delay
         */
        async getBotResponse(userMessage) {
            this.isWaitingForBotResponse = true;
            this.showTypingIndicator();

            try {
                let botResponse;

                if (ChatbotAPI.isConnected()) {
                    // Usa API reale
                    botResponse = await ChatbotAPI.sendMessage(userMessage);
                } else {
                    // Fallback con risposte simulate
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
                    
                    const responses = [
                        "Interessante! Potresti dirmi di più?",
                        "Capisco la tua domanda. Lascia che ci pensi...",
                        "Ottima domanda! Ecco cosa penso:",
                        "Perfetto! Sono qui per aiutarti con questo.",
                        "Vedo il punto. La mia risposta è:",
                        "Grazie per la domanda! La mia opinione:",
                        "Molto bene! Ecco la mia risposta:",
                        "Comprendo! Posso aiutarti così:"
                    ];
                    
                    botResponse = responses[Math.floor(Math.random() * responses.length)];
                }

                this.hideTypingIndicator();
                this.addMessage(botResponse, 'bot');
                
                // Bot ha finito di rispondere
                this.isWaitingForBotResponse = false;
                
                // Riabilita input e quick actions per permettere nuovi messaggi
                ChatbotUI.enableInput();
                ChatbotUI.enableQuickActions();

            } catch (error) {
                console.error('❌ Errore risposta bot:', error);
                this.hideTypingIndicator();
                this.addMessage('Scusa, c\'è stato un problema. Riprova più tardi.', 'bot');
                
                // Bot ha finito di rispondere (anche in caso di errore)
                this.isWaitingForBotResponse = false;
                
                // Riabilita input e quick actions anche in caso di errore
                ChatbotUI.enableInput();
                ChatbotUI.enableQuickActions();
            }
        },

        /**
         * 🎯 Scopo: Ottiene risposta bot da API custom (quick actions)
         * 📥 Input: userMessage (string), customApiUrl (string)
         * 📤 Output: Risposta bot aggiunta ai messaggi
         */
        async getBotResponseFromCustomAPI(userMessage, customApiUrl) {
            this.isWaitingForBotResponse = true;
            this.showTypingIndicator();

            try {
                let botResponse;

                if (ChatbotAPI.isConnected()) {
                    // Usa API custom per quick actions
                    botResponse = await ChatbotAPI.sendMessageToCustomAPI(userMessage, customApiUrl);
                    console.log('🔄 BotResponse ricevuta:', typeof botResponse, botResponse);
                    
                    // Se la risposta contiene vini, gestiscila diversamente
                    if (typeof botResponse === 'object' && botResponse.type === 'wines') {
                        console.log('🍷 Gestendo wine cards');
                        this.hideTypingIndicator();
                        this.addWineCards(botResponse.data);
                        
                        // Bot ha finito di rispondere
                        this.isWaitingForBotResponse = false;
                        
                        // Riabilita input e quick actions
                        ChatbotUI.enableInput();
                        ChatbotUI.enableQuickActions();
                        return;
                    }
                    
                    // Se la risposta contiene esperienze, gestiscila diversamente
                    if (typeof botResponse === 'object' && botResponse.type === 'experiences') {
                        console.log('🎯 Gestendo experience cards');
                        this.hideTypingIndicator();
                        
                        // Prima mostra il messaggio di reply
                        this.addMessage(botResponse.reply, 'bot');
                        
                        // Poi mostra le experience cards
                        this.addExperienceCards(botResponse.data);
                        
                        // Bot ha finito di rispondere
                        this.isWaitingForBotResponse = false;
                        
                        // Riabilita input e quick actions
                        ChatbotUI.enableInput();
                        ChatbotUI.enableQuickActions();
                        return;
                    }
                    
                    console.log('📝 Gestendo come messaggio normale');
                } else {
                    // Fallback con risposte simulate
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
                    
                    const responses = [
                        "Perfetta domanda! Ecco le informazioni che cerchi:",
                        "Ottimo interesse! Ti racconto tutto:",
                        "Fantastico! Sono felice di rispondere:",
                        "Grande curiosità! Ecco cosa posso dirti:"
                    ];
                    
                    botResponse = responses[Math.floor(Math.random() * responses.length)];
                }

                this.hideTypingIndicator();
                this.addMessage(botResponse, 'bot');
                
                // Bot ha finito di rispondere
                this.isWaitingForBotResponse = false;
                
                // Riabilita input e quick actions
                ChatbotUI.enableInput();
                ChatbotUI.enableQuickActions();

            } catch (error) {
                console.error('❌ Errore risposta bot da API custom:', error);
                this.hideTypingIndicator();
                this.addMessage('Scusa, c\'è stato un problema. Riprova più tardi.', 'bot');
                
                // Bot ha finito di rispondere (anche in caso di errore)
                this.isWaitingForBotResponse = false;
                
                // Riabilita input e quick actions anche in caso di errore
                ChatbotUI.enableInput();
                ChatbotUI.enableQuickActions();
            }
        },

        /**
         * 🎯 Scopo: Mostra indicatore di typing
         * 📥 Input: Nessuno
         * 📤 Output: Indicatore visibile
         */
        showTypingIndicator() {
            const typingIndicator = ChatbotUI.shadowRoot?.querySelector('.chatbot-typing');
            if (typingIndicator) {
                typingIndicator.classList.add('chatbot-typing--visible');
            }
        },

        /**
         * 🎯 Scopo: Nasconde indicatore di typing
         * 📥 Input: Nessuno
         * 📤 Output: Indicatore nascosto
         */
        hideTypingIndicator() {
            const typingIndicator = ChatbotUI.shadowRoot?.querySelector('.chatbot-typing');
            if (typingIndicator) {
                typingIndicator.classList.remove('chatbot-typing--visible');
            }
        },

        /**
         * 🎯 Scopo: Rimuove messaggio di benvenuto
         * 📥 Input: Nessuno
         * 📤 Output: Messaggio benvenuto rimosso
         */
        removeWelcomeMessage() {
            const welcomeMessage = ChatbotUI.shadowRoot?.querySelector('.chatbot-welcome-message');
            if (welcomeMessage) {
                welcomeMessage.remove();
            }
        },

        /**
         * 🎯 Scopo: Aggiunge card dei vini ai messaggi
         * 📥 Input: wines (array di oggetti vino)
         * 📤 Output: Card vini visualizzate
         */
        addWineCards(wines) {
            if (!wines || !Array.isArray(wines) || wines.length === 0) {
                this.addMessage('Non ho trovato vini da mostrare.', 'bot');
                return;
            }

            // Rimuove messaggio di benvenuto se presente
            this.removeWelcomeMessage();

            // Crea container per le wine cards
            const wineCardsHtml = this.createWineCardsHtml(wines);
            
            // Aggiunge ai messaggi con tutte le informazioni necessarie
            const message = {
                id: Date.now() + Math.random(),
                text: `Ecco ${wines.length} vini disponibili:`,
                type: 'bot',
                timestamp: new Date(),
                isWineCards: true,
                wineCardsHtml: wineCardsHtml,
                wines: wines // Salva anche i dati originali per debug
            };

            this.messages.push(message);
            this.render(); // Usa il sistema normale di rendering



            console.log('🍷 Wine cards aggiunte:', wines.length);
        },

        /**
         * 🎯 Scopo: Crea HTML per le wine cards
         * 📥 Input: wines (array di oggetti vino)
         * 📤 Output: HTML string delle cards
         */
        createWineCardsHtml(wines) {
            let cardsHtml = '<div class="chatbot-wine-cards">';
            
            wines.forEach(wine => {
                cardsHtml += `
                    <div class="chatbot-wine-card">
                        <div class="chatbot-wine-name">${wine.name || 'Nome non disponibile'}</div>
                        <div class="chatbot-wine-details">
                            <div class="chatbot-wine-detail">
                                <span class="chatbot-wine-label">Produttore:</span>
                                <span class="chatbot-wine-value">${wine.producer || 'N/A'}</span>
                            </div>
                            <div class="chatbot-wine-detail">
                                <span class="chatbot-wine-label">Regione:</span>
                                <span class="chatbot-wine-value">${wine.region || 'N/A'}</span>
                            </div>
                            <div class="chatbot-wine-detail">
                                <span class="chatbot-wine-label">Annata:</span>
                                <span class="chatbot-wine-value">${wine.vintage || 'N/A'}</span>
                            </div>
                        </div>
                        ${wine.category ? `<div class="chatbot-wine-category">${wine.category}</div>` : ''}
                    </div>
                `;
            });
            
                        cardsHtml += '</div>';
            return cardsHtml;
        },

        /**
         * 🎯 Scopo: Aggiunge card delle esperienze ai messaggi
         * 📥 Input: experiences (array di oggetti esperienza)
         * 📤 Output: Card esperienze visualizzate
         */
        addExperienceCards(experiences) {
            if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
                this.addMessage('Non ho trovato esperienze da mostrare.', 'bot');
                return;
            }

            // Crea container per le experience cards
            const experienceCardsHtml = this.createExperienceCardsHtml(experiences);
            
            // Aggiunge ai messaggi con tutte le informazioni necessarie
            const message = {
                id: Date.now() + Math.random(),
                text: '', // Nessun testo, solo cards
                type: 'bot',
                timestamp: new Date(),
                isExperienceCards: true,
                experienceCardsHtml: experienceCardsHtml,
                experiences: experiences // Salva anche i dati originali per debug
            };

            this.messages.push(message);
            this.render(); // Usa il sistema normale di rendering

            console.log('🎯 Experience cards aggiunte:', experiences.length);
        },

        /**
         * 🎯 Scopo: Crea HTML per le experience cards
         * 📥 Input: experiences (array di oggetti esperienza)
         * 📤 Output: HTML string delle cards
         */
        createExperienceCardsHtml(experiences) {
            let cardsHtml = '<div class="chatbot-experience-cards">';
            
            experiences.forEach(experience => {
                cardsHtml += `
                    <div class="chatbot-experience-card">
                        <div class="chatbot-experience-title">${experience.title || 'Esperienza non disponibile'}</div>
                        <div class="chatbot-experience-description">${experience.description || ''}</div>
                        <div class="chatbot-experience-details">
                            <div class="chatbot-experience-detail">${experience.duration || ''}</div>
                        </div>
                        <div class="chatbot-experience-price">${experience.price || ''}</div>
                    </div>
                `;
            });
            
            cardsHtml += '</div>';
            return cardsHtml;
        },

 
    };

    /**
     * 🌐 MODULO: ChatbotAPI
     * 🎯 Scopo: Gestisce integrazione API esterna
     * 📋 Responsabilità: Autenticazione, chiamate API, error handling
     */
    const ChatbotAPI = {
        /**
         * 📝 Proprietà del modulo
         */
        token: null,
        baseURL: 'https://macaw-eager-gradually.ngrok-free.app',
        isAuthenticated: false,
        userGUID: null,
        clientId: '89b90056-4cc4-054a-a3db-9a3c0ded7efc', // Default, sarà configurabile

        /**
         * 🎯 Scopo: Genera GUID unico per l'utente
         * 📥 Input: Nessuno
         * 📤 Output: GUID stringa
         */
        generateUserGUID() {
            return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        /**
         * 🎯 Scopo: Inizializza API con GUID utente
         * 📥 Input: clientId (string, opzionale)
         * 📤 Output: API inizializzato
         */
        init(clientId = null) {
            if (clientId) {
                this.clientId = clientId;
            }
            
            this.userGUID = this.generateUserGUID();
            console.log('🆔 GUID utente generato:', this.userGUID);
        },

        /**
         * 🎯 Scopo: Autentica con l'API e ottiene token
         * 📥 Input: Nessuno (usa clientId fisso)
         * 📤 Output: Token di autenticazione salvato
         */
        async authenticate() {
            try {
                console.log('🔑 Autenticazione con API...');
                
                const response = await fetch(`${this.baseURL}/auth/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({
                        clientId: 'discord'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.token) {
                    this.token = data.token;
                    this.isAuthenticated = true;
                    console.log('✅ Autenticazione completata');
                    return true;
                } else {
                    throw new Error('Token non ricevuto nella risposta');
                }

            } catch (error) {
                console.error('❌ Errore autenticazione:', error);
                this.isAuthenticated = false;
                this.token = null;
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Invia messaggio all'API e ottiene risposta bot
         * 📥 Input: message (string)
         * 📤 Output: Risposta del bot
         */
        async sendMessage(message) {
            try {
                if (!this.isAuthenticated || !this.token) {
                    throw new Error('Non autenticato - richiesto login');
                }

                if (!this.userGUID) {
                    throw new Error('GUID utente non generato');
                }

                console.log('📤 Invio messaggio all\'API:', message);

                const response = await fetch(`${this.baseURL}/${this.clientId}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`,
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({
                        text: message,
                        user: this.userGUID,
                        client: this.clientId
                    })
                });

                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('📥 Risposta API ricevuta:', data);
                
                // La risposta è un array di oggetti con struttura: [{user, text, action}]
                if (Array.isArray(data) && data.length > 0) {
                    // Prende il campo 'text' del primo elemento
                    const firstMessage = data[0];
                    if (firstMessage && firstMessage.text) {
                        return firstMessage.text;
                    }
                }
                
                // Fallback se la struttura non è quella attesa
                return data.response || data.text || 'Scusa, non sono riuscito a elaborare la tua richiesta.';

            } catch (error) {
                console.error('❌ Errore invio messaggio:', error);
                // Fallback con risposta locale
                return 'Scusa, c\'è stato un problema di connessione. Riprova più tardi.';
            }
        },

        /**
         * 🎯 Scopo: Invia messaggio a API custom (quick actions)
         * 📥 Input: message (string), customApiUrl (string)
         * 📤 Output: Risposta dell'API custom
         */
        async sendMessageToCustomAPI(message, customApiUrl) {
            try {
                if (!this.isAuthenticated || !this.token) {
                    throw new Error('Non autenticato - richiesto login');
                }

                console.log('📤 Invio messaggio a API custom:', message, 'URL:', customApiUrl);

                const response = await fetch(customApiUrl, {
                    method: 'GET', // Assumendo GET per le API specifiche
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('📥 Risposta API custom ricevuta:', data);
                console.log('🔍 URL chiamata:', customApiUrl);
                
                // Gestione speciale per API wine-knowledge/wines
                if (customApiUrl.includes('wine-knowledge/wines') && data.wines && Array.isArray(data.wines)) {
                    console.log('✅ Riconosciuto come wine API');
                    return { type: 'wines', data: data.wines };
                }
                
                // Gestione speciale per API experiences
                if (customApiUrl.includes('api/winery/experiences') && data.reply && data.cards && Array.isArray(data.cards)) {
                    console.log('✅ Riconosciuto come experience API');
                    return { type: 'experiences', reply: data.reply, data: data.cards };
                }
                
                console.log('❌ Nessuna API riconosciuta, usando fallback');
                
                // Se la risposta è un array, prende il primo elemento
                if (Array.isArray(data) && data.length > 0) {
                    const firstMessage = data[0];
                    if (firstMessage && firstMessage.text) {
                        return firstMessage.text;
                    }
                }
                
                // Se è un oggetto diretto
                if (data && data.text) {
                    return data.text;
                }
                
                // Se è una stringa diretta
                if (typeof data === 'string') {
                    return data;
                }
                
                // Fallback
                return data.response || data.message || 'Scusa, non sono riuscito a elaborare la tua richiesta.';

            } catch (error) {
                console.error('❌ Errore invio a API custom:', error);
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Verifica stato connessione API
         * 📥 Input: Nessuno
         * 📤 Output: boolean stato connessione
         */
        isConnected() {
            return this.isAuthenticated && this.token !== null;
        },

        /**
         * 🎯 Scopo: Reset autenticazione
         * 📥 Input: Nessuno
         * 📤 Output: Stato resettato
         */
        reset() {
            this.token = null;
            this.isAuthenticated = false;
            this.userGUID = null;
            console.log('🔄 API reset completato');
        }
    };

    /**
     * ⚙️ MODULO: ChatbotConfig
     * 🎯 Scopo: Gestisce configurazione del chatbot
     * 📋 Responsabilità: Opzioni default, merge configurazioni, validazione
     */
    const ChatbotConfig = {
        /**
         * 📝 Configurazione di default
         */
        defaults: {
            language: 'it',
            position: 'bottom-right',
            theme: 'light',
            clientId: '89b90056-4cc4-054a-a3db-9a3c0ded7efc',
            apiEndpoint: null,
            welcomeMessage: 'Ciao! 👋 Sono il tuo assistente virtuale. Come posso aiutarti oggi?'
        },

        current: {},

        /**
         * 🎯 Scopo: Unisce configurazione utente con defaults
         * 📥 Input: userConfig (object)
         * 📤 Output: Configurazione finale
         */
        merge(userConfig = {}) {
            this.current = {
                ...this.defaults,
                ...userConfig
            };
            
            console.log('⚙️ Configurazione applicata:', this.current);
            return this.current;
        }
    };

    /**
     * 🤖 MODULO: ChatbotCore
     * 🎯 Scopo: Orchestratore principale
     * 📋 Responsabilità: Inizializzazione, API pubblica, lifecycle management
     */
    const ChatbotCore = {
        /**
         * 📝 Proprietà del modulo
         */
        isInitialized: false,
        container: null,

        /**
         * 🎯 Scopo: Inizializza chatbot completo
         * 📥 Input: config (object)
         * 📤 Output: Chatbot funzionante
         * 🔧 Esempio: await ChatbotCore.init({ language: 'it' })
         */
        async init(config = {}) {
            try {
                console.log('🚀 Inizializzazione Chatbot Core...');

                // Previeni inizializzazione multipla
                if (this.isInitialized) {
                    console.warn('⚠️ Chatbot già inizializzato');
                    return false;
                }

                // Applica configurazione
                ChatbotConfig.merge(config);

                // Crea container se non esiste
                this.container = document.createElement('div');
                this.container.className = 'chatbot-container';
                document.body.appendChild(this.container);

                // Inizializza UI
                await ChatbotUI.init(this.container);

                // Inizializza e autentica API
                try {
                    ChatbotAPI.init(config.clientId);
                    await ChatbotAPI.authenticate();
                } catch (error) {
                    console.warn('⚠️ Continuo senza API - modalità offline');
                }

                this.isInitialized = true;
                console.log('✅ Chatbot inizializzato con successo!');

                // Test isolamento stili
                this.testStyleIsolation();

                return true;

            } catch (error) {
                console.error('❌ Errore inizializzazione Chatbot:', error);
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Testa isolamento stili Shadow DOM
         * 📥 Input: Nessuno
         * 📤 Output: Log risultati test
         */
        testStyleIsolation() {
            console.log('🧪 Test isolamento Shadow DOM:');
            
            // Test 1: Verifica Shadow DOM
            const shadowRoot = this.container?.shadowRoot;
            console.log('Shadow DOM presente:', !!shadowRoot);
            
            // Test 2: Verifica isolamento CSS
            const hostStyles = getComputedStyle(document.body);
            const shadowStyles = shadowRoot ? getComputedStyle(shadowRoot.querySelector('.chatbot-toggle')) : null;
            
            console.log('Stili host isolati:', hostStyles.color !== shadowStyles?.color);
            console.log('✅ Test isolamento completato');
        },

        /**
         * 🎯 Scopo: Distrugge chatbot e pulisce risorse
         * 📥 Input: Nessuno
         * 📤 Output: Chatbot rimosso
         */
        destroy() {
            try {
                if (!this.isInitialized) {
                    console.warn('⚠️ Chatbot non inizializzato');
                    return;
                }

                // Rimuovi container dal DOM
                if (this.container && this.container.parentNode) {
                    this.container.parentNode.removeChild(this.container);
                }

                // Reset proprietà
                this.isInitialized = false;
                this.container = null;
                ChatbotUI.shadowRoot = null;
                ChatbotUI.isVisible = false;
                ChatbotMessages.messages = [];
                ChatbotAPI.reset();

                console.log('✅ Chatbot distrutto con successo');

            } catch (error) {
                console.error('❌ Errore durante distruzione:', error);
            }
        },

        /**
         * 🎯 Scopo: Verifica se chatbot è inizializzato
         * 📥 Input: Nessuno
         * 📤 Output: boolean
         */
        get isInitialized() {
            return this._initialized || false;
        },

        set isInitialized(value) {
            this._initialized = value;
        }
    };

    /**
     * 🌐 API PUBBLICA GLOBALE
     * 🎯 Scopo: Interfaccia pubblica per integrazione
     */
    window.Chatbot = {
        /**
         * 🎯 Scopo: Inizializza chatbot
         * 📥 Input: config (object)
         * 📤 Output: Promise<boolean>
         */
        async init(config = {}) {
            return await ChatbotCore.init(config);
        },

        /**
         * 🎯 Scopo: Distrugge chatbot
         * 📥 Input: Nessuno
         * 📤 Output: void
         */
        destroy() {
            ChatbotCore.destroy();
        },

        /**
         * 🎯 Scopo: Verifica stato inizializzazione
         * 📥 Input: Nessuno
         * 📤 Output: boolean
         */
        get isInitialized() {
            return ChatbotCore.isInitialized;
        },

        /**
         * 🛠️ API di debug (solo sviluppo)
         * 📥 Input: Nessuno
         * 📤 Output: Oggetti interni
         */
        _debug: {
            ui: ChatbotUI,
            messages: ChatbotMessages,
            config: ChatbotConfig,
            api: ChatbotAPI,
            core: ChatbotCore
        }
    };

    console.log('🤖 Chatbot Web Iniettabile caricato - Pronto per window.Chatbot.init()');

})(); 