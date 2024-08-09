import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipoPreviewComponent } from './pipo-preview.component';

describe('PipoPreviewComponent', () => {
  let component: PipoPreviewComponent;
  let fixture: ComponentFixture<PipoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipoPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
