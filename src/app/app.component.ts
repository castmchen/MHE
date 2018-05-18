import { Component } from '@angular/core';
import { UserModel } from './model/user-model';
import { Router } from '@angular/router';
import { UserStateServiceService } from './user-state-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private router: Router, private stateService: UserStateServiceService) { 
    this.stateService.userState$.subscribe(
      mission => {
        this.UserState = mission;
    });
  }
  
  public UserState : UserModel;

  loginEvent(userInfo: UserModel){
    if(userInfo != null){
      this.stateService.login(userInfo);
      this.router.navigate(['/manage']);

      // window.location.href = '/manage';
      // this.stateService.userState$.subscribe(p => {
      //   this.UserState = p;
      // })
    }
  }
}

