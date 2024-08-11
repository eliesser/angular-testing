import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { Person } from '../../models/person';
import { PersonComponent } from '../person/person.component';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [PersonComponent, NgIf, NgFor],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
})
export class PeopleComponent {
  people: Person[] = [
    new Person('Nicolas', 'Molina', 23, 1, 1),
    new Person('Valentina', 'Molina', 12, 2, 3),
  ];

  selectedPerson: Person | null = null;

  choose(person: Person) {
    this.selectedPerson = person;
  }
}
