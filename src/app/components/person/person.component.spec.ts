import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';
import { Person } from '../../models/person';
import { clickElement, getText } from '../../../testing';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Nicolas"', () => {
    component.person = new Person('Nicolas', 'Molina', 28, 89, 1.4);
    expect(component.person.name).toEqual('Nicolas');
  });

  it('should have <h3> with "Hola, {person.name}"', () => {
    // Arrange
    component.person = new Person('Valentina', 'Molina', 28, 89, 1.4);
    const expectMsg = `Hola, ${component.person.name}`;
    // Act
    fixture.detectChanges();
    // Assert
    expect(getText(fixture, 'title')).toEqual(expectMsg);
  });

  it('should have <p> with "Mi altura es {person.height}"', () => {
    // Arrange
    component.person = new Person('Valentina', 'Molina', 28, 89, 1.4);
    // Act
    fixture.detectChanges();
    // Assert
    expect(getText(fixture, 'height')).toContain(component.person.height);
  });

  it('should display a text with IMC when call calculateIMC', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    // Act
    component.calculateIMC();
    fixture.detectChanges();
    // Assert
    expect(getText(fixture, 'btn-imc')).toContain(expectMsg);
  });

  it('should display a text with IMC when do click', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    // Act
    clickElement(fixture, 'btn-imc', true);
    fixture.detectChanges();
    // Assert
    expect(getText(fixture, 'btn-imc')).toContain(expectMsg);
  });

  it('should raise selected event when do click', () => {
    // Arrange
    const expectPerson = new Person('Juan', 'Perez', 30, 120, 1.65);
    component.person = expectPerson;

    let selectedPerson: Person | undefined;
    component.onSelected.subscribe((person) => {
      selectedPerson = person;
    });
    // Act
    clickElement(fixture, 'btn-choose', true);
    fixture.detectChanges();
    // Assert
    expect(selectedPerson).toEqual(expectPerson);
  });
});

@Component({
  standalone: true,
  imports: [PersonComponent],
  template: `
    <app-person [person]="person" (onSelected)="onSelected($event)" />
  `,
})
export class HostComponent {
  person = new Person('Santiago', 'Molina', 13, 40, 1.5);
  selectedPerson: Person | undefined;
  onSelected(person: Person) {
    this.selectedPerson = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    // Arrange
    const expectName = component.person.name;
    // Act
    fixture.detectChanges();
    // Assert
    expect(getText(fixture, 'title')).toContain(expectName);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    // Act
    clickElement(fixture, 'btn-choose', true);
    fixture.detectChanges();
    // Assert
    expect(component.selectedPerson).toEqual(component.person);
  });
});
