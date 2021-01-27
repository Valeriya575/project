import { TestBed, inject } from '@angular/core/testing';

import { LinesService } from './lines.service';

describe('LinesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinesService]
    });
  });

  it('should be created', inject([LinesService], (service: LinesService) => {
    expect(service).toBeTruthy();
  }));
});
