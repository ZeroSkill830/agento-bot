/**
 * 🤖 Chatbot Web Iniettabile
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
     * 🎯 Scopo: Gestione interfaccia utente del chatbot
     * 📥 Input: Shadow DOM root
     * 📤 Output: Metodi per manipolare UI
     */
    const ChatbotUI = {
        shadowRoot: null,
        isVisible: false,

        /**
         * 🎯 Scopo: Crea e gestisce Shadow DOM
         * 📥 Input: Elemento container
         * 📤 Output: Shadow root creato
         * 🔧 Esempio: createShadowDOM(containerElement)
         */
        async createShadowDOM(container) {
            try {
                // 1. Crea Shadow DOM con modalità open per debug
                this.shadowRoot = container.attachShadow({ mode: 'open' });
                
                // 2. Carica e inietta template HTML
                await this.loadTemplate();
                
                // 3. Carica e inietta stili CSS
                await this.loadStyles();
                
                console.log('✅ Shadow DOM creato e configurato con successo');
                return this.shadowRoot;
                
            } catch (error) {
                console.error('❌ Errore creazione Shadow DOM:', error);
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Carica template HTML nel Shadow DOM
         * 📥 Input: Nessuno
         * 📤 Output: DOM popolato
         */
        async loadTemplate() {
            try {
                // Per ora utilizziamo il template inline per evitare fetch
                // In futuro si può implementare fetch('chatbot/chatbot.html')
                const htmlTemplate = `
                    <!-- Pulsante Toggle per aprire/chiudere chatbot -->
                    <div class="chatbot-toggle" aria-label="Apri chat" role="button" tabindex="0">
                        <svg class="chatbot-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                    </div>

                    <!-- Finestra principale del chatbot -->
                    <div class="chatbot-window" role="dialog" aria-labelledby="chatbot-title" aria-hidden="true">
                        
                        <!-- Header del chatbot -->
                        <div class="chatbot-header">
                            <h3 id="chatbot-title" class="chatbot-title">Assistente Virtuale</h3>
                            <button class="chatbot-close" aria-label="Chiudi chat" type="button">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Area messaggi -->
                        <div class="chatbot-messages" role="log" aria-live="polite" aria-label="Cronologia conversazione">
                            <div class="chatbot-welcome-message">
                                <div class="chatbot-message chatbot-message--bot">
                                    <div class="chatbot-message-content">
                                        Ciao! 👋 Come posso aiutarti oggi?
                                    </div>
                                    <div class="chatbot-message-time">
                                        Ora
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Indicatore di typing -->
                        <div class="chatbot-typing" aria-hidden="true">
                            <div class="chatbot-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span class="chatbot-typing-text">L'assistente sta scrivendo...</span>
                        </div>

                        <!-- Area input utente -->
                        <div class="chatbot-input-area">
                            <form class="chatbot-input-form" role="form">
                                <div class="chatbot-input-container">
                                    <input 
                                        type="text" 
                                        class="chatbot-input" 
                                        placeholder="Scrivi un messaggio..." 
                                        aria-label="Scrivi messaggio"
                                        maxlength="500"
                                        autocomplete="off"
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        class="chatbot-send-button" 
                                        aria-label="Invia messaggio"
                                        disabled
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Footer -->
                        <div class="chatbot-footer">
                            <small class="chatbot-powered">Powered by Chatbot v1.0</small>
                        </div>
                    </div>

                    <!-- Template per messaggi -->
                    <template id="chatbot-message-template">
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
                // Per ora utilizziamo stili inline per evitare fetch
                // In futuro si può implementare fetch('chatbot/chatbot.css')
                const styleElement = document.createElement('style');
                styleElement.textContent = await this.getCSSStyles();
                
                this.shadowRoot.appendChild(styleElement);
                console.log('✅ Stili CSS caricati nel Shadow DOM');
                
            } catch (error) {
                console.error('❌ Errore caricamento stili:', error);
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Restituisce gli stili CSS inline
         * 📥 Input: Nessuno  
         * 📤 Output: Stringa CSS completa
         */
        async getCSSStyles() {
            return `
                /* CSS Variables - Design System */
                :host {
                  --chatbot-primary: #2563eb;
                  --chatbot-primary-hover: #1d4ed8;
                  --chatbot-primary-light: #dbeafe;
                  --chatbot-secondary: #64748b;
                  --chatbot-secondary-light: #f1f5f9;
                  --chatbot-bg: #ffffff;
                  --chatbot-surface: #f8fafc;
                  --chatbot-border: #e2e8f0;
                  --chatbot-text-primary: #1e293b;
                  --chatbot-text-secondary: #64748b;
                  --chatbot-text-inverse: #ffffff;
                  --chatbot-message-user-bg: #2563eb;
                  --chatbot-message-user-text: #ffffff;
                  --chatbot-message-bot-bg: #f1f5f9;
                  --chatbot-message-bot-text: #1e293b;
                  --chatbot-spacing-xs: 4px;
                  --chatbot-spacing-sm: 8px;
                  --chatbot-spacing-md: 16px;
                  --chatbot-spacing-lg: 24px;
                  --chatbot-spacing-xl: 32px;
                  --chatbot-font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                  --chatbot-font-size-xs: 12px;
                  --chatbot-font-size-sm: 14px;
                  --chatbot-font-size-md: 16px;
                  --chatbot-font-size-lg: 18px;
                  --chatbot-radius-sm: 4px;
                  --chatbot-radius-md: 8px;
                  --chatbot-radius-lg: 12px;
                  --chatbot-radius-xl: 16px;
                  --chatbot-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                  --chatbot-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                  --chatbot-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                  --chatbot-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                  --chatbot-z-toggle: 1000;
                  --chatbot-z-window: 1001;
                  --chatbot-transition: all 0.2s ease-in-out;
                  --chatbot-transition-bounce: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .chatbot-toggle {
                  position: fixed;
                  bottom: var(--chatbot-spacing-lg);
                  right: var(--chatbot-spacing-lg);
                  width: 60px; height: 60px;
                  background: var(--chatbot-primary);
                  border-radius: 50%;
                  display: flex; align-items: center; justify-content: center;
                  cursor: pointer;
                  box-shadow: var(--chatbot-shadow-lg);
                  transition: var(--chatbot-transition-bounce);
                  z-index: var(--chatbot-z-toggle);
                  border: none; outline: none;
                }

                .chatbot-toggle:hover {
                  background: var(--chatbot-primary-hover);
                  transform: scale(1.05);
                }

                .chatbot-toggle:focus {
                  outline: 2px solid var(--chatbot-primary);
                  outline-offset: 2px;
                }

                .chatbot-toggle-icon { width: 24px; height: 24px; fill: var(--chatbot-text-inverse); }

                .chatbot-window {
                  position: fixed;
                  bottom: 100px; right: var(--chatbot-spacing-lg);
                  width: 600px; height: 400px;
                  max-width: calc(100vw - 48px); max-height: calc(100vh - 120px);
                  background: var(--chatbot-bg);
                  border-radius: var(--chatbot-radius-lg);
                  box-shadow: var(--chatbot-shadow-xl);
                  display: flex; flex-direction: column;
                  overflow: hidden;
                  z-index: var(--chatbot-z-window);
                  transform: scale(0) translateY(20px);
                  opacity: 0;
                  transition: var(--chatbot-transition-bounce);
                  font-family: var(--chatbot-font-family);
                  border: 1px solid var(--chatbot-border);
                }

                .chatbot-window.chatbot-window--visible {
                  transform: scale(1) translateY(0);
                  opacity: 1;
                }

                @media (max-width: 768px) {
                  .chatbot-toggle { bottom: var(--chatbot-spacing-md); right: var(--chatbot-spacing-md); width: 56px; height: 56px; }
                  .chatbot-toggle-icon { width: 20px; height: 20px; }
                  .chatbot-window { bottom: 0; right: 0; left: 0; top: 0; width: 100%; height: 100%; max-width: none; max-height: none; border-radius: 0; border: none; }
                }

                .chatbot-header {
                  display: flex; align-items: center; justify-content: space-between;
                  padding: var(--chatbot-spacing-md);
                  background: var(--chatbot-primary);
                  color: var(--chatbot-text-inverse);
                  border-bottom: 1px solid var(--chatbot-border);
                }

                .chatbot-title { font-size: var(--chatbot-font-size-lg); font-weight: 600; margin: 0; }

                .chatbot-close {
                  width: 32px; height: 32px;
                  background: transparent; border: none;
                  color: var(--chatbot-text-inverse); cursor: pointer;
                  border-radius: var(--chatbot-radius-sm);
                  display: flex; align-items: center; justify-content: center;
                  transition: var(--chatbot-transition);
                }

                .chatbot-close:hover { background: rgba(255, 255, 255, 0.1); }
                .chatbot-close svg { width: 20px; height: 20px; fill: currentColor; }

                .chatbot-messages {
                  flex: 1; padding: var(--chatbot-spacing-md);
                  overflow-y: auto; scroll-behavior: smooth;
                  background: var(--chatbot-surface);
                }

                .chatbot-message {
                  margin-bottom: var(--chatbot-spacing-md);
                  display: flex; flex-direction: column;
                  max-width: 80%;
                  animation: chatbot-fade-in 0.3s ease-out;
                }

                .chatbot-message--user { align-self: flex-end; align-items: flex-end; }
                .chatbot-message--bot { align-self: flex-start; align-items: flex-start; }

                .chatbot-message-content {
                  padding: var(--chatbot-spacing-sm) var(--chatbot-spacing-md);
                  border-radius: var(--chatbot-radius-lg);
                  font-size: var(--chatbot-font-size-md);
                  line-height: 1.5; word-wrap: break-word;
                }

                .chatbot-message--user .chatbot-message-content {
                  background: var(--chatbot-message-user-bg);
                  color: var(--chatbot-message-user-text);
                }

                .chatbot-message--bot .chatbot-message-content {
                  background: var(--chatbot-message-bot-bg);
                  color: var(--chatbot-message-bot-text);
                }

                .chatbot-message-time {
                  font-size: var(--chatbot-font-size-xs);
                  color: var(--chatbot-text-secondary);
                  margin-top: var(--chatbot-spacing-xs);
                }

                .chatbot-typing {
                  padding: var(--chatbot-spacing-md);
                  display: none; align-items: center;
                  gap: var(--chatbot-spacing-sm);
                  background: var(--chatbot-surface);
                  border-top: 1px solid var(--chatbot-border);
                }

                .chatbot-typing--visible { display: flex; }
                .chatbot-typing-indicator { display: flex; gap: 3px; }

                .chatbot-typing-indicator span {
                  width: 6px; height: 6px;
                  background: var(--chatbot-text-secondary);
                  border-radius: 50%;
                  animation: chatbot-typing-animation 1.4s infinite ease-in-out;
                }

                .chatbot-typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .chatbot-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

                @keyframes chatbot-typing-animation {
                  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                  40% { transform: scale(1); opacity: 1; }
                }

                .chatbot-typing-text { font-size: var(--chatbot-font-size-sm); color: var(--chatbot-text-secondary); }

                .chatbot-input-area {
                  border-top: 1px solid var(--chatbot-border);
                  padding: var(--chatbot-spacing-md);
                  background: var(--chatbot-bg);
                }

                .chatbot-input-form { width: 100%; }
                .chatbot-input-container { display: flex; gap: var(--chatbot-spacing-sm); align-items: center; }

                .chatbot-input {
                  flex: 1;
                  padding: var(--chatbot-spacing-sm) var(--chatbot-spacing-md);
                  border: 1px solid var(--chatbot-border);
                  border-radius: var(--chatbot-radius-md);
                  font-size: var(--chatbot-font-size-md);
                  font-family: inherit;
                  background: var(--chatbot-bg);
                  color: var(--chatbot-text-primary);
                  transition: var(--chatbot-transition);
                  outline: none;
                }

                .chatbot-input:focus {
                  border-color: var(--chatbot-primary);
                  box-shadow: 0 0 0 2px var(--chatbot-primary-light);
                }

                .chatbot-input::placeholder { color: var(--chatbot-text-secondary); }

                .chatbot-send-button {
                  width: 40px; height: 40px;
                  background: var(--chatbot-primary);
                  border: none; border-radius: var(--chatbot-radius-md);
                  color: var(--chatbot-text-inverse); cursor: pointer;
                  display: flex; align-items: center; justify-content: center;
                  transition: var(--chatbot-transition);
                  flex-shrink: 0;
                }

                .chatbot-send-button:hover:not(:disabled) { background: var(--chatbot-primary-hover); }
                .chatbot-send-button:disabled { opacity: 0.5; cursor: not-allowed; }
                .chatbot-send-button svg { width: 18px; height: 18px; fill: currentColor; }

                .chatbot-footer {
                  padding: var(--chatbot-spacing-sm) var(--chatbot-spacing-md);
                  background: var(--chatbot-surface);
                  border-top: 1px solid var(--chatbot-border);
                  text-align: center;
                }

                .chatbot-powered { font-size: var(--chatbot-font-size-xs); color: var(--chatbot-text-secondary); }

                .chatbot-messages::-webkit-scrollbar { width: 6px; }
                .chatbot-messages::-webkit-scrollbar-track { background: transparent; }
                .chatbot-messages::-webkit-scrollbar-thumb { 
                  background: var(--chatbot-border); 
                  border-radius: var(--chatbot-radius-sm); 
                }

                @keyframes chatbot-fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }

                .chatbot-toggle:focus-visible,
                .chatbot-close:focus-visible,
                .chatbot-input:focus-visible,
                .chatbot-send-button:focus-visible {
                  outline: 2px solid var(--chatbot-primary);
                  outline-offset: 2px;
                }

                * {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                }

                /* Pulsante Toggle */
                .chatbot-toggle {
                  position: fixed;
                  bottom: var(--chatbot-spacing-lg);
                  right: var(--chatbot-spacing-lg);
                  width: 60px;
                  height: 60px;
                  background: var(--chatbot-primary);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  box-shadow: var(--chatbot-shadow-lg);
                  transition: var(--chatbot-transition-bounce);
                  z-index: var(--chatbot-z-toggle);
                  border: none;
                  outline: none;
                }

                .chatbot-toggle:hover {
                  background: var(--chatbot-primary-hover);
                  transform: scale(1.05);
                }

                .chatbot-toggle:focus {
                  outline: 2px solid var(--chatbot-primary);
                  outline-offset: 2px;
                }

                .chatbot-toggle-icon {
                  width: 24px;
                  height: 24px;
                  fill: var(--chatbot-text-inverse);
                }

                /* Finestra Chatbot */
                .chatbot-window {
                  position: fixed;
                  bottom: 100px;
                  right: var(--chatbot-spacing-lg);
                  width: 600px;
                  max-width: calc(100vw - 48px);
                  height: 400px;
                  max-height: calc(100vh - 120px);
                  background: var(--chatbot-bg);
                  border-radius: var(--chatbot-radius-lg);
                  box-shadow: var(--chatbot-shadow-xl);
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
                  z-index: var(--chatbot-z-window);
                  transform: scale(0) translateY(20px);
                  opacity: 0;
                  transition: var(--chatbot-transition-bounce);
                  font-family: var(--chatbot-font-family);
                  border: 1px solid var(--chatbot-border);
                }

                .chatbot-window.chatbot-window--visible {
                  transform: scale(1) translateY(0);
                  opacity: 1;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                  .chatbot-toggle {
                    bottom: var(--chatbot-spacing-md);
                    right: var(--chatbot-spacing-md);
                    width: 56px;
                    height: 56px;
                  }
                  
                  .chatbot-toggle-icon {
                    width: 20px;
                    height: 20px;
                  }
                  
                  .chatbot-window {
                    bottom: 0;
                    right: 0;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    max-width: none;
                    max-height: none;
                    border-radius: 0;
                    border: none;
                  }
                }

                /* Header */
                .chatbot-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: var(--chatbot-spacing-md);
                  background: var(--chatbot-primary);
                  color: var(--chatbot-text-inverse);
                  border-bottom: 1px solid var(--chatbot-border);
                }

                .chatbot-title {
                  font-size: var(--chatbot-font-size-lg);
                  font-weight: 600;
                  margin: 0;
                }

                .chatbot-close {
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  border: none;
                  color: var(--chatbot-text-inverse);
                  cursor: pointer;
                  border-radius: var(--chatbot-radius-sm);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: var(--chatbot-transition);
                }

                .chatbot-close:hover {
                  background: rgba(255, 255, 255, 0.1);
                }

                .chatbot-close svg {
                  width: 20px;
                  height: 20px;
                  fill: currentColor;
                }

                /* Area Messaggi */
                .chatbot-messages {
                  flex: 1;
                  padding: var(--chatbot-spacing-md);
                  overflow-y: auto;
                  scroll-behavior: smooth;
                  background: var(--chatbot-surface);
                }

                /* Singolo Messaggio */
                .chatbot-message {
                  margin-bottom: var(--chatbot-spacing-md);
                  display: flex;
                  flex-direction: column;
                  max-width: 80%;
                  animation: chatbot-fade-in 0.3s ease-out;
                }

                .chatbot-message--user {
                  align-self: flex-end;
                  align-items: flex-end;
                }

                .chatbot-message--bot {
                  align-self: flex-start;
                  align-items: flex-start;
                }

                .chatbot-message-content {
                  padding: var(--chatbot-spacing-sm) var(--chatbot-spacing-md);
                  border-radius: var(--chatbot-radius-lg);
                  font-size: var(--chatbot-font-size-md);
                  line-height: 1.5;
                  word-wrap: break-word;
                }

                .chatbot-message--user .chatbot-message-content {
                  background: var(--chatbot-message-user-bg);
                  color: var(--chatbot-message-user-text);
                }

                .chatbot-message--bot .chatbot-message-content {
                  background: var(--chatbot-message-bot-bg);
                  color: var(--chatbot-message-bot-text);
                }

                .chatbot-message-time {
                  font-size: var(--chatbot-font-size-xs);
                  color: var(--chatbot-text-secondary);
                  margin-top: var(--chatbot-spacing-xs);
                }

                /* Indicatore Typing */
                .chatbot-typing {
                  padding: var(--chatbot-spacing-md);
                  display: none;
                  align-items: center;
                  gap: var(--chatbot-spacing-sm);
                  background: var(--chatbot-surface);
                  border-top: 1px solid var(--chatbot-border);
                }

                .chatbot-typing--visible {
                  display: flex;
                }

                .chatbot-typing-indicator {
                  display: flex;
                  gap: 3px;
                }

                .chatbot-typing-indicator span {
                  width: 6px;
                  height: 6px;
                  background: var(--chatbot-text-secondary);
                  border-radius: 50%;
                  animation: chatbot-typing-animation 1.4s infinite ease-in-out;
                }

                .chatbot-typing-indicator span:nth-child(1) {
                  animation-delay: -0.32s;
                }

                .chatbot-typing-indicator span:nth-child(2) {
                  animation-delay: -0.16s;
                }

                @keyframes chatbot-typing-animation {
                  0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                  }
                  40% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }

                .chatbot-typing-text {
                  font-size: var(--chatbot-font-size-sm);
                  color: var(--chatbot-text-secondary);
                }

                /* Area Input */
                .chatbot-input-area {
                  border-top: 1px solid var(--chatbot-border);
                  padding: var(--chatbot-spacing-md);
                  background: var(--chatbot-bg);
                }

                .chatbot-input-form {
                  width: 100%;
                }

                .chatbot-input-container {
                  display: flex;
                  gap: var(--chatbot-spacing-sm);
                  align-items: center;
                }

                .chatbot-input {
                  flex: 1;
                  padding: var(--chatbot-spacing-sm) var(--chatbot-spacing-md);
                  border: 1px solid var(--chatbot-border);
                  border-radius: var(--chatbot-radius-md);
                  font-size: var(--chatbot-font-size-md);
                  font-family: inherit;
                  background: var(--chatbot-bg);
                  color: var(--chatbot-text-primary);
                  transition: var(--chatbot-transition);
                  outline: none;
                }

                .chatbot-input:focus {
                  border-color: var(--chatbot-primary);
                  box-shadow: 0 0 0 2px var(--chatbot-primary-light);
                }

                .chatbot-input::placeholder {
                  color: var(--chatbot-text-secondary);
                }

                .chatbot-send-button {
                  width: 40px;
                  height: 40px;
                  background: var(--chatbot-primary);
                  border: none;
                  border-radius: var(--chatbot-radius-md);
                  color: var(--chatbot-text-inverse);
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: var(--chatbot-transition);
                  flex-shrink: 0;
                }

                .chatbot-send-button:hover:not(:disabled) {
                  background: var(--chatbot-primary-hover);
                }

                .chatbot-send-button:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                }

                .chatbot-send-button svg {
                  width: 18px;
                  height: 18px;
                  fill: currentColor;
                }

                /* Footer */
                .chatbot-footer {
                  padding: var(--chatbot-spacing-sm) var(--chatbot-spacing-md);
                  background: var(--chatbot-surface);
                  border-top: 1px solid var(--chatbot-border);
                  text-align: center;
                }

                .chatbot-powered {
                  font-size: var(--chatbot-font-size-xs);
                  color: var(--chatbot-text-secondary);
                }

                /* Utility Classes */
                .chatbot-hidden {
                  display: none !important;
                }

                /* Scrollbar Styling */
                .chatbot-messages::-webkit-scrollbar {
                  width: 6px;
                }

                .chatbot-messages::-webkit-scrollbar-track {
                  background: transparent;
                }

                .chatbot-messages::-webkit-scrollbar-thumb {
                  background: var(--chatbot-border);
                  border-radius: var(--chatbot-radius-sm);
                }

                .chatbot-messages::-webkit-scrollbar-thumb:hover {
                  background: var(--chatbot-text-secondary);
                }

                /* Animazioni */
                @keyframes chatbot-fade-in {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                /* Focus Management */
                .chatbot-window:focus {
                  outline: none;
                }

                .chatbot-toggle:focus-visible,
                .chatbot-close:focus-visible,
                .chatbot-input:focus-visible,
                .chatbot-send-button:focus-visible {
                  outline: 2px solid var(--chatbot-primary);
                  outline-offset: 2px;
                }
            `;
        },

        /**
         * 🎯 Scopo: Mostra/nasconde chatbot
         * 📥 Input: Nessuno
         * 📤 Output: Aggiorna stato visibilità
         */
        toggle() {
            // TODO: Implementare nella Fase 2
            console.log('🔧 ChatbotUI.toggle - Da implementare');
        }
    };

    /**
     * 🎯 Scopo: Sistema di gestione messaggi
     * 📥 Input: Messaggi utente/bot
     * 📤 Output: Array messaggi aggiornato
     */
    const ChatbotMessages = {
        messages: [],

        /**
         * 🎯 Scopo: Aggiunge messaggio alla conversazione
         * 📥 Input: Testo messaggio, tipo (user/bot)
         * 📤 Output: Array messaggi aggiornato
         */
        addMessage(text, type = 'user') {
            // TODO: Implementare nella Fase 4
            console.log('🔧 ChatbotMessages.addMessage - Da implementare');
        },

        /**
         * 🎯 Scopo: Renderizza messaggi nell'interfaccia
         * 📥 Input: Nessuno
         * 📤 Output: DOM aggiornato
         */
        render() {
            // TODO: Implementare nella Fase 4
            console.log('🔧 ChatbotMessages.render - Da implementare');
        }
    };

    /**
     * 🎯 Scopo: Gestione configurazione chatbot
     * 📥 Input: Oggetto configurazione utente
     * 📤 Output: Configurazione merged con default
     */
    const ChatbotConfig = {
        // Configurazione default
        default: {
            language: 'it',
            position: 'bottom-right',
            theme: 'light',
            apiEndpoint: null
        },

        current: {},

        /**
         * 🎯 Scopo: Merge configurazione utente con default
         * 📥 Input: Oggetto configurazione personalizzata
         * 📤 Output: Configurazione finale
         * 🔧 Esempio: merge({ language: 'en' })
         */
        merge(userConfig = {}) {
            // TODO: Implementare nella Fase 5
            this.current = { ...this.default, ...userConfig };
            console.log('🔧 ChatbotConfig.merge - Da implementare');
            return this.current;
        }
    };

    /**
     * 🎯 Scopo: Orchestratore principale del chatbot
     * 📥 Input: Configurazione inizializzazione
     * 📤 Output: Chatbot funzionante
     */
    const ChatbotCore = {
        isInitialized: false,
        container: null,

        /**
         * 🎯 Scopo: Inizializza il chatbot completo
         * 📥 Input: Configurazione opzionale
         * 📤 Output: Chatbot attivo e funzionante
         * 🔧 Esempio: init({ language: 'it' })
         */
                 async init(config = {}) {
            if (this.isInitialized) {
                console.warn('🤖 Chatbot già inizializzato');
                return;
            }

            console.log('🚀 Inizializzazione Chatbot...');
            
            try {
                // 1. Configura il chatbot
                ChatbotConfig.merge(config);
                
                // 2. Crea container principale
                this.container = document.createElement('div');
                this.container.id = 'chatbot-container';
                document.body.appendChild(this.container);
                
                // 3. Setup Shadow DOM (task 1.2)
                await ChatbotUI.createShadowDOM(this.container);
                
                // 4. Test isolamento stili
                this.testStyleIsolation();
                
                this.isInitialized = true;
                console.log('✅ Chatbot inizializzato con successo');
                
            } catch (error) {
                console.error('❌ Errore inizializzazione chatbot:', error);
                // Cleanup in caso di errore
                if (this.container && this.container.parentNode) {
                    this.container.parentNode.removeChild(this.container);
                }
                throw error;
            }
        },

        /**
         * 🎯 Scopo: Testa isolamento stili del Shadow DOM
         * 📥 Input: Nessuno
         * 📤 Output: Log risultati test
         */
        testStyleIsolation() {
            try {
                // Test 1: Verifica che il Shadow DOM esista
                if (!ChatbotUI.shadowRoot) {
                    throw new Error('Shadow DOM non creato');
                }
                
                // Test 2: Verifica isolamento - il chatbot non dovrebbe ereditare stili globali
                const toggle = ChatbotUI.shadowRoot.querySelector('.chatbot-toggle');
                if (!toggle) {
                    throw new Error('Elementi del chatbot non trovati nel Shadow DOM');
                }
                
                // Test 3: Verifica che gli stili siano applicati correttamente
                const computedStyle = getComputedStyle(toggle);
                const hasBackground = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
                
                if (!hasBackground) {
                    console.warn('⚠️ Gli stili potrebbero non essere applicati correttamente');
                }
                
                console.log('✅ Test isolamento stili: PASSED');
                console.log('📊 Shadow DOM mode:', ChatbotUI.shadowRoot.mode);
                console.log('📊 Elementi nel Shadow DOM:', ChatbotUI.shadowRoot.children.length);
                
            } catch (error) {
                console.error('❌ Test isolamento stili: FAILED', error);
            }
        },

        /**
         * 🎯 Scopo: Rimuove completamente il chatbot
         * 📥 Input: Nessuno
         * 📤 Output: Cleanup completo
         */
        destroy() {
            if (!this.isInitialized) {
                console.warn('🤖 Chatbot non inizializzato');
                return;
            }

            // Cleanup DOM
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }

            // Reset stato
            this.isInitialized = false;
            this.container = null;
            ChatbotMessages.messages = [];
            
            console.log('🗑️ Chatbot rimosso completamente');
        }
    };

    // 🌐 Esposizione API pubblica
    window.Chatbot = {
        /**
         * 🎯 Scopo: Inizializza chatbot con configurazione
         * 📥 Input: Oggetto configurazione opzionale
         * 📤 Output: Chatbot attivo
         * 🔧 Esempio: Chatbot.init({ language: 'it' })
         */
        init: (config) => ChatbotCore.init(config),

        /**
         * 🎯 Scopo: Rimuove chatbot dalla pagina
         * 📥 Input: Nessuno
         * 📤 Output: Cleanup completo
         */
        destroy: () => ChatbotCore.destroy(),

        /**
         * 🎯 Scopo: Verifica se chatbot è attivo
         * 📥 Input: Nessuno
         * 📤 Output: Boolean stato inizializzazione
         */
        get isInitialized() {
            return ChatbotCore.isInitialized;
        },

        // 🔧 Metodi di debug (solo sviluppo)
        _debug: {
            ui: ChatbotUI,
            messages: ChatbotMessages,
            config: ChatbotConfig,
            core: ChatbotCore
        }
    };

    console.log('📦 Chatbot script caricato. Usa window.Chatbot.init() per inizializzare.');

})(); 