import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Observable } from 'rxjs';
import { differenceInCalendarYears } from 'date-fns';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  fromDate: Date;
  toDate: Date;
  
  quotes$: Observable<(string | number)[][]> = this.priceQuery.priceQueries$;

  maxDate = new Date(); //  date-pickers should not allow selection of dates after the current day.

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      // calculating years instead of passing 'max' to improve performance.
      const period = this.calucaltePeriod(toDate, fromDate);
      const fromDateNumeric = fromDate.getTime();
      const toDateNumeric = toDate.getTime();
      this.priceQuery.fetchQuote(symbol, period, fromDateNumeric, toDateNumeric);
    }
  }

  calucaltePeriod(toDate, fromDate) {
    const years = differenceInCalendarYears(toDate, fromDate);
    switch (true) {
      case (years < 2):
        return '1y';

      case (years < 3):
        return '2y';

      case (years < 6):
        return '5y';

      default:
        return 'max';
    }
  }
}
