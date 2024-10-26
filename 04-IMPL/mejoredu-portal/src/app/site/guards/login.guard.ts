import { inject } from '@angular/core';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';

export const LoginGuard = () => {
  const router = inject(Router);
  const ls = new SecureLS({ encodingType: 'aes' });
  if (ls.get('dUaStEaR')) {
    return true;
  } else {
    return router.navigate(['/login']);
  }
};
