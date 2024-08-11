import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersComponent } from './others.component';
import { provideHttpClient } from '@angular/common/http';

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OthersComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(OthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
