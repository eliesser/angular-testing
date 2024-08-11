import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AppComponent } from './app.component';
import { Component } from '@angular/core';

import { queryAllByDirective, RouterLinkDirectiveStub } from '../testing';

@Component({
  standalone: true,
  selector: 'app-banner',
})
class BannerComponentStub {}

@Component({
  standalone: true,
  selector: 'app-footer',
})
class FooterComponentStub {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BannerComponentStub,
        FooterComponentStub,
        RouterLinkDirectiveStub,
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  xit('should there are 7 routerLinks', () => {
    console.log({ RouterLinkDirectiveStub });
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub);
    console.log({ links });
    expect(links.length).toEqual(7);
  });

  xit('should there are 7 routerLinks with match routes', () => {
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub);
    const routerLinks = links.map((link) =>
      link.injector.get(RouterLinkDirectiveStub)
    );

    expect(links.length).toEqual(7);
    expect(routerLinks[0].linkParams).toEqual('/');
    expect(routerLinks[1].linkParams).toEqual('/auth/register');
  });
});
