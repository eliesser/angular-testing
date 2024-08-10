export class Person {
  private static readonly IMC_CATEGORIES = [
    { max: 18, category: 'down' },
    { max: 24, category: 'normal' },
    { max: 26, category: 'overweight' },
    { max: 29, category: 'overweight level 1' },
    { max: 39, category: 'overweight level 2' },
    { max: Infinity, category: 'overweight level 3' },
  ];

  constructor(
    public name: string,
    public lastName: string,
    public age: number,
    public weight: number,
    public height: number
  ) {}

  public calculateIMC(): string {
    const imc = this.calculateIMCValue();
    return this.getCategory(imc);
  }

  private calculateIMCValue(): number {
    return Math.round(this.weight / Math.pow(this.height, 2));
  }

  private getCategory(imc: number): string {
    if (this.height > 0 && this.weight > 0)
      for (const category of Person.IMC_CATEGORIES) {
        if (imc >= 0 && imc <= category.max) return category.category;
      }
    return 'not found';
  }
}
