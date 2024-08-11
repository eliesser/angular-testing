import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';
import { Person } from '../../models/person';
import { clickElement, getText, queryAll } from '../../../testing';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    // Arrange
    component.people = [
      new Person('Nicolas', 'Molina', 23, 1, 1),
      new Person('Valentina', 'Molina', 12, 2, 3),
      new Person('Santiago', 'Molina', 12, 2, 3),
    ];
    // Act
    fixture.detectChanges();
    const debugElement = queryAll(fixture, 'app-person');
    // Assert
    expect(debugElement.length).toEqual(3);
  });

  it('should click on button Choose and valid selected person', () => {
    // Arrange
    // Act
    clickElement(fixture, 'btn-choose', true);
    fixture.detectChanges();
    // Assert
    expect(getText(fixture, 'li')).toEqual(`Name: ${component.people[0].name}`);
  });
});
