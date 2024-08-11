import { provideHttpClient } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { defer, of } from 'rxjs';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { ProductsService } from '../../services/products/products.service';
import { generateManyProducts } from '../../models/products.mock';
import { ValueService } from '../../services/value/value.service';

fdescribe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAll',
    ]);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', [
      'getPromiseValue',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, ProductComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: ValueService, useValue: valueServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;

    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('tests for getAllProducts', () => {
    it('should return product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(of(productsMock));
      const countPrev = component.products.length;
      // Act
      component.getAllProducts();
      fixture.detectChanges();
      // Assert
      expect(component.products.length).toEqual(
        productsMock.length + countPrev
      );
    });

    it('should change the status "loading" => "success"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(
        defer(() => Promise.resolve(productsMock))
      );
      // Act
      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(); // exec, obs, setTimeout, promise
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('success');
    }));

    it('should change the status "loading" => "error"', fakeAsync(() => {
      // Arrange
      productService.getAll.and.returnValue(
        defer(() => Promise.reject('error'))
      );
      // Act
      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(4000); // exec, obs, setTimeout, promise
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('error');
    }));
  });

  describe('tests for callPromise', () => {
    it('should call to promise', async () => {
      // Arrange
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      // Act
      await component.callPromise();
      fixture.detectChanges();
      // Assert
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "my mock string" in <p> when btn was clicked', fakeAsync(() => {
      // Arrange
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      const btnDe = fixture.debugElement.query(By.css('button'));
      // Act
      btnDe.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      const rtaDe = fixture.debugElement.query(By.css('p'));
      // Assert
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(rtaDe.nativeElement.textContent).toEqual(mockMsg);
    }));
  });
});
