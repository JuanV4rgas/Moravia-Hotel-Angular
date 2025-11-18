import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Moravia';

  userType='admin';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // El servicio de tema se inicializa automáticamente
  }

}
