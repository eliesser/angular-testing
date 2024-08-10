import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { Auth } from '../../models/auth.model';
import { TokenService } from '../token/token.service';
import { environment } from '../../../environments/environments';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  xdescribe('login', () => {
    it('should return access_token', (doneFn) => {
      const mockData: Auth = {
        access_token: '121212',
      };

      const email = 'nico@gmail.com';
      const password = '1212';

      authService.login(email, password).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledOnceWith(
            mockData.access_token
          );
          doneFn();
        },
        error: (error) => {
          doneFn.fail('Request failed');
        },
      });

      const url = `${environment.API_URL}/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.body).toEqual({ email, password });
      expect(req.request.method).toEqual('POST');
      req.flush(mockData);
    });

    it('should call to saveToken', (doneFn) => {
      //Arrange
      const mockData: Auth = {
        access_token: '121212',
      };
      const email = 'nico@gmail.com';
      const password = '1212';
      spyOn(tokenService, 'saveToken').and.callThrough();
      //Act
      authService.login(email, password).subscribe((data) => {
        //Assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith('121212');
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });
});
