import { Component } from '@angular/core';
import { Branding } from '../../models/branding';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  brand: Branding = {} as Branding;
  constructor(private stateService: StateService){
    
  }

  ngOnInit(): void {
    this.stateService.branding$.subscribe(branding => {
     this.brand = branding;
   });
   }
}
