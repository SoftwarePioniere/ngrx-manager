import { TestBed } from '@angular/core/testing';

import { NgrxManagerService } from './ngrx-manager.service';

describe('NgrxManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgrxManagerService = TestBed.get(NgrxManagerService);
    expect(service).toBeTruthy();
  });
});
