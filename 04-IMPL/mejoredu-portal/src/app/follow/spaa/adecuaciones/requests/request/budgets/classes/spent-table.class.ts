import { Spent } from './spent.class';

export class SpentTable {
  mountsAmounts = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  };
  table: Spent[] = [];

  getTotalAmount(): number {
    if (this.table.length === 0) return 0;
    this.mountsAmounts.january =
      this.table.map((item) => item.january)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.february =
      this.table.map((item) => item.february)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.march =
      this.table.map((item) => item.march)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.april =
      this.table.map((item) => item.april)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.may =
      this.table.map((item) => item.may)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.june =
      this.table.map((item) => item.june)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.july =
      this.table.map((item) => item.july)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.august =
      this.table.map((item) => item.august)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.september =
      this.table.map((item) => item.september)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.october =
      this.table.map((item) => item.october)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.november =
      this.table.map((item) => item.november)?.reduce((a, b) => a + b) || 0;
    this.mountsAmounts.december =
      this.table.map((item) => item.december)?.reduce((a, b) => a + b) || 0;
    return Object.values(this.mountsAmounts)?.reduce((a, b) => a + b) || 0;
  }

  sumByRow(row: Spent): number {
    return (
      row.january +
      row.february +
      row.march +
      row.april +
      row.may +
      row.june +
      row.july +
      row.august +
      row.september +
      row.october +
      row.november +
      row.december
    );
  }

  parseMoneyFormat(value: number): string {
    return value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  }
}
