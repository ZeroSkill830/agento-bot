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
                <button class="chatbot-toggle" aria-label="${ChatbotConfig.t('toggleLabel')}" type="button">
                    <svg class="chatbot-toggle-icon" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                </button>

                <!-- Finestra Chatbot -->
                <div class="chatbot-window" aria-hidden="true" role="dialog" aria-labelledby="chatbot-title">
                    <!-- Header -->
                    <header class="chatbot-header">
                        <h2 class="chatbot-title" id="chatbot-title">${ChatbotConfig.t('title')}</h2>
                        <div class="chatbot-header-controls">
                            <!-- Selettore Lingua -->
                            <div class="chatbot-language-selector">
                                <button class="chatbot-language-toggle" aria-label="Seleziona lingua" type="button">
                                    <span class="chatbot-language-current">IT</span>
                                    <svg class="chatbot-language-arrow" viewBox="0 0 24 24">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </button>
                                <div class="chatbot-language-dropdown" role="menu">
                                    <button class="chatbot-language-option" data-lang="it" role="menuitem">
                                        <span class="chatbot-language-flag">🇮🇹</span>
                                        <span class="chatbot-language-name">Italiano</span>
                                    </button>
                                    <button class="chatbot-language-option" data-lang="en" role="menuitem">
                                        <span class="chatbot-language-flag">🇬🇧</span>
                                        <span class="chatbot-language-name">English</span>
                                    </button>
                                </div>
                            </div>
                            <button class="chatbot-close" aria-label="${ChatbotConfig.t('closeLabel')}" type="button">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>
                    </header>

                    <!-- Area Messaggi -->
                    <div class="chatbot-messages" role="log" aria-live="polite" aria-label="Cronologia conversazione">
                        <div class="chatbot-welcome-message chatbot-message chatbot-message--bot">
                            <div class="chatbot-message-content">
                                ${ChatbotConfig.t('welcomeMessage')}
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
                        <span class="chatbot-typing-text">${ChatbotConfig.t('typing')}</span>
                    </div>

                    <!-- Quick Actions -->
                    <div class="chatbot-quick-actions">
                        <button class="chatbot-quick-action" data-text="${ChatbotConfig.t('quickAction1')}" data-api-url="https://macaw-eager-gradually.ngrok-free.app/api/winery/experiences">
                            ${ChatbotConfig.t('quickAction1')}
                        </button>
                        <button class="chatbot-quick-action" data-text="${ChatbotConfig.t('quickAction2')}" data-api-url="https://macaw-eager-gradually.ngrok-free.app/api/wine-knowledge/wines">
                            ${ChatbotConfig.t('quickAction2')}
                        </button>
                    </div>

                    <!-- Area Input -->
                    <div class="chatbot-input-area">
                        <form class="chatbot-input-form">
                            <div class="chatbot-input-container">
                                <input 
                                    type="text" 
                                    class="chatbot-input" 
                                    placeholder="${ChatbotConfig.t('placeholder')}" 
                                    autocomplete="off"
                                    aria-label="${ChatbotConfig.t('placeholder')}"
                                    maxlength="500"
                                />
                                <button 
                                    type="submit" 
                                    class="chatbot-send-button" 
                                    disabled 
                                    aria-label="${ChatbotConfig.t('sendLabel')}"
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
                        <div class="chatbot-powered">${ChatbotConfig.t('powered')}</div>
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
                  width: 500px; height: 800px;
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
            // Controlla se c'è un overlay di degustazione (livello, preview, o chat) e rimuovilo
            const tastingOverlay = this.shadowRoot.querySelector('.chatbot-tasting-overlay');
            if (tastingOverlay) {
                console.log('🍷 Overlay di degustazione rilevato, rimozione in corso...');
                ChatbotTasting.removeOverlay();
                // Reset stato degustazione se era attiva
                if (ChatbotTasting.isActive) {
                    ChatbotTasting.isActive = false;
                    ChatbotTasting.currentTasting = null;
                    ChatbotTasting.currentWineName = null;
                    ChatbotTasting.currentWineId = null;
                    ChatbotTasting.currentWineIndex = null;
                }
            }
            
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

            // Event listeners per selettore lingua
            const languageToggle = this.shadowRoot.querySelector('.chatbot-language-toggle');
            const languageDropdown = this.shadowRoot.querySelector('.chatbot-language-dropdown');
            const languageOptions = this.shadowRoot.querySelectorAll('.chatbot-language-option');

            // Toggle dropdown
            if (languageToggle && languageDropdown) {
                languageToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = languageDropdown.style.display === 'block';
                    languageDropdown.style.display = isVisible ? 'none' : 'block';
                    
                    // Toggle arrow rotation
                    const arrow = languageToggle.querySelector('.chatbot-language-arrow');
                    if (arrow) {
                        arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
                        arrow.style.transition = 'transform 0.2s ease';
                    }
                });

                // Handle language selection
                languageOptions.forEach(option => {
                    option.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const newLanguage = option.getAttribute('data-lang');
                        if (newLanguage && ChatbotConfig.setLanguage(newLanguage)) {
                            // Close dropdown
                            languageDropdown.style.display = 'none';
                            
                            // Reset arrow
                            const arrow = languageToggle.querySelector('.chatbot-language-arrow');
                            if (arrow) {
                                arrow.style.transform = 'rotate(0deg)';
                            }
                            
                            console.log(`🌐 Lingua cambiata a: ${newLanguage}`);
                        }
                    });
                });

                // Close dropdown when clicking outside
                this.shadowRoot.addEventListener('click', () => {
                    if (languageDropdown.style.display === 'block') {
                        languageDropdown.style.display = 'none';
                        const arrow = languageToggle.querySelector('.chatbot-language-arrow');
                        if (arrow) {
                            arrow.style.transform = 'rotate(0deg)';
                        }
                    }
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
            let hasWineCards = false;
            this.messages.forEach(message => {
                const messageElement = this.createMessageElement(message);
                messagesContainer.appendChild(messageElement);
                
                if (message.isWineCards) {
                    hasWineCards = true;
                }
            });

            // Configura event listeners per wine cards se presenti
            if (hasWineCards) {
                setTimeout(() => this.setupWineCardListeners(), 100);
            }

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
            // Gestione speciale per tasting actions
            else if (message.isTastingActions && message.actionsHtml) {
                contentDiv.innerHTML = message.actionsHtml;
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
         * 🎯 Scopo: Crea HTML per le wine cards con design moderno
         * 📥 Input: wines (array di oggetti vino)
         * 📤 Output: HTML string delle cards
         */
        createWineCardsHtml(wines) {
            let cardsHtml = '<div class="chatbot-wine-cards">';
            
            wines.forEach((wine, index) => {
                cardsHtml += `
                    <div class="chatbot-wine-card" data-wine-name="${wine.name || ''}" data-wine-id="${wine.id || ''}" data-wine-index="${index}">
                        ${wine.vintage ? `<div class="chatbot-wine-vintage-badge">${wine.vintage}</div>` : ''}
                        <div class="chatbot-wine-name">${wine.name || 'Nome non disponibile'}</div>
                        <div class="chatbot-wine-producer">${wine.producer || 'Produttore sconosciuto'}</div>
                        <div class="chatbot-wine-details">
                            ${wine.region ? `<div class="chatbot-wine-chip">📍 ${wine.region}</div>` : ''}
                            ${wine.type ? `<div class="chatbot-wine-chip">🍇 ${wine.type}</div>` : ''}
                            ${wine.category ? `<div class="chatbot-wine-chip">⭐ ${wine.category}</div>` : ''}
                        </div>
                    </div>
                `;
            });
            
            cardsHtml += '</div>';
            return cardsHtml;
        },

        /**
         * 🎯 Scopo: Configura event listeners per wine cards dopo il render
         * 📥 Input: Nessuno
         * 📤 Output: Event listeners configurati
         */
        setupWineCardListeners() {
            const wineCards = ChatbotUI.shadowRoot.querySelectorAll('.chatbot-wine-card');
            wineCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    const wineName = card.getAttribute('data-wine-name');
                    const wineId = card.getAttribute('data-wine-id');
                    const wineIndex = card.getAttribute('data-wine-index');
                    
                    if (wineName && wineId) {
                        console.log('🍷 Wine card clicked:', wineName, 'ID:', wineId);
                        ChatbotTasting.startTasting(wineName, wineIndex, wineId);
                    }
                });
            });
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
                        client: this.clientId,
                        language: ChatbotConfig.current.language || 'it'
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
    /**
     * 🍷 MODULO: ChatbotTasting
     * 🎯 Scopo: Gestisce il flusso di degustazione vino
     * 📋 Responsabilità: Overlay selezione livello, API tasting, gestione stages
     */
    const ChatbotTasting = {
        /**
         * 📝 Proprietà del modulo
         */
        currentTasting: null,
        currentWineName: null,
        currentWineId: null,
        currentWineIndex: null,
        isActive: false,

        /**
         * 🎯 Scopo: Avvia flusso di degustazione vino
         * 📥 Input: wineName (string), wineIndex (number), wineId (string)
         * 📤 Output: Overlay selezione livello visualizzato
         */
        startTasting(wineName, wineIndex, wineId) {
            console.log('🍷 Avvio degustazione per:', wineName, 'ID:', wineId);
            this.currentWineName = wineName;
            this.currentWineId = wineId;
            this.currentWineIndex = wineIndex;
            this.showLevelSelector();
        },

        /**
         * 🎯 Scopo: Mostra overlay per selezione livello (principiante/esperto)
         * 📥 Input: Nessuno
         * 📤 Output: Overlay visualizzato
         */
        showLevelSelector() {
            this.createOverlay('level-selector', `
                <div class="chatbot-tasting-overlay-content">
                    <h2 class="chatbot-tasting-title">${ChatbotConfig.t('selectLevel')}</h2>
                    <div class="chatbot-level-cards">
                        <div class="chatbot-level-card" data-level="beginner">
                            <div class="chatbot-level-icon">🌱</div>
                            <h3 class="chatbot-level-name">${ChatbotConfig.t('beginner')}</h3>
                            <p class="chatbot-level-description">${ChatbotConfig.t('beginnerDesc')}</p>
                        </div>
                        <div class="chatbot-level-card" data-level="expert">
                            <div class="chatbot-level-icon">🍷</div>
                            <h3 class="chatbot-level-name">${ChatbotConfig.t('expert')}</h3>
                            <p class="chatbot-level-description">${ChatbotConfig.t('expertDesc')}</p>
                        </div>
                    </div>
                </div>
            `);

            // Setup event listeners per selezione livello
            const levelCards = ChatbotUI.shadowRoot.querySelectorAll('.chatbot-level-card');
            levelCards.forEach(card => {
                card.addEventListener('click', () => {
                    const level = card.getAttribute('data-level');
                    this.selectLevel(level);
                });
            });
        },

        /**
         * 🎯 Scopo: Gestisce selezione livello e chiamata API
         * 📥 Input: level (string) - 'beginner' o 'expert'
         * 📤 Output: Chiamata API e passaggio al prossimo step
         */
        async selectLevel(level) {
            console.log('📝 Livello selezionato:', level);
            
            try {
                this.removeOverlay();
                this.showLoadingOverlay();

                // Chiamata API tasting
                const tastingData = await this.callTastingAPI(level);
                
                this.removeOverlay();
                this.currentTasting = tastingData;
                this.showStagePreview();

            } catch (error) {
                console.error('❌ Errore selezione livello:', error);
                this.removeOverlay();
                this.showErrorOverlay('Errore durante l\'avvio della degustazione. Riprova.');
            }
        },

        /**
         * 🎯 Scopo: Chiama API per iniziare degustazione
         * 📥 Input: level (string), stage (string, opzionale)
         * 📤 Output: Dati degustazione dalla API
         */
        async callTastingAPI(level, stage = 'visual') {
            if (!ChatbotAPI.isAuthenticated) {
                throw new Error('API non autenticata');
            }

            const payload = {
                language: ChatbotConfig.current.language || 'it',
                mode: level, // 'beginner' o 'expert'
                userId: ChatbotAPI.userGUID,
                wineName: this.currentWineId,
                stage: stage
            };

            console.log('📡 Payload tasting API:', payload);

            const response = await fetch(`${ChatbotAPI.baseURL}/api/wine-tasting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ChatbotAPI.token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Errore API: ${response.status}`);
            }

            return await response.json();
        },

        /**
         * 🎯 Scopo: Mostra overlay con anteprima stage corrente
         * 📥 Input: Nessuno
         * 📤 Output: Overlay stage preview visualizzato
         */
        showStagePreview() {
            if (!this.currentTasting) return;

            const { currentStage, previewText } = this.currentTasting;

            this.createOverlay('stage-preview', `
                <div class="chatbot-tasting-overlay-content">
                    <h2 class="chatbot-tasting-title">${ChatbotConfig.t('stage')}: ${currentStage}</h2>
                    <p class="chatbot-stage-description">${previewText || 'Iniziamo questa fase della degustazione.'}</p>
                    <div class="chatbot-stage-actions">
                        <button class="chatbot-stage-button chatbot-stage-start" data-action="start">
                            ${ChatbotConfig.t('start')}
                        </button>
                    </div>
                </div>
            `);

            // Setup event listener per bottone start
            const startButton = ChatbotUI.shadowRoot.querySelector('.chatbot-stage-start');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    this.startStage();
                });
            }
        },

        /**
         * 🎯 Scopo: Avvia stage di degustazione
         * 📥 Input: Nessuno
         * 📤 Output: Overlay rimosso, chat di degustazione mostrata
         */
        startStage() {
            this.removeOverlay();
            this.isActive = true;
            this.showTastingChat();
        },

        /**
         * 🎯 Scopo: Mostra overlay chat dedicato per la degustazione
         * 📥 Input: Nessuno
         * 📤 Output: Chat di degustazione visualizzata
         */
        showTastingChat() {
            if (!this.currentTasting) return;

            const { currentStage } = this.currentTasting;

            this.createOverlay('tasting-chat', `
                <div class="chatbot-tasting-chat-container">
                    <div class="chatbot-tasting-chat-header">
                        <h3 class="chatbot-tasting-chat-title">${ChatbotConfig.t('stage')}: ${currentStage}</h3>
                        <button class="chatbot-tasting-chat-close" id="tasting-close-button">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="chatbot-tasting-messages" id="tasting-messages"></div>
                    
                    <!-- Typing indicator - IDENTICO alla chat principale -->
                    <div class="chatbot-typing" id="tasting-typing-indicator" style="display: none;">
                        <div class="chatbot-typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="chatbot-typing-text">${ChatbotConfig.t('typing')}</div>
                    </div>
                    
                    <!-- Area azioni degustazione -->
                    <div class="chatbot-tasting-actions" id="tasting-actions-area" style="display: none;">
                        <!-- Il bottone continua sarà aggiunto qui dinamicamente -->
                    </div>
                    
                    <!-- Area input - IDENTICA alla chat principale -->
                    <div class="chatbot-input-area" id="tasting-input-area" style="display: none;">
                        <form class="chatbot-input-form" id="tasting-input-form">
                            <div class="chatbot-input-container">
                                <input 
                                    type="text" 
                                    class="chatbot-input" 
                                    id="tasting-input"
                                    placeholder="${ChatbotConfig.t('placeholder')}" 
                                    autocomplete="off"
                                >
                                <button 
                                    type="submit" 
                                    class="chatbot-send-button" 
                                    id="tasting-send-button"
                                    aria-label="${ChatbotConfig.t('sendLabel')}"
                                    disabled
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `);

            // Avvia i messaggi dopo un breve delay
            setTimeout(() => {
                // Setup event listeners dopo che l'HTML è renderizzato
                this.setupTastingInputListeners();
                this.showStageMessages();
            }, 300);
        },

        /**
         * 🎯 Scopo: Mostra messaggi dello stage automaticamente nella chat di degustazione
         * 📥 Input: Nessuno
         * 📤 Output: Messaggi mostrati con delay nella chat dedicata
         */
        async showStageMessages() {
            if (!this.currentTasting || !this.currentTasting.chunks) return;

            const chunks = this.currentTasting.chunks;
            const messagesContainer = ChatbotUI.shadowRoot.querySelector('#tasting-messages');
            
            if (!messagesContainer) {
                console.error('❌ Container messaggi degustazione non trovato');
                return;
            }

            console.log('📝 Mostrando chunks stage:', chunks.length);

            // Mostra ogni chunk con delay
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                
                // Delay prima di ogni messaggio
                await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 2000));
                
                // Mostra typing indicator
                this.showTastingTyping(messagesContainer);
                
                // Delay per il typing
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Nascondi typing e mostra messaggio
                this.hideTastingTyping(messagesContainer);
                this.addTastingMessage(messagesContainer, chunk.text);
            }

            // Mostra input per permettere interazione
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showTastingInput();
            
            // Mostra bottone continua nel footer dopo tutti i messaggi
            this.showTastingContinueButton();
        },

        /**
         * 🎯 Scopo: Aggiunge messaggio alla chat di degustazione (STESSO STILE CHAT PRINCIPALE)
         * 📥 Input: container, text
         * 📤 Output: Messaggio aggiunto
         */
        addTastingMessage(container, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chatbot-message chatbot-message--bot';
            messageDiv.setAttribute('data-message-id', Date.now() + Math.random());

            const contentDiv = document.createElement('div');
            contentDiv.className = 'chatbot-message-content';
            contentDiv.textContent = text;

            const timeDiv = document.createElement('div');
            timeDiv.className = 'chatbot-message-time';
            timeDiv.textContent = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            
            container.appendChild(messageDiv);
            container.scrollTop = container.scrollHeight;
        },

        /**
         * 🎯 Scopo: Mostra typing indicator nella chat di degustazione (FISSO IN BASSO)
         * 📥 Input: container
         * 📤 Output: Typing indicator mostrato
         */
        showTastingTyping(container) {
            const typingIndicator = ChatbotUI.shadowRoot.querySelector('#tasting-typing-indicator');
            if (typingIndicator) {
                typingIndicator.style.display = 'flex';
            }
        },

        /**
         * 🎯 Scopo: Nasconde typing indicator nella chat di degustazione
         * 📥 Input: container
         * 📤 Output: Typing indicator nascosto
         */
        hideTastingTyping(container) {
            const typingIndicator = ChatbotUI.shadowRoot.querySelector('#tasting-typing-indicator');
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
        },

        /**
         * 🎯 Scopo: Mostra bottone continua nell'area azioni footer
         * 📥 Input: Nessuno
         * 📤 Output: Bottone aggiunto nel footer
         */
        showTastingContinueButton() {
            const actionsArea = ChatbotUI.shadowRoot.querySelector('#tasting-actions-area');
            if (!actionsArea) {
                console.error('❌ Area azioni degustazione non trovata');
                return;
            }

            // Se il nextStage è "feedback", considera la degustazione come terminata
            const hasNextStage = this.currentTasting.nextStage && this.currentTasting.nextStage !== 'feedback';
            const buttonText = hasNextStage ? ChatbotConfig.t('continue') : ChatbotConfig.t('endTasting');
            
            // Pulisci area azioni precedenti
            actionsArea.innerHTML = '';
            
            // Crea il bottone con icona animata
            const iconSvg = hasNextStage ? 
                `<svg class="chatbot-continue-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>` : 
                `<svg class="chatbot-continue-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>`;
            
            actionsArea.innerHTML = `
                <button 
                    class="chatbot-continue-button ${hasNextStage ? 'chatbot-continue-button--continue' : 'chatbot-continue-button--end'}" 
                    data-action="${hasNextStage ? 'continue' : 'end'}"
                    aria-label="${buttonText}"
                    title="${buttonText}"
                >
                    <span class="chatbot-continue-text">${buttonText}</span>
                    ${iconSvg}
                </button>
            `;

            // Mostra l'area azioni
            actionsArea.style.display = 'flex';

            // Setup event listener per bottone
            const continueButton = actionsArea.querySelector('.chatbot-continue-button');
            if (continueButton) {
                continueButton.addEventListener('click', () => {
                    const action = continueButton.getAttribute('data-action');
                    if (action === 'continue') {
                        this.continueToNextStage();
                    } else {
                        this.endTasting();
                    }
                });
            }
        },

        /**
         * 🎯 Scopo: Mostra input area per interazione utente
         * 📥 Input: Nessuno
         * 📤 Output: Input area visibile
         */
        showTastingInput() {
            const inputArea = ChatbotUI.shadowRoot.querySelector('#tasting-input-area');
            if (inputArea) {
                inputArea.style.display = 'block';
            }
        },

        /**
         * 🎯 Scopo: Setup event listeners per input di degustazione
         * 📥 Input: Nessuno
         * 📤 Output: Event listeners configurati
         */
        setupTastingInputListeners() {
            const form = ChatbotUI.shadowRoot.querySelector('#tasting-input-form');
            const input = ChatbotUI.shadowRoot.querySelector('#tasting-input');
            const sendButton = ChatbotUI.shadowRoot.querySelector('#tasting-send-button');
            const closeButton = ChatbotUI.shadowRoot.querySelector('#tasting-close-button');

            // Close button
            if (closeButton) {
                console.log('✅ Bottone close trovato, configurando event listener');
                closeButton.addEventListener('click', () => {
                    console.log('🔥 Click bottone close rilevato');
                    this.endTasting();
                });
            } else {
                console.error('❌ Bottone close non trovato!');
            }

            if (form && input && sendButton) {
                // Form submit
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleTastingMessageSubmit();
                });

                // Input events
                input.addEventListener('input', () => {
                    sendButton.disabled = input.value.trim().length === 0;
                });

                // Enter key
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.value.trim().length > 0) {
                            this.handleTastingMessageSubmit();
                        }
                    }
                });
            }
        },

        /**
         * 🎯 Scopo: Gestisce invio messaggio nella chat di degustazione
         * 📥 Input: Nessuno
         * 📤 Output: Messaggio inviato e risposta API
         */
        async handleTastingMessageSubmit() {
            const input = ChatbotUI.shadowRoot.querySelector('#tasting-input');
            const sendButton = ChatbotUI.shadowRoot.querySelector('#tasting-send-button');
            const messagesContainer = ChatbotUI.shadowRoot.querySelector('#tasting-messages');

            if (!input || !sendButton || !messagesContainer) return;

            const message = input.value.trim();
            if (!message) return;

            // Disabilita input durante invio
            sendButton.disabled = true;
            input.disabled = true;

            // Aggiungi messaggio utente
            this.addTastingUserMessage(messagesContainer, message);
            
            // Reset input
            input.value = '';

            try {
                // Mostra typing indicator
                this.showTastingTyping();
                
                // Chiamata API feedback
                const response = await this.callFeedbackAPI(message);
                
                // Nasconde typing indicator
                this.hideTastingTyping();
                
                // Mostra risposta bot (se presente)
                if (response && response.responseToFeedback) {
                    this.addTastingMessage(messagesContainer, response.responseToFeedback);
                }
                
            } catch (error) {
                console.error('❌ Errore invio feedback:', error);
                this.hideTastingTyping();
                this.addTastingMessage(messagesContainer, 'Scusa, c\'è stato un problema. Riprova più tardi.');
            } finally {
                // Riabilita input
                input.disabled = false;
                input.focus();
            }
        },

        /**
         * 🎯 Scopo: Aggiunge messaggio utente alla chat di degustazione
         * 📥 Input: container, text
         * 📤 Output: Messaggio utente aggiunto
         */
        addTastingUserMessage(container, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chatbot-message chatbot-message--user';
            messageDiv.setAttribute('data-message-id', Date.now() + Math.random());

            const contentDiv = document.createElement('div');
            contentDiv.className = 'chatbot-message-content';
            contentDiv.textContent = text;

            const timeDiv = document.createElement('div');
            timeDiv.className = 'chatbot-message-time';
            timeDiv.textContent = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            
            container.appendChild(messageDiv);
            container.scrollTop = container.scrollHeight;
        },

        /**
         * 🎯 Scopo: Chiama API feedback per messaggio utente
         * 📥 Input: feedbackText (string)
         * 📤 Output: Risposta API
         */
        async callFeedbackAPI(feedbackText) {
            if (!ChatbotAPI.isAuthenticated || !this.currentTasting) {
                throw new Error('API non autenticata o degustazione non attiva');
            }

            const payload = {
                sessionId: ChatbotAPI.userGUID,
                wineName: this.currentWineId,
                stage: this.currentTasting.currentStage,
                feedbackType: "stage",
                feedbackText: feedbackText
            };

            console.log('📡 Payload feedback API:', payload);

            const response = await fetch(`${ChatbotAPI.baseURL}/api/wine-tasting/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ChatbotAPI.token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Errore API feedback: ${response.status}`);
            }

            return await response.json();
        },

        /**
         * 🎯 Scopo: Continua al prossimo stage
         * 📥 Input: Nessuno
         * 📤 Output: Chiamata API per prossimo stage o termina se feedback
         */
        async continueToNextStage() {
            // Se non c'è nextStage o è "feedback", termina la degustazione
            if (!this.currentTasting.nextStage || this.currentTasting.nextStage === 'feedback') {
                this.endTasting();
                return;
            }

            try {
                // Nascondi l'area azioni prima di procedere
                const actionsArea = ChatbotUI.shadowRoot.querySelector('#tasting-actions-area');
                if (actionsArea) {
                    actionsArea.style.display = 'none';
                }

                // Rimuovi overlay chat corrente e mostra loading
                this.removeOverlay();
                this.showLoadingOverlay();

                // Chiamata API per prossimo stage
                const nextStageData = await this.callTastingAPI(this.currentTasting.mode || 'beginner', this.currentTasting.nextStage);
                
                this.removeOverlay();
                this.currentTasting = nextStageData;
                this.showStagePreview();

            } catch (error) {
                console.error('❌ Errore prossimo stage:', error);
                this.removeOverlay();
                this.showErrorOverlay('Errore durante il caricamento del prossimo stage.');
            }
        },

        /**
         * 🎯 Scopo: Termina degustazione
         * 📥 Input: Nessuno
         * 📤 Output: Overlay chiuso, ritorno al chatbot normale
         */
        endTasting() {
            console.log('✅ Degustazione terminata');
            
            // Nascondi l'area azioni se presente
            const actionsArea = ChatbotUI.shadowRoot.querySelector('#tasting-actions-area');
            if (actionsArea) {
                actionsArea.style.display = 'none';
            }
            
            // Rimuovi overlay prima di tutto
            this.removeOverlay();
            
            // Reset stato degustazione
            this.isActive = false;
            this.currentTasting = null;
            this.currentWineName = null;
            this.currentWineId = null;
            this.currentWineIndex = null;
            
            // Mostra messaggio di fine degustazione
            ChatbotMessages.addMessage(ChatbotConfig.t('tastingCompleted'), 'bot');
            
            // Ripristina chatbot normale
            ChatbotConfig.updateWelcomeMessage();
        },

        /**
         * 🎯 Scopo: Crea overlay generico
         * 📥 Input: type (string), content (string)
         * 📤 Output: Overlay visualizzato
         */
        createOverlay(type, content) {
            this.removeOverlay(); // Rimuovi overlay precedenti

            const overlay = document.createElement('div');
            overlay.className = `chatbot-tasting-overlay chatbot-tasting-overlay--${type}`;
            overlay.innerHTML = content;

            ChatbotUI.shadowRoot.appendChild(overlay);
        },

        /**
         * 🎯 Scopo: Mostra overlay di caricamento
         * 📥 Input: Nessuno
         * 📤 Output: Overlay loading visualizzato
         */
        showLoadingOverlay() {
            this.createOverlay('loading', `
                <div class="chatbot-tasting-overlay-content">
                    <div class="chatbot-loading-spinner"></div>
                    <p class="chatbot-loading-text">${ChatbotConfig.t('loading')}</p>
                </div>
            `);
        },

        /**
         * 🎯 Scopo: Mostra overlay di errore
         * 📥 Input: message (string)
         * 📤 Output: Overlay errore visualizzato
         */
        showErrorOverlay(message) {
            this.createOverlay('error', `
                <div class="chatbot-tasting-overlay-content">
                    <h2 class="chatbot-error-title">${ChatbotConfig.t('error')}</h2>
                    <p class="chatbot-error-message">${message}</p>
                    <button class="chatbot-error-close" onclick="ChatbotTasting.removeOverlay()">
                        ${ChatbotConfig.t('close')}
                    </button>
                </div>
            `);
        },

        /**
         * 🎯 Scopo: Rimuove overlay corrente
         * 📥 Input: Nessuno
         * 📤 Output: Overlay rimosso
         */
        removeOverlay() {
            const overlay = ChatbotUI.shadowRoot.querySelector('.chatbot-tasting-overlay');
            if (overlay) {
                overlay.remove();
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
            clientId: '89b90056-4cc4-054a-a3db-9a3c0ded7efc',
            apiEndpoint: null,
            welcomeMessage: 'Ciao! 👋 Sono il tuo assistente virtuale. Come posso aiutarti oggi?'
        },

        current: {},

        /**
         * 🌐 Testi multilingua
         */
        translations: {
            it: {
                title: 'Assistente Virtuale',
                welcomeMessage: 'Ciao! 👋 Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
                placeholder: 'Scrivi un messaggio...',
                typing: 'L\'assistente sta scrivendo...',
                toggleLabel: 'Apri chat',
                closeLabel: 'Chiudi chat',
                sendLabel: 'Invia messaggio',
                quickAction1: 'Organizzate visite?',
                quickAction2: 'Degustiamo insieme?',
                powered: 'Powered by Chatbot v1.0',
                // Tasting
                selectLevel: 'Seleziona il tuo livello',
                beginner: 'Principiante',
                expert: 'Esperto',
                beginnerDesc: 'Perfetto per chi inizia a scoprire il mondo del vino',
                expertDesc: 'Per degustatori esperti che vogliono approfondire',
                stage: 'Fase',
                start: 'Inizia',
                continue: 'Continua la degustazione',
                endTasting: 'Termina Degustazione',
                tastingCompleted: '🍷 Degustazione completata! Grazie per aver partecipato.',
                loading: 'Caricamento...',
                error: 'Errore',
                close: 'Chiudi'
            },
            en: {
                title: 'Virtual Assistant',
                welcomeMessage: 'Hello! 👋 I\'m your virtual assistant. How can I help you today?',
                placeholder: 'Type a message...',
                typing: 'Assistant is typing...',
                toggleLabel: 'Open chat',
                closeLabel: 'Close chat',
                sendLabel: 'Send message',
                quickAction1: 'Do you organize visits?',
                quickAction2: 'Let\'s taste together?',
                powered: 'Powered by Chatbot v1.0',
                // Tasting
                selectLevel: 'Select your level',
                beginner: 'Beginner',
                expert: 'Expert',
                beginnerDesc: 'Perfect for those starting to discover the wine world',
                expertDesc: 'For experienced tasters who want to deepen their knowledge',
                stage: 'Stage',
                start: 'Start',
                continue: 'Continue tasting',
                endTasting: 'End Tasting',
                tastingCompleted: '🍷 Tasting completed! Thank you for participating.',
                loading: 'Loading...',
                error: 'Error',
                close: 'Close'
            }
        },

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
        },

        /**
         * 🎯 Scopo: Ottiene testo tradotto per lingua corrente
         * 📥 Input: key (string) - chiave traduzione
         * 📤 Output: Testo tradotto
         */
        t(key) {
            const lang = this.current.language || 'it';
            return this.translations[lang]?.[key] || this.translations.it[key] || key;
        },

        /**
         * 🎯 Scopo: Cambia lingua e aggiorna UI
         * 📥 Input: newLanguage (string)
         * 📤 Output: UI aggiornata
         */
        setLanguage(newLanguage) {
            if (!this.translations[newLanguage]) {
                console.warn(`⚠️ Lingua '${newLanguage}' non supportata`);
                return false;
            }

            const oldLanguage = this.current.language;
            this.current.language = newLanguage;
            
            console.log(`🌐 Lingua cambiata da '${oldLanguage}' a '${newLanguage}'`);
            
            // Aggiorna UI
            this.updateUI();
            
            // Aggiorna messaggio benvenuto se presente
            this.updateWelcomeMessage();
            
            return true;
        },

        /**
         * 🎯 Scopo: Aggiorna testi UI per lingua corrente
         * 📥 Input: Nessuno
         * 📤 Output: UI aggiornata
         */
        updateUI() {
            if (!ChatbotUI.shadowRoot) return;

            const elements = {
                '.chatbot-title': this.t('title'),
                '.chatbot-input': { placeholder: this.t('placeholder') },
                '.chatbot-toggle': { 'aria-label': this.t('toggleLabel') },
                '.chatbot-close': { 'aria-label': this.t('closeLabel') },
                '.chatbot-send-button': { 'aria-label': this.t('sendLabel') },
                '.chatbot-typing-text': this.t('typing'),
                '.chatbot-powered': this.t('powered')
            };

            // Aggiorna quick actions
            const quickActions = ChatbotUI.shadowRoot.querySelectorAll('.chatbot-quick-action');
            if (quickActions.length >= 1) quickActions[0].textContent = this.t('quickAction1');
            if (quickActions.length >= 2) quickActions[1].textContent = this.t('quickAction2');

            // Aggiorna altri elementi
            Object.entries(elements).forEach(([selector, value]) => {
                const element = ChatbotUI.shadowRoot.querySelector(selector);
                if (element) {
                    if (typeof value === 'string') {
                        element.textContent = value;
                    } else if (typeof value === 'object') {
                        Object.entries(value).forEach(([attr, val]) => {
                            element.setAttribute(attr, val);
                        });
                    }
                }
            });

            // Aggiorna indicatore lingua corrente
            const currentLangDisplay = ChatbotUI.shadowRoot.querySelector('.chatbot-language-current');
            if (currentLangDisplay) {
                currentLangDisplay.textContent = this.current.language.toUpperCase();
            }
        },

        /**
         * 🎯 Scopo: Aggiorna messaggio di benvenuto
         * 📥 Input: Nessuno
         * 📤 Output: Messaggio benvenuto aggiornato
         */
        updateWelcomeMessage() {
            if (!ChatbotUI.shadowRoot) return;

            const welcomeElement = ChatbotUI.shadowRoot.querySelector('.chatbot-welcome-message .chatbot-message-content');
            if (welcomeElement) {
                welcomeElement.textContent = this.t('welcomeMessage');
            }
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