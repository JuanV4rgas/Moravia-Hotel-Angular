import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { ThemeService, Theme } from 'src/app/services/theme.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
})
export class UserDropdownComponent implements OnInit {

  @Input() usuario: Usuario | null = null;
  @Input() logoutFn!: () => void;

  currentTheme: Theme = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  logout(): void {
    this.logoutFn();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
