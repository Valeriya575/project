import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserLogin } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData = { "username": "", "password": ""};

  signupform: FormGroup;

  user: UserLogin;
  wrongCombination: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    this.signupform = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

  async logIn(){
    this.user = new UserLogin();
    this.user.username = this.userData.username;
    this.user.password = this.userData.password;

    const response = await this.authProvider.login(this.user).toPromise();
    if(response == null){
      return;
    }
    this.authProvider.saveUser(response, this.userData.username);
    this.presentAlert("Successfull!","");
  }
  async presentAlert(title,message) {
    const alert = await this.alertCtrl.create({
      mode: 'md',
      title: title,
      message: '<div style="overflow-y:auto;max-height:240px;">'+message+'</div>',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
  }
}
