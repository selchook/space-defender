class CrazyGamesSDKManager {
  private _ready: boolean = false;

  async init(): Promise<void> {
    if (typeof (window as any).CrazyGames === 'undefined') {
      this._ready = true;
      return;
    }

    try {
      await (window as any).CrazyGames.SDK.init();
      this._ready = true;
      
      const settings = (window as any).CrazyGames.SDK.game.settings;
      if (settings?.muteAudio) {
        // Mute audio if needed
      }
    } catch (error) {
      console.warn('CrazyGames SDK init failed:', error);
      this._ready = true;
    }
  }

  gameplayStart(): void {
    try {
      if ((window as any).CrazyGames) {
        (window as any).CrazyGames.SDK.game.gameplayStart();
      }
    } catch (error) {
      console.warn('gameplayStart failed:', error);
    }
  }

  gameplayStop(): void {
    try {
      if ((window as any).CrazyGames) {
        (window as any).CrazyGames.SDK.game.gameplayStop();
      }
    } catch (error) {
      console.warn('gameplayStop failed:', error);
    }
  }

  loadingStart(): void {
    try {
      if ((window as any).CrazyGames) {
        (window as any).CrazyGames.SDK.game.loadingStart();
      }
    } catch (error) {
      console.warn('loadingStart failed:', error);
    }
  }

  loadingStop(): void {
    try {
      if ((window as any).CrazyGames) {
        (window as any).CrazyGames.SDK.game.loadingStop();
      }
    } catch (error) {
      console.warn('loadingStop failed:', error);
    }
  }

  happytime(): void {
    try {
      if ((window as any).CrazyGames) {
        (window as any).CrazyGames.SDK.game.happytime();
      }
    } catch (error) {
      console.warn('happytime failed:', error);
    }
  }

  async requestAd(type: string = 'midgame'): Promise<void> {
    if (!(window as any).CrazyGames || (window as any).CrazyGames.SDK.environment === 'disabled') {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      (window as any).CrazyGames.SDK.ad.requestAd(type, {
        adStarted: () => {
          this.gameplayStop();
        },
        adFinished: () => {
          this.gameplayStart();
          resolve();
        },
        adError: () => {
          this.gameplayStart();
          resolve();
        }
      });
    });
  }

  get ready(): boolean {
    return this._ready;
  }

  get environment(): string {
    if (!(window as any).CrazyGames) return 'local';
    return (window as any).CrazyGames.SDK.environment;
  }
}

export const CrazySDK = new CrazyGamesSDKManager();