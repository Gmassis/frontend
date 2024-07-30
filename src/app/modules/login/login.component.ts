import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InputComponent } from '../../shared/input/input.component';
import { LoginViewModel } from './login-view.model';
import { LoginService } from '../../services/login/login.service';
import { UserResponse } from '../../services/login/user.response';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StateService } from '../../services/state/state.service';
import { StateConstants } from '../../services/state/state.const';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  public viewModel!: LoginViewModel;

  constructor(
    private login: LoginService,
    private register: RegisterService,
    private snackBar: MatSnackBar,
    private state: StateService,
    private router: Router,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.defineViewModelInit();
  }

  public onSubmit(): void {
    if (!this.viewModel.form) {
      this.state.sessao.delete(StateConstants.CART);
      this.state.sessao.delete(StateConstants.ORIGE_ROUTE);
      this.state.sessao.delete(StateConstants.USER);
      this.buildViewModelSignIn();
      return;
    }

    const values = this.inputs.map((input) => input.valueInput);
    const hasInvalidValue = values.some(
      (value) => !value || value.trim() === ''
    );
    if (hasInvalidValue) {
      this.openSnackbar(`One or more input fields are invalid.`);
      return;
    }

    if (this.viewModel.isSignup) {
      if (
        values[2].toUpperCase() !== 'FEMALE' &&
        values[2].toUpperCase() !== 'MALE'
      ) {
        this.openSnackbar(`One or more input fields are invalid.`);
        return;
      }
      this.registerUser(values[1], values[0], values[3], values[2]);
      return;
    }

    this.loginUser(values[0], values[1]);
  }

  public onClickLinkHandle(): void {
    if (this.viewModel.isSignup) {
      this.buildViewModelSignIn();
      return;
    }

    this.buildViewModelSignUp();
  }

  public onClickBack(): void {
    const orige = this.state.sessao.get(StateConstants.ORIGE_ROUTE) || 'home';
    this.router.navigate([orige]);
  }

  private buildViewModelSignIn(): void {
    this.viewModel = {
      title: 'Sign in / Sign up',
      form: true,
      isSignup: false,
      labelSignInUp: "Don't have an account?",
      labelLink: 'Register',
      button: 'Sign in',
    } as LoginViewModel;
  }

  private buildViewModelSignUp(): void {
    this.viewModel = {
      title: 'Sign in / Sign up',
      form: true,
      isSignup: true,
      labelSignInUp: 'Do you have an account?',
      labelLink: 'Log in',
      button: 'Sign up',
    } as LoginViewModel;
  }

  private defineViewModelInit(): void {
    let user: UserResponse = this.state.sessao.get(StateConstants.USER);

    if (!user) {
      const userString = sessionStorage.getItem(StateConstants.USER);
      user = userString ? JSON.parse(userString) : null;
    }

    if (!user) {
      this.buildViewModelSignIn();
      return;
    }

    this.buildViewModelLogged(user.name, user.email, user.gender);
  }

  private buildViewModelLogged(
    name: string,
    email: string,
    gender: string
  ): void {
    this.viewModel = {
      title: 'Profile',
      form: false,
      button: 'Sign out',
      name,
      email,
      gender,
    } as LoginViewModel;
  }

  private loginUser(email: string, pass: string): void {
    this.loading.ligar();
    this.login
      .execute$(email, pass)
      .pipe(
        tap((user: UserResponse) => {
          this.state.sessao.set(StateConstants.USER, user);
          sessionStorage.setItem(StateConstants.USER, JSON.stringify(user));
          this.buildViewModelLogged(user.name, user.email, user.gender);
          this.openSnackbar(`Login successful.`);
        }),
        catchError((_) => {
          this.openSnackbar(`Incorrect email or password.`);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.desligar();
        })
      )
      .subscribe();
  }

  private registerUser(
    name: string,
    email: string,
    pass: string,
    gender: string
  ): void {
    this.loading.ligar();
    this.register
      .execute$(name, email, pass, gender.toUpperCase())
      .pipe(
        tap((_) => {
          this.buildViewModelSignIn();
          this.openSnackbar(`Sign up successful.`);
        }),
        catchError((error: HttpErrorResponse) => {
          if (
            error &&
            error.error &&
            error.error.message &&
            error.error.message === 'User already exists.'
          ) {
            this.openSnackbar(`User already exists.`);
            return EMPTY;
          }

          this.openSnackbar(`Error during sign up.`);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.desligar();
        })
      )
      .subscribe();
  }

  private openSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
