```typescript
class AudioManagerClass {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicOscillator: OscillatorNode | null = null;
  private musicStarted: boolean = false;

  init(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      
      this.musicGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);
      
      this.musicGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      this.sfxGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  private ensureAudioContext(): void {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  startMusic(): void {
    if (!this.audioContext || this.musicStarted || this.isMuted) return;
    
    this.ensureAudioContext();
    this.musicStarted = true;
    
    // Create a simple ambient music loop
    this.playMusicLoop();
  }

  private playMusicLoop(): void {
    if (!this.audioContext || !this.musicGain) return;

    const playNote = (frequency: number, duration: number, delay: number) => {
      setTimeout(() => {
        if (!this.audioContext || !this.musicGain || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(this.musicGain);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
        envelope.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
      }, delay);
    };

    // Ambient space music pattern
    const notes = [220, 277, 330, 277, 220, 185, 220, 247];
    let delay = 0;
    
    notes.forEach((note, index) => {
      playNote(note, 1.5, delay);
      delay += 2000;
    });

    // Loop the music
    setTimeout(() => {
      if (this.musicStarted && !this.isMuted) {
        this.playMusicLoop();
      }
    }, delay);
  }

  stopMusic(): void {
    this.musicStarted = false;
    if (this.musicOscillator) {
      this.musicOscillator.stop();
      this.musicOscillator = null;
    }
  }

  playSound(type: 'thrust' | 'collect' | 'explosion' | 'hit' | 'levelComplete'): void {
    if (!this.audioContext || !this.sfxGain || this.isMuted) return;
    
    this.ensureAudioContext();
    
    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.sfxGain);
    
    let frequency = 220;
    let duration = 0.2;
    let waveType: OscillatorType = 'sine';
    
    switch (type) {
      case 'thrust':
        frequency = 60;
        duration = 0.1;
        waveType = 'sawtooth';
        break;
      case 'collect':
        frequency = 800;
        duration = 0.3;
        waveType = 'sine';
        break;
      case 'explosion':
        frequency = 100;
        duration = 0.5;
        waveType = 'square';
        break;
      case 'hit':
        frequency = 200;
        duration = 0.2;
        waveType = 'triangle';
        break;
      case 'levelComplete':
        frequency = 1000;
        duration = 1.0;
        waveType = 'sine';
        break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = waveType;
    
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
    envelope.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  mute(): void {
    this.isMuted = true;
    this.stopMusic();
    if (this.musicGain) this.musicGain.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
  }

  unmute(): void {
    this.isMuted = false;
    if (this.musicGain) this.musicGain.gain.setValueAtTime(0.3, this.audioContext?.currentTime || 0);
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(0.5, this.audioContext?.currentTime || 0);
  }

  toggleMute(): void {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  get muted(): boolean {
    return this.isMuted;
  }
}

export const AudioManager = new AudioManagerClass();
```