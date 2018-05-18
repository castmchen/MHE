import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { UserModel } from './model/user-model';

@Injectable({
  providedIn: 'root'
})

export class UserStateServiceService {

  private IsLogined: boolean;
  private changes: Subject<any> = new Subject<any>();
  constructor() { }

  userState$ = this.changes.asObservable();

  login(userInfo: UserModel){
    if(!this.IsLogined){
      this.IsLogined = true;
      this.changes.next(userInfo);
    }
  }

  logout(){
    this.IsLogined = false;
    this.changes.next();
    window.location.href = '/';
  }

}
