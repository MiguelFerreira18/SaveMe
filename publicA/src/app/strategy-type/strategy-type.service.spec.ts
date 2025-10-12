import { TestBed } from '@angular/core/testing';

import { StrategyTypeService } from './strategy-type.service';

describe('StrategyTypeService', () => {
  let service: StrategyTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
