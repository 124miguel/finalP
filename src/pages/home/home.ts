import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginEmailPage } from '../login-email/login-email';
@Component({
  templateUrl: 'home.html',
  selector: 'home',
})
export class HomePage {
  constructor(private nav: NavController) {

  }
  logOut(){
  this.authData.logoutUser().then(() => {
    this.nav.setRoot(LoginEmailPage);
  });
}
}
