import { Component, OnInit  } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { UserRegister } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the RegistratePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {
  //@ViewChild("email") email; //catch email field
  //@ViewChild("username") username; //catch username field
  //@ViewChild("password") password; //catch password field
  userData = { "username": "", "password": "", "email": ""};
  signupform: FormGroup;

  user: UserRegister;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private authProvider: AuthProvider,
     private alertCtrl: AlertController
    ) {}

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistratePage');

  }

  async signup(){
    this.user = new UserRegister();
    this.user.username = this.userData.username;
    this.user.password = this.userData.password;
    this.user.email = this.userData.email;
    const registerresponse = await this.authProvider.register(this.user).toPromise();
    if(registerresponse == null){
      return;
    }
    console.log("Registered!")
    const loginresponse = await this.authProvider.login(this.user).toPromise();
    if(loginresponse == null){
      return;
    }
    console.log("Logged in!")

    this.authProvider.saveUser(loginresponse, this.userData.username);
    this.presentAlert();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Successfully registered!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
