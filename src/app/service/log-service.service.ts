import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  log(log: string): void{

  };

  logWarnning(log: string): void{

  }

  logError(log: string): void{
    
  }
}
