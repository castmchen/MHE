import { Injectable } from '@angular/core';
import { UserModel } from '../model/user-model'
import { Observable, of, observable } from 'rxjs';
import { HttpService } from './http-service.service';
import { getLocaleDateTimeFormat } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  UserLogin(userInfo: UserModel): Observable<UserModel>{

    return new Observable(this.BuildUserSubscriber);
    
    //  return new Observable((obj)=>{
    //    obj.next(userInfo);
    //  });


    // this.httpService.HttpGet("http://localhost:4300/user/get").subscribe(
    //   a => {},
    //   b => {},
    //   () => {}
    // );

    // this.httpService.HttpPost("http://localhost:4300/user/post", userInfo).subscribe(
    //   a => {},
    //   b => {},
    //   () => {}
    // );
  }

  BuildUserSubscriber(observer) {
    let userInfo = new UserModel();
    userInfo.UserId = "1";
    userInfo.UserName = "qiang.c.chen";
    userInfo.Email = "qiang.c.chen@accenture.com";
    userInfo.Password = "qiang.c.chen"
    userInfo.PhoneNumber = "15040616313";
    observer.next(userInfo);
    observer.complete();
    return {unsubscribe() {}};
  }
}
