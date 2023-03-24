import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorRequestService {
  constructor(private router: Router) {}

  handleErrorDetailUser(error: HttpErrorResponse) {
    console.log(error);
    console.log(error.status);
    if (error.status === 400) {
      console.error('An error occurred:', error.error);
      this.router.navigate(['/unauthorized']);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      this.router.navigate(['/unauthorized']);
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
