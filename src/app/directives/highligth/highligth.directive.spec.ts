import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighligthDirective } from './highligth.directive';
import { FormsModule } from '@angular/forms';
import {
  query,
  queryAll,
  queryAllByDirective,
  getNativeElement,
  setInputValue,
} from '../../../testing';

@Component({
  standalone: true,
  imports: [HighligthDirective, FormsModule],
  template: `
    <h5 class="title" highligth>default</h5>
    <h5 highligth="yellow">yellow</h5>
    <p highligth="blue">parrafo</p>
    <p>otro parrafo</p>
    <input data-testid="input" [(ngModel)]="color" [highligth]="color" />
  `,
})
class HostComponent {
  color = 'pink';
}

describe('HighligthDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, HighligthDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have three highligth elements', () => {
    const elements = queryAllByDirective(fixture, HighligthDirective);
    const elementsWithout = queryAll(fixture, '*:not([highligth])');
    expect(elements.length).toEqual(4);
    expect(elementsWithout.length).toEqual(2);
  });

  it('should the elements be match with bgColor', () => {
    const elements = queryAllByDirective(fixture, HighligthDirective);
    expect(elements[0].nativeElement.style.backgroundColor).toEqual('pink');
    expect(elements[1].nativeElement.style.backgroundColor).toEqual('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toEqual('blue');
  });

  it('should the h5.title be defaultColor', () => {
    const titleDe = query(fixture, '.title');
    const dir = titleDe.injector.get(HighligthDirective);
    expect(titleDe.nativeElement.style.backgroundColor).toEqual(
      dir.defaultColor
    );
  });

  it('should bind <input> and change the bgColor', () => {
    const inputEl = getNativeElement(fixture, 'input');

    expect(inputEl.style.backgroundColor).toEqual('pink');
    setInputValue(fixture, 'input', 'red', true);
    fixture.detectChanges();

    expect(inputEl.style.backgroundColor).toEqual('red');
    expect(component.color).toEqual('red');
  });
});
