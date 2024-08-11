import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Person } from '../../models/person';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
})
export class PersonComponent {
  @Input() person: Person = new Person('', '', 0, 0, 0);
  @Output() onSelected = new EventEmitter<Person>();
  imc = '';

  calculateIMC() {
    this.imc = this.person.calculateIMC();
  }

  onClick() {
    this.onSelected.emit(this.person);
  }
}
