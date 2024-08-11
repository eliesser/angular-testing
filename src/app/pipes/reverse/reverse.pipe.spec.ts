import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ReversePipe } from './reverse.pipe';
import { getNativeElement, getText } from '../../../testing';

describe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "roma" to "amor"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform('roma');
    expect(rta).toEqual('amor');
  });

  it('should transform "123" to "321"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform('123');
    expect(rta).toEqual('321');
  });
});

@Component({
  standalone: true,
  imports: [FormsModule, ReversePipe],
  template: `
    <h5 data-testid="h5">{{ 'amor' | reverse }}</h5>
    <input data-testid="input" [(ngModel)]="text" />
    <p data-testid="p">{{ text | reverse }}</p>
  `,
})
class HostComponent {
  text = '';
}

describe('ReversePipe from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HostComponent, ReversePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the h5 be "roma"', () => {
    expect(getText(fixture, 'h5')).toEqual('roma');
  });

  it('should apply reverse pipe when typing in the input', () => {
    const inputEl: HTMLInputElement = getNativeElement(fixture, 'input');

    expect(getText(fixture, 'p')).toEqual('');

    inputEl.value = 'ANA 2'; // 2 ANA
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(getText(fixture, 'p')).toEqual('2 ANA');
  });
});
