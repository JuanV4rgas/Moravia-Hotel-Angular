import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-media-row',
  templateUrl: './media-row.component.html',
  styleUrls: ['./media-row.component.css']
})
export class MediaRowComponent implements AfterViewInit, OnDestroy {
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
      console.log('Video loaded successfully');
      this.retryCount = 0;
    });

    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      this.handleVideoError();
    });

    video.addEventListener('stalled', () => {
      console.warn('Video stalled, attempting to reload');
      this.reloadVideo();
    });

    // Intentar cargar el video
    video.load();
    
    // Intentar reproducir
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playing');
        })
        .catch((error) => {
          console.warn('Autoplay prevented:', error);
          // Algunos navegadores bloquean el autoplay, intentar de nuevo sin audio
          video.muted = true;
          video.play().catch((e) => {
            console.error('Failed to play video even muted:', e);
          });
        });
    }
  }

  private handleVideoError(): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying video load (${this.retryCount}/${this.maxRetries})`);
      
      // Esperar un poco antes de reintentar
      this.retryTimeout = setTimeout(() => {
        this.reloadVideo();
      }, 1000);
    } else {
      console.error('Max retries reached, video failed to load');
    }
  }

  private reloadVideo(): void {
    const video = this.videoElement?.nativeElement;
    if (video) {
      video.load();
      video.play().catch((e) => {
        console.error('Failed to play video on reload:', e);
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