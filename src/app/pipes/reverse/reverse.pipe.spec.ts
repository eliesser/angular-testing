import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ReversePipe } from './reverse.pipe';
import { query } from '../../../testing';

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
    <h5>{{ 'amor' | reverse }}</h5>
    <input [(ngModel)]="text" />
    <p>{{ text | reverse }}</p>
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
    const h5De = query(fixture, 'h5');
    expect(h5De.nativeElement.textContent).toEqual('roma');
  });

  it('should apply reverse pipe when typing in the input', () => {
    const inputDe = query(fixture, 'input');
    const inputEl: HTMLInputElement = inputDe.nativeElement;
    const pDe = query(fixture, 'p');

    expect(pDe.nativeElement.textContent).toEqual('');

    inputEl.value = 'ANA 2'; // 2 ANA
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(pDe.nativeElement.textContent).toEqual('2 ANA');
  });
});
