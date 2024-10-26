import { Component, OnInit } from '@angular/core';
import { MENUI, menu } from './menu.collection';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  faBell = faBell;
  faSignOut = faSignOut
  menu: MENUI[] = [];

  ngOnInit(): void {
    this._evalueatePermission();
  }

  private _evalueatePermission() {
    const permissions = [1,2,3,4]
    this.menu = menu.filter(m => permissions.includes(m.id));
  }
}
