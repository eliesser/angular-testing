import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';
import { Person } from '../../models/person';
import { query } from '../../../testing';

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
    const h3Debug: DebugElement = query(fixture, 'h3');
    const h3: HTMLElement = h3Debug.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3?.textContent).toEqual(expectMsg);
  });

  it('should have <p> with "Mi altura es {person.height}"', () => {
    // Arrange
    component.person = new Person('Valentina', 'Molina', 28, 89, 1.4);
    const pDebug: DebugElement = query(fixture, 'p');
    const pElement: HTMLElement = pDebug.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(pElement?.textContent).toContain(component.person.height);
  });

  it('should display a text with IMC when call calculateIMC', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const button = query(fixture, 'button.btn-imc').nativeElement;
    // Act
    component.calculateIMC();
    fixture.detectChanges();
    // Assert
    expect(button.textContent).toContain(expectMsg);
  });

  it('should display a text with IMC when do click', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const buttonDe = query(fixture, 'button.btn-imc');
    const buttonEl = buttonDe.nativeElement;
    // Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(buttonEl.textContent).toContain(expectMsg);
  });

  it('should raise selected event when do click', () => {
    // Arrange
    const expectPerson = new Person('Juan', 'Perez', 30, 120, 1.65);
    component.person = expectPerson;
    const buttonDe = query(fixture, 'button.btn-choose');

    let selectedPerson: Person | undefined;
    component.onSelected.subscribe((person) => {
      selectedPerson = person;
    });
    // Act
    buttonDe.triggerEventHandler('click', null);
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
    const h3De = query(fixture, 'app-person h3');
    const h3El = h3De.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3El.textContent).toContain(expectName);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    const btnDe = query(fixture, 'app-person .btn-choose');
    // Act
    btnDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(component.selectedPerson).toEqual(component.person);
  });
});
