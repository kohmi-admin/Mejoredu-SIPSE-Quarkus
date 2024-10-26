import { Component } from '@angular/core';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-p016',
  templateUrl: './p016.component.html',
  styleUrls: ['./p016.component.scss'],
})
export class P016Component {
  ls = new SecureLS({ encodingType: 'aes' });

  ngOnDestroy() {
    this.ls.remove('selectedAjustesPP');
    this.ls.remove('selectedValidarPP');
  }
}
