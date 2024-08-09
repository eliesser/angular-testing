import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductsService } from './products.service';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environments';
import {
  generateManyProducts,
  generateOneProduct,
} from '../../models/products.mock';

fdescribe('ProductsService', () => {
  let productsService: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    productsService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productsService).toBeTruthy();
  });

  describe('getAllSimple', () => {
    it('should return a products list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(2);

      productsService.getAllSimple().subscribe((products) => {
        expect(products.length).toEqual(mockData.length);
        expect(products).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });
  });

  describe('getAll', () => {
    it('should return a products list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);

      productsService.getAll().subscribe((products) => {
        expect(products.length).toEqual(mockData.length);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });

    it('should return a products list with taxes', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100,
        },
        {
          ...generateOneProduct(),
          price: 200,
        },
        {
          ...generateOneProduct(),
          price: 0,
        },
        {
          ...generateOneProduct(),
          price: -100,
        },
      ];

      productsService.getAll().subscribe((products) => {
        expect(products[0].taxes).toEqual(19);
        expect(products[1].taxes).toEqual(38);
        expect(products[2].taxes).toEqual(0);
        expect(products[3].taxes).toEqual(0);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      const limit = 10;
      const offset = 3;
      const mockData: Product[] = generateManyProducts(3);

      productsService.getAll(limit, offset).subscribe((products) => {
        expect(products.length).toEqual(mockData.length);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      httpController.verify();
    });
  });
});
