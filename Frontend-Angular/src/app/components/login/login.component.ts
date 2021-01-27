import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserLogin } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserLogin;
  wrongCombination: string;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.checkForError();
  }

  async onSubmit() {
    this.user = new UserLogin();
    this.user.username = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;

    const response = await this.authService.login(this.user).toPromise();

    this.authService.saveUser(response, this.user.username);
    this.router.navigate(['planner']);
  }

  checkForError() {
    this.route.paramMap.subscribe(params => {
      this.wrongCombination = params.get('error');
    });
    if (this.wrongCombination !== null && this.wrongCombination !== undefined) {
      this.loginForm.reset();
    }
  }

}
