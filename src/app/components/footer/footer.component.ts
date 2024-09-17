import { Component } from '@angular/core';
import { Branding } from '../../models/branding';
import { StateService } from '../../state.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  brand: Branding = {} as Branding;
  id!: string;
  showCalled:boolean = false;
  constructor(private stateService: StateService,private router: Router){
    
  }

  ngOnInit(): void {
    this.stateService.branding$.subscribe(branding => {
     this.brand = branding;
   });
   this.router.events.subscribe(() => {
    const url = this.router.url;
    const segments = url.split('/');
    if (segments.length > 1) {
      this.id = segments[1]; 
    }
  });
   }

   callForService(){
    this.showCalled=true;
    setTimeout(() => {
      this.showCalled = false;
    }, 5000);
    //implementation needed
   }
}
