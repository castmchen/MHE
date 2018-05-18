import { Component, OnInit, NgModule, Output, EventEmitter } from '@angular/core';
import { flatten, ngModuleJitUrl } from '@angular/compiler';
import { UserModel } from '../model/user-model';
import { UserService } from '../service/user-service.service'
import { LogService } from '../service/log-service.service'
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[
    UserService    
  ]
})
export class LoginComponent implements OnInit {

  constructor(private UserService: UserService, private LogService: LogService) { }

  ngOnInit() {
  }

  
  private loginFlag : boolean = true;
  private registerFlag : boolean = false;
  private forgetFlag : boolean = false;
  
  public UserInfo: UserModel = new UserModel();
  @Output() loginEvent = new EventEmitter<UserModel>();

 //#region  Flag

 login = function(){
   this.loginFlag = true;
   this.registerFlag = false;
   this.forgetFlag = false;

   this.UserService.UserLogin(this.UserInfo).subscribe(p=>{
     if(p.UserName === this.UserInfo.UserName){
       this.loginEvent.emit(p);
     }
   });
  }

 register = function(){
   this.registerFlag = true;
   this.loginFlag = false;
   this.forgetFlag = false;
 };

 resetPassword = function(){
   this.forgetFlag = true;
   this.loginFlag = false;
   this.registerFlag = false;
 }

 //#endregion

 

}
