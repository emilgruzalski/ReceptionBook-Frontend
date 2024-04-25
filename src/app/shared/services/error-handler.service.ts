import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorModalComponent } from './../modals/error-modal/error-modal.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {
  public errorMessage: string = '';

  constructor(private router: Router, private modal: BsModalService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  public handleError = (error: HttpErrorResponse) => {
    console.log("Handling Error:", error);
    if (error.status === 500) {
      this.handle500Error(error);
    }
    else if(error.status === 404){
      return this.handleNotFound(error);
    }
    else if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 401) {
      return this.handleUnauthorized(error);
    }
    else if(error.status === 403) {
      return this.handleForbidden(error);
    } else {
      this.handleOtherError(error);
    }
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    console.log("ErrorMessage to Modal:", error);  // Loguje wiadomość błędu przekazywaną do modalu

    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Error Message',
        modalBodyText: error.message,
        okButtonText: 'OK'
      }
    };
    this.modal.show(ErrorModalComponent, config);
  }

  private handleForbidden = (error: HttpErrorResponse) => {
    this.router.navigate(["/forbidden"], { queryParams: { returnUrl: this.router.url }});
    return "Forbidden";
  }

  private handleUnauthorized = (error: HttpErrorResponse) => {
    if(this.router.url === '/authentication/login') {
      return 'Authentication failed. Wrong Username or Password';
    }
    else {
      this.router.navigate(['/authentication/login'], { queryParams: { returnUrl: this.router.url }});
      return error.message;
    }
  }

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  }

  private handleNotFound = (error: HttpErrorResponse): string => {
    this.router.navigate(['/404']);
    return error.message;
  }

  private handleBadRequest = (error: HttpErrorResponse) => {
    if(this.router.url === '/authentication/register' ||
       this.router.url.startsWith('/authentication/resetpassword')){
        let message = '';
        if (error.error.errors) {
            const values = Object.values(error.error.errors);
            values.map((m: string) => {
                message += m + '<br>';
            });
            return message.slice(0, -4); // Usuwa ostatni '<br>'
        }
        return 'Nieokreślony błąd, proszę spróbować później.'; // Dodaj domyślny komunikat, jeśli nie ma szczegółów błędu
    } else {
        // Pobierz 'Message' bezpośrednio z error.error, jeśli istnieje
        return error.error.Message || 'Nieznany błąd, proszę spróbować później.'; // Dodaj bezpiecznik dla pustego Message
    }
}

  private createErrorMessage = (error: HttpErrorResponse) => {
    // Sprawdzenie, czy obiekt błędu zawiera właściwość 'error', która jest obiektem
    if (error.error && typeof error.error === 'object') {
        // Sprawdzenie, czy obiekt 'error.error' zawiera 'Message'
        if ('Message' in error.error) {
            this.errorMessage = error.error.Message;
        } else {
            // Użycie JSON.stringify, aby sformatować obiekt
            this.errorMessage = JSON.stringify(error.error, null, 2);
        }
    } else if (typeof error.error === 'string') {
        // Jeśli error.error jest stringiem, bezpośrednio użyj tego jako wiadomość
        this.errorMessage = error.error;
    } else if (error.message) {
        // Użycie ogólnej wiadomości błędu z obiektu HttpErrorResponse
        this.errorMessage = error.message;
    } else {
        // Ustawienie domyślnego komunikatu
        this.errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
    }
}



}
