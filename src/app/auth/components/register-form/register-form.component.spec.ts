import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterFormComponent } from './register-form.component';
import { UsersService } from '../../../services/user/user.service';
import {
  asyncData,
  asyncError,
  clickElement,
  getText,
  mockObservable,
  setCheckboxValue,
  setInputValue,
} from '../../../../testing';
import { User } from '../../../models/user.model';
import { generateOneUser } from '../../../models/user.mock';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', [
      'create',
      'isAvailableByEmail',
    ]);

    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UsersService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    component = fixture.componentInstance;
    userService.isAvailableByEmail.and.returnValue(
      mockObservable({ isAvailable: true })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the emailField be invalid', () => {
    component.emailField?.setValue('esto no es un correo');
    expect(component.emailField?.invalid)
      .withContext('wrong email')
      .toBeTruthy();

    component.emailField?.setValue('');
    expect(component.emailField?.invalid).withContext('empty').toBeTruthy();
  });

  it('should the passwordField be invalid', () => {
    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid).withContext('empty').toBeTruthy();

    component.passwordField?.setValue('12345');
    expect(component.passwordField?.invalid).withContext('12345').toBeTruthy();

    component.passwordField?.setValue('asasaasasdsdsd');
    expect(component.passwordField?.invalid)
      .withContext('without number')
      .toBeTruthy();

    component.passwordField?.setValue('asas1aasasdsdsd');
    expect(component.passwordField?.valid).withContext('rigth').toBeTruthy();
  });

  it('should the form be invalid', () => {
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: false,
    });
    expect(component.form.invalid).toBeTruthy();
  });

  it('should the emailField be invalid from UI', () => {
    // Arrange
    // Act
    setInputValue(fixture, 'email', 'esto no es un correo', true);
    fixture.detectChanges();

    // Assert
    expect(component.emailField?.invalid)
      .withContext('wrong email')
      .toBeTruthy();

    expect(getText(fixture, 'emailHasError'))
      .withContext('wrong msg')
      .toContain("It's not a email");
  });

  it('should send the form successfully', () => {
    // Arrange
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: true,
    });
    const mockUser: User = generateOneUser();
    userService.create.and.returnValue(mockObservable(mockUser));
    // Act
    component.register(new Event('submit'));
    // Assert
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  });

  it('should send the form successfully and "loading" => "success"', fakeAsync(() => {
    // Arrange
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: true,
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));

    // Act
    component.register(new Event('submit'));
    expect(component.status).toEqual('loading');

    tick(); // exec pending tasks
    fixture.detectChanges();

    // Assert
    expect(component.status).toEqual('success');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should send the form successfully from UI', fakeAsync(() => {
    // Arrange
    setInputValue(fixture, 'input#name', 'Nico');
    setInputValue(fixture, 'input#email', 'nico@gmil.com');
    setInputValue(fixture, 'input#password', '12121212');
    setInputValue(fixture, 'input#confirmPassword', '12121212');
    setCheckboxValue(fixture, 'input#terms', true);
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));

    // Act
    clickElement(fixture, 'btn-submit', true);
    fixture.detectChanges();
    expect(component.status).toEqual('loading');

    tick(); // exec pending tasks
    fixture.detectChanges();

    // Assert
    expect(component.status).toEqual('success');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should send the form successfully and "loading" => "success"', fakeAsync(() => {
    // Arrange
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: true,
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));
    // Act
    component.register(new Event('submit'));
    expect(component.status).toEqual('loading');

    tick(); // exec pending tasks
    fixture.detectChanges();

    // Assert
    expect(component.status).toEqual('success');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should send the form from UI but with error in the service', fakeAsync(() => {
    // Arrange
    setInputValue(fixture, 'input#name', 'Nico');
    setInputValue(fixture, 'input#email', 'nico@gmil.com');
    setInputValue(fixture, 'input#password', '12121212');
    setInputValue(fixture, 'input#confirmPassword', '12121212');
    setCheckboxValue(fixture, 'input#terms', true);
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncError(mockUser));

    // Act
    clickElement(fixture, 'btn-submit', true);

    fixture.detectChanges();
    expect(component.status).toEqual('loading');

    tick(); // exec pending tasks
    fixture.detectChanges();

    // Assert
    expect(component.status).toEqual('error');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should show error with an email invalid', () => {
    // Arrange
    userService.isAvailableByEmail.and.returnValue(
      mockObservable({ isAvailable: false })
    );
    setInputValue(fixture, 'input#email', 'nico@mail.com');
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.emailField?.invalid).toBeTrue();
    expect(userService.isAvailableByEmail).toHaveBeenCalledWith(
      'nico@mail.com'
    );
    // reto
    const errorMsg = getText(fixture, 'emailField-not-available');
    expect(errorMsg).toContain('The email is already registered');
  });
});
