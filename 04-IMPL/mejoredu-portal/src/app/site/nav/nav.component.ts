import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMenu, ISubMenu } from './interfaces/menu.interface';
import { menu } from './menu.collection';
import { AppService } from '@common/app.service';
import { CurrentUserI } from '@common/interfaces/user.interface';
import { IDatosUsuario, IRole } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  private _inside: boolean = false;
  @Input() showMenu: boolean = false;
  @Output() toggleOpen: EventEmitter<void> = new EventEmitter();
  _menu: IMenu[] = [];
  user: IDatosUsuario;
  menuLocal = structuredClone(menu);
  srollTop: number = 0;

  constructor(private _appService: AppService) {
    this.user = this.ls.get('dUaStEaR');
    // this.user.functionalities.unshift(0);
    const m = this.filterMenuItems(this.user.roles);
    this._setActivePosition();
    this._menu = m;
  }

  deactiveNavOverflow(menu: ISubMenu) {
    if (!menu.children?.length) return;
    const nav = document.getElementById('nav');
    if (nav?.classList.contains('nav-overflow')) return;
    this.srollTop = nav?.scrollTop || 0;
    nav?.classList.add('nav-overflow');
    nav?.setAttribute('style', `top: -${this.srollTop}px`);
  }

  activeNavOverflow(menu?: ISubMenu) {
    const nav = document.getElementById('nav');
    nav?.classList.remove('nav-overflow');
    nav?.removeAttribute('style');
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

  emitToggleOpen(): void {
    this.toggleOpen.emit();
  }

  private _setActivePosition(): void {
    setTimeout(() => {
      const path = this._getPath();
      if (!path) return;
      let top = document.getElementById(path)?.offsetTop || 0;
      top -= 75;
      document.getElementById('menu')?.scrollTo(0, top);
    }, 10);
  }

  private _getPath(): string {
    const path = window.location.pathname.split('/');
    return path[path.length - 1];
  }

  // get user(): IDatosUsuario {
  //   return this._appService.user;
  // }

  getMenu(): IMenu[] {
    return this._menu;
  }

  getActiveParentRoute(): string {
    const path = window.location.pathname.split('/');
    if (path.length >= 1) {
      return decodeURIComponent(path[1]);
    }
    return '';
  }

  filterMenuItems(roles: IRole[]): IMenu[] {
    const idTipoUsuario = this.user.idTipoUsuario;
    const filteredMenu: IMenu[] = [];
    const activeParentRoute = this.getActiveParentRoute();
    const idsRole: string[] = [];
    for (const item of roles) {
      idsRole.push(item.cveFacultad);
    }

    for (const item of this.menuLocal) {
      if (idsRole.includes(item.facultad)) {
        item.active = item.name == activeParentRoute ? true : item.active;

        if (item.children?.length) {
          const newChildren = this.validateChildrenMenu(
            item.children,
            idTipoUsuario
          );
          item.children = newChildren;
        }
        filteredMenu.push(item);
      }
    }
    return filteredMenu;
  }

  validateChildrenMenu(childItem: ISubMenu[], idTipoUsuario: string) {
    const finded = childItem.filter(
      (itemChild) =>
        !itemChild.roles || itemChild.roles?.includes(idTipoUsuario)
    );
    if (finded.length) {
      for (const item of finded) {
        if (item.children?.length) {
          item.children = this.validateChildrenMenu(
            item.children,
            idTipoUsuario
          );
        }
      }
      return finded;
    } else {
      return [];
    }
  }
}
