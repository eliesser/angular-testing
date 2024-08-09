import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  describe('Test for multiply', () => {
    it('should return a nine', () => {
      //AAA
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta = calculator.multiply(3, 3);
      //Assert
      expect(rta).toEqual(9);
    });

    it('should return a four', () => {
      //AAA
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta = calculator.multiply(1, 4);
      //Assert
      expect(rta).toEqual(4);
    });
  });
  describe('Test for divide', () => {
    it('should return a two', () => {
      //AAA
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta1 = calculator.divide(6, 3);
      //Assert
      expect(rta1).toEqual(2);
    });

    it('should divide for a zero', () => {
      //AAA
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta1 = calculator.divide(6, 0);
      //Assert
      expect(rta1).toBeNull();
    });
  });

  it('tests matchers', () => {
    const name = 'Nicolas';
    let name2;

    expect(name).toBeDefined();
    expect(name2).toBeUndefined();
    expect(1 + 3 === 4).toBeTruthy();
    expect(1 + 3 === 3).toBeFalse();
    expect(5).toBeLessThan(10);
    expect(15).toBeGreaterThan(10);
    expect('123456').toMatch(/123/);
    expect(['apples', 'oranges', 'pears']).toContain('oranges');
  });
});
