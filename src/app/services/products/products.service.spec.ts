import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpStatusCode, provideHttpClient } from '@angular/common/http';

import { ProductsService } from './products.service';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../../models/product.model';
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

  afterEach(() => {
    httpController.verify();
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
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      req.flush(mockData);
    });
  });

  describe('create', () => {
    it('should return a new product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const productDTO: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12,
      };

      productsService.create({ ...productDTO }).subscribe((product) => {
        expect(product).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.body).toEqual(productDTO);
      expect(req.request.method).toEqual('POST');
      req.flush(mockData);
    });
  });

  describe('update', () => {
    it('should return a product updated', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product',
      };
      const productId = '1';
      productsService.update(productId, { ...dto }).subscribe((product) => {
        expect(product).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('delete', () => {
    it('should return a product updated', (doneFn) => {
      const mockData = true;
      const id = '12';

      productsService.delete(id).subscribe((isDelete) => {
        expect(isDelete).toBeTruthy();
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('getOne', () => {
    it('should return a product', (doneFn) => {
      const mockData: Product = generateOneProduct();

      const productId = '1';
      productsService.getOne(productId).subscribe((product) => {
        expect(product).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right msg when status code is 404', (doneFn) => {
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };

      const productId = '1';
      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right msg when status code is 409', (doneFn) => {
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };

      const productId = '1';
      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right msg when status code is 401', (doneFn) => {
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };

      const productId = '1';
      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('No estas permitido');
          doneFn();
        },
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right msg when other status code', (doneFn) => {
      const msgError = 'error message';
      const mockError = {
        status: HttpStatusCode.MethodNotAllowed,
        statusText: msgError,
      };

      const productId = '1';
      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});
