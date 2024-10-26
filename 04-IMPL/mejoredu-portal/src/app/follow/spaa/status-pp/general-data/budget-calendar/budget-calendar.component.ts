import { Component } from '@angular/core';
import { BudgetCalendarI } from '../../../adecuaciones/requests/request/arr/budgets-arr/interface/budget-calendar.interface';

@Component({
  selector: 'app-budget-calendar',
  templateUrl: './budget-calendar.component.html',
  styleUrls: ['./budget-calendar.component.scss']
})
export class BudgetCalendarComponent {
  budgetCalendar: BudgetCalendarI[] = [
    {
      status: 'Aprobado',
      total: 0,
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
    }
  ];
}
