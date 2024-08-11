import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  asyncData,
  clickElement,
  getText,
  query,
  queryAllByDirective,
} from '../testing';

import { routes } from './app.routes';
import { PeopleComponent } from './components/people/people.component';
import { OthersComponent } from './components/others/others.component';
import { PicoPreviewComponent } from './components/pico-preview/pico-preview.component';
import { provideHttpClient } from '@angular/common/http';
import { ProductsService } from './services/products/products.service';
import { generateManyProducts } from './models/products.mock';

xdescribe('App Integration test', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAll',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        PeopleComponent,
        PicoPreviewComponent,
        OthersComponent,
        provideHttpClient(),
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [{ provide: ProductsService, useValue: productServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // providers
    router = TestBed.inject(Router);
    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;

    router.initialNavigation();

    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should there are 7 routerLinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);
    expect(links.length).toEqual(7);
  });

  it('should render OtherComponent when clicked', fakeAsync(() => {
    const productsMocks = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMocks));

    clickElement(fixture, 'others-link', true);

    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - OthersComponent

    tick(); // exex getAll
    fixture.detectChanges();

    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
    const text = getText(fixture, 'products-length');
    expect(text).toContain(productsMocks.length);
  }));

  it('should render PicoPreviewComponent when clicked', fakeAsync(() => {
    clickElement(fixture, 'pico-link', true);

    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - PicoPreviewComponent

    expect(router.url).toEqual('/pico-preview');
    const element = query(fixture, 'app-pico-preview');
    expect(element).not.toBeNull();
  }));
});
