import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';

// Providers
import { AuthProvider } from '../../../providers/auth';

@Component({
  templateUrl: 'forgot-password.html',
  selector: 'forgot-password',
})

export class ForgotPasswordPage {
  error: any;
  form: any;

  constructor(private loadingCtrl: LoadingController, private auth: AuthProvider) {
    this.form = {
      email: ''
    }
  }

  reset() {
    let loading = this.loadingCtrl.create({
      content: 'Por favor espera...'
    });
    loading.present();

    this.auth.sendPasswordResetEmail(this.form.email).subscribe(data => {
      this.error = 'Pronto recibirá un correo electrónico para cambiar su contraseña.';
      loading.dismiss();
    }, error => {
      this.error = error;
      loading.dismiss();
    })
  }
}
