import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-auth-wrap',
  templateUrl: './auth-wrap.component.html',
  styleUrls: ['./auth-wrap.component.css']
})
export class AuthWrapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  private retryCount = 0;
  private maxRetries = 3;
  private retryTimeout: any;

  ngAfterViewInit(): void {
    // Esperar un momento para que el DOM esté completamente listo
    setTimeout(() => {
      this.initializeVideo();
    }, 100);
  }

  private initializeVideo(): void {
    const video = this.videoElement?.nativeElement;
    
    if (!video) {
      console.error('Video element not found');
      return;
    }

    // Eventos del video
    video.addEventListener('loadeddata', () => {
      console.log('Auth video loaded successfully');
      this.retryCount = 0;
    });

    video.addEventListener('error', (e) => {
      console.error('Auth video error:', e);
      this.handleVideoError();
    });

    video.addEventListener('stalled', () => {
      console.warn('Auth video stalled, attempting to reload');
      this.reloadVideo();
    });

    // Intentar cargar el video
    video.load();
    
    // Intentar reproducir
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Auth video playing');
        })
        .catch((error) => {
          console.warn('Auth autoplay prevented:', error);
          // Algunos navegadores bloquean el autoplay, intentar de nuevo sin audio
          video.muted = true;
          video.play().catch((e) => {
            console.error('Failed to play auth video even muted:', e);
          });
        });
    }
  }

  private handleVideoError(): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying auth video load (${this.retryCount}/${this.maxRetries})`);
      
      // Esperar un poco antes de reintentar
      this.retryTimeout = setTimeout(() => {
        this.reloadVideo();
      }, 1000);
    } else {
      console.error('Max retries reached, auth video failed to load');
    }
  }

  private reloadVideo(): void {
    const video = this.videoElement?.nativeElement;
    if (video) {
      video.load();
      video.play().catch((e) => {
        console.error('Failed to play auth video on reload:', e);
      });
    }
  }

  ngOnDestroy(): void {
    // Limpiar timeout si existe
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // Detener el video
    const video = this.videoElement?.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }
  }
}