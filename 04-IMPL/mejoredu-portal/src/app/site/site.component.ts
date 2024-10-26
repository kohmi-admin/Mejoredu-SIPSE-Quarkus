import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent {
  sectionTitle: string = 'Ayuda';
  open: boolean = false;

  constructor(private _router: Router) {
    const menuClose = localStorage.getItem('menu-close');
    if (menuClose === 'true') {
      document.querySelector('body')?.classList.add('menu-close');
    }
  }

  saveToggleMenu() {
    const hasClass = document
      .querySelector('body')
      ?.classList.contains('menu-close');
    localStorage.setItem('menu-close', hasClass ? 'true' : 'false');
  }

  toggleMenu() {
    document.querySelector('body')?.classList.toggle('menu-close');
    this.saveToggleMenu();
  }

  openSection(section: string) {
    switch (section) {
      case 'Normatividad':
        this.openNormativity();
        break;
      case 'Documentos de Apoyo':
        this.openDocuments();
        break;
      case 'Notificaciones':
        this.openNotificaciones();
        break;
      case 'Ayuda':
        this.openAyuda();
        break;
      case 'Configuración':
        this.open = false;
        this._router.navigate(['/Configuración']);
        break;
      default:
        break;
    }
  }

  closeSection() {
    this.open = false;
  }

  openAyuda() {
    if (this.sectionTitle == 'Ayuda' && this.open) {
      this.closeSection();
      return;
    }
    this.sectionTitle = 'Ayuda';
    this.open = true;
  }

  openNotificaciones() {
    if (this.sectionTitle == 'Notificaciones' && this.open) {
      this.closeSection();
      return;
    }
    this.sectionTitle = 'Notificaciones';
    this.open = true;
  }

  openNormativity() {
    if (this.sectionTitle == 'Normatividad' && this.open) {
      this.closeSection();
      return;
    }
    this.sectionTitle = 'Normatividad';
    this.open = true;
  }

  openDocuments() {
    if (this.sectionTitle == 'Documentos de Apoyo' && this.open) {
      this.closeSection();
      return;
    }
    this.sectionTitle = 'Documentos de Apoyo';
    this.open = true;
  }
}
