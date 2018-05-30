import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal'
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { AppComponent } from './app.component';
import { AppManagementComponent } from './app-management/app-management.component';
import { AppFlowComponent } from './app-flow/app-flow.component';
import { LoginComponent } from './login/login.component';
import { HttpService } from './service/http-service.service'
import { LogService } from './service/log-service.service'
import { UserStateServiceService } from './user-state-service.service'
import { Observable, of, observable, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { setTheme } from 'ngx-bootstrap/utils';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ConnectorService } from './service/Connector/connector-service.service';
import { CswitchComponent } from './cswitch/cswitch.component'

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'manage', component: AppManagementComponent },
  { path: 'flow', component: AppFlowComponent },
  { path: 'main', component: MainComponent},
  // { path: '', redirectTo:'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AppManagementComponent,
    AppFlowComponent,
    LoginComponent,
    MainComponent,
    CswitchComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { enableTracing:true }),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    LogService,
    HttpService,
    HttpClient,
    UserStateServiceService,
    ConnectorService
  ],
  bootstrap: [AppComponent]
})



export class AppModule {
}

