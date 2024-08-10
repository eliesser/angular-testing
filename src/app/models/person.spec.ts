import { Person } from './person';

describe('Person', () => {
  let person: Person;

  beforeEach(() => {
    person = new Person('Eliesser', 'Freites', 36, 80, 1.7);
  });

  it('should create an instance', () => {
    expect(person).toBeTruthy();
  });

  describe('calculateIMC', () => {
    it('should return a string: down', () => {
      person.weight = 50;

      expect(person.calculateIMC()).toEqual('down');
    });

    it('should return a string: normal', () => {
      person.weight = 70;

      expect(person.calculateIMC()).toEqual('normal');
    });

    it('should return a string: overweight', () => {
      person.weight = 75;

      expect(person.calculateIMC()).toEqual('overweight');
    });

    it('should return a string: overweight level 1', () => {
      person.weight = 80;

      expect(person.calculateIMC()).toEqual('overweight level 1');
    });

    it('should return a string: overweight level 2', () => {
      person.weight = 90;

      expect(person.calculateIMC()).toEqual('overweight level 2');
    });

    it('should return a string: overweight level 3', () => {
      person.weight = 150;

      expect(person.calculateIMC()).toEqual('overweight level 3');
    });

    it('should return a string: not found', () => {
      person.height = -150;

      expect(person.calculateIMC()).toEqual('not found');
    });
  });
});
