import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  password: string = '';
  showPassword: boolean = false;
  id:string ='default-id';
  
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute
  ) { this.id = this.route.snapshot.paramMap.get('id')?? 'default-id'; }

  ngOnInit() { }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
