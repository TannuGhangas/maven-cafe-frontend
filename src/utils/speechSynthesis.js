// Centralized Speech Synthesis Utility
// Eliminates code duplication and improves performance

class SpeechSynthesisManager {
    constructor() {
        this.isInitialized = false;
        this.isMuted = false;
        this.currentUtterance = null;
        this.voices = [];
        this.supported = 'speechSynthesis' in window;
        
        // Initialize immediately if supported and try to warm up speech
        if (this.supported) {
            this.initializeVoices();
            this.warmUpSpeech();
        }
    }

    warmUpSpeech() {
        // Immediately warm up speech synthesis to avoid user interaction requirement
        if (this.supported) {
            try {
                const warmUpUtterance = new SpeechSynthesisUtterance('');
                warmUpUtterance.volume = 0;
                window.speechSynthesis.speak(warmUpUtterance);
                setTimeout(() => {
                    if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                    }
                }, 50);
            } catch (error) {
                console.warn('Speech warm-up error:', error);
            }
        }
    }

    initializeVoices() {
        if (!this.supported) return;
        
        try {
            // Load voices immediately
            this.voices = window.speechSynthesis.getVoices() || [];
            
            // Also listen for voiceschanged event (some browsers load voices asynchronously)
            window.speechSynthesis.addEventListener('voiceschanged', () => {
                this.voices = window.speechSynthesis.getVoices() || [];
                this.isInitialized = true;
            });
            
            // Mark as initialized if we already have voices
            if (this.voices.length > 0) {
                this.isInitialized = true;
            }
        } catch (error) {
            console.warn('Voice initialization error:', error);
        }
    }

    getEnglishVoice() {
        return this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0] || null;
    }

    cancel() {
        if (this.supported && window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
                this.currentUtterance = null;
            } catch (error) {
                console.warn('Error cancelling speech:', error);
            }
        }
    }

    speak(text, options = {}) {
        if (!this.supported || this.isMuted || !text) {
            return false;
        }

        try {
            // Cancel any ongoing speech immediately
            this.cancel();
            
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(String(text));
            
            // Apply options
            utterance.rate = options.rate || 0.9;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;
            
            // Set voice if available
            const voice = this.getEnglishVoice();
            if (voice) {
                utterance.voice = voice;
            }

            // Set up event handlers
            utterance.onstart = () => {
                console.log('🔊 Speech started');
                if (options.onStart) options.onStart();
            };
            
            utterance.onend = () => {
                console.log('🔇 Speech ended');
                if (options.onEnd) options.onEnd();
                this.currentUtterance = null;
            };
            
            utterance.onerror = (error) => {
                console.error('❌ Speech error:', error);
                if (options.onError) options.onError(error);
                this.currentUtterance = null;
            };

            // Start speaking
            window.speechSynthesis.speak(utterance);
            this.currentUtterance = utterance;
            
            return true;
        } catch (error) {
            console.error('❌ Speech synthesis error:', error);
            return false;
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (muted) {
            this.cancel();
        }
    }

    isSpeaking() {
        return this.supported && window.speechSynthesis?.speaking;
    }
}

// Create singleton instance
const speechManager = new SpeechSynthesisManager();

export default speechManager;