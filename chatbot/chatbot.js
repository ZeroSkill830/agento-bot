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
        async loadTemplate() {
            try {
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
                
            } catch (error) {
                console.error('❌ Errore caricamento template:', error);
                throw error;
            }
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
                    sendButton.disabled = !hasText;
                });

                // Gestione Enter key
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.value.trim()) {
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

            // Aggiungi messaggio utente
            ChatbotMessages.addMessage(message, 'user');
            
            // Reset input
            input.value = '';
            sendButton.disabled = true;
            
            // Simula risposta bot
            ChatbotMessages.simulateBotResponse();
            
            console.log('📤 Messaggio inviato:', message);
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
            contentDiv.textContent = message.text;

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
         * 🎯 Scopo: Simula risposta automatica del bot
         * 📥 Input: Nessuno
         * 📤 Output: Risposta bot dopo delay
         */
        simulateBotResponse() {
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

            this.showTypingIndicator();

            setTimeout(() => {
                this.hideTypingIndicator();
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addMessage(randomResponse, 'bot');
            }, Math.random() * 2000 + 1000); // 1-3 secondi
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
            core: ChatbotCore
        }
    };

    console.log('🤖 Chatbot Web Iniettabile caricato - Pronto per window.Chatbot.init()');

})(); 