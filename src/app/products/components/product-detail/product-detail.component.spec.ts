import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { ProductsService } from '../../../services/products/products.service';
import { generateOneProduct } from '../../../models/products.mock';
import {
  asyncData,
  asyncError,
  getText,
  mockObservable,
} from '../../../../testing';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let route: ActivatedRouteStub;
  let productsService: jasmine.SpyObj<ProductsService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const routeStub = new ActivatedRouteStub();
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getOne',
    ]);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub;
    productsService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  it('should create', () => {
    const productId = '1';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productsService.getOne.and.returnValue(mockObservable(productMock));

    fixture.detectChanges(); //ngOnInit
    expect(component).toBeTruthy();
  });

  it('should show the product in the view', () => {
    const productId = '2';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productsService.getOne.and.returnValue(mockObservable(productMock));

    fixture.detectChanges(); //ngOnInit
    const titleText = getText(fixture, 'title');
    const priceText = getText(fixture, 'price');
    expect(titleText).toContain(productMock.title);
    expect(priceText).toContain(productMock.price);
    expect(productsService.getOne).toHaveBeenCalledWith(productId);
  });

  it('should go to back without id params', () => {
    route.setParamMap({});
    location.back.and.callThrough(); // mocking
    fixture.detectChanges(); //ngOnInit
    expect(location.back).toHaveBeenCalled();
  });

  it('should change the status "loading" => "success"', fakeAsync(() => {
    const productId = '2';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productsService.getOne.and.returnValue(asyncData(productMock));

    fixture.detectChanges();

    expect(component.status).toEqual('loading');

    tick();

    fixture.detectChanges();

    expect(component.status).toEqual('success');
  }));

  it('should change the status "loading" => "error"', fakeAsync(() => {
    const productId = '2';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productsService.getOne.and.returnValue(asyncError(productMock));

    fixture.detectChanges();

    expect(component.status).toEqual('loading');

    tick();

    fixture.detectChanges();

    expect(component.status).toEqual('error');
  }));
});
