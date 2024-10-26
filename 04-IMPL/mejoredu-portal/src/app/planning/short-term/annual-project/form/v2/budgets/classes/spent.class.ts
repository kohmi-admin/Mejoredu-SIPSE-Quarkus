export class Spent {
  productName: string;
  name: string;
  partial: string;
  anualBudget: number;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;

  constructor(
    productName: string,
    name: string,
    partial: string,
    anualBudget: number,
    january: number,
    february: number,
    march: number,
    april: number,
    may: number,
    june: number,
    july: number,
    august: number,
    september: number,
    october: number,
    november: number,
    december: number
  ) {
    this.productName = productName;
    this.name = name;
    this.partial = partial;
    this.anualBudget = anualBudget;
    this.january = january;
    this.february = february;
    this.march = march;
    this.april = april;
    this.may = may;
    this.june = june;
    this.july = july;
    this.august = august;
    this.september = september;
    this.october = october;
    this.november = november;
    this.december = december;
  }

  getTotal(): number {
    return parseFloat((
      this.january +
      this.february +
      this.march +
      this.april +
      this.may +
      this.june +
      this.july +
      this.august +
      this.september +
      this.october +
      this.november +
      this.december
    ).toFixed(2));
  }

  getTotalMoneyFormat(): string {
    return this.getTotal().toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  }
}
