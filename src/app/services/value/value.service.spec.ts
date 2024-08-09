import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService],
    });
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getValue', () => {
    it('should return "my value"', () => {
      const value = service.getValue();

      expect(value).toBe('my value');
    });
  });

  describe('setValue', () => {
    it('should change the value', () => {
      service.setValue('change');
      const value = service.getValue();
      expect(value).toBe('change');
    });
  });

  describe('getPromiseValue', () => {
    it('should return "Promise value" from promise', async () => {
      const value = await service.getPromiseValue();

      expect(value).toBe('Promise value');
    });
  });

  describe('getObservableValue', () => {
    it('should return "Observable value" from Observable', (doneFn) => {
      service.getObservableValue().subscribe((value) => {
        expect(value).toBe('Observable value');
        doneFn();
      });
    });
  });
});
