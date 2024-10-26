import { Component, OnDestroy, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-o001',
  templateUrl: './o001.component.html',
  styleUrls: ['./o001.component.scss']
})
export class O001Component implements OnInit, OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  body = document.querySelector('body');

  ngOnDestroy(): void {
    this.body?.classList.remove('hideW');
    this.ls.remove('selectedAjustesPP')
    this.ls.remove('selectedValidarPP')
  }

  ngOnInit(): void {
    this.body?.classList.add('hideW');
  }

}