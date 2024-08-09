import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'testing-services';

  ngOnInit() {
    const calculator = new Calculator();
    const rta = calculator.multiply(3, 3);
    const rta2 = calculator.multiply(3, 0);
  }
}
