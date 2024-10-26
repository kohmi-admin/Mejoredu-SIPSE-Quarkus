import { TestBed } from '@angular/core/testing';

import { ServicesInterceptor } from './services.interceptor';

describe('ServicesInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ServicesInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ServicesInterceptor = TestBed.inject(ServicesInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
