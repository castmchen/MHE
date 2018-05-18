import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService } from './log-service.service';
import { Options } from 'selenium-webdriver/firefox';

const httpOptions = {
  headers: new HttpHeaders( { 'Content-Type': 'application/json'} )
};

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(private httpClient: HttpClient, private logService: LogService) { }

  HttpGet<T>(apiUrl: string): Observable<T>{
    if(apiUrl == null || apiUrl == ''){
      return null;
    }

    this.httpClient.get<T>(apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  HttpPost<T>(apiUrl: string, t: T): Observable<T>{
    if(apiUrl == null || apiUrl == ''){
      return null;
    }
    
    this.httpClient.post<T>(apiUrl, t, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError<T>(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      this.logService.logError(error.status +  error.message);
      // todo => redirect to error page.
    }else{
      return throwError('Something wrong, please modify the data of you inputed and try again.');
    }
  }
}
