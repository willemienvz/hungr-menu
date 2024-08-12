import { Component, OnInit } from '@angular/core';
import { Branding } from '../../models/branding';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrl: './mainmenu.component.scss'
})
export class MainmenuComponent implements OnInit {
  isMenuOpen = false;
  brand: Branding = {} as Branding;
  isLoading = true; 
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private stateService: StateService){
    
  }

  ngOnInit(): void {
   this.stateService.branding$.subscribe(branding => {
    this.brand = branding;
    if (this.isBrandFullyPopulated(this.brand)) {
      this.isLoading = false; 
    }
  });
  }

  private isBrandFullyPopulated(brand: Branding): boolean {
    return brand.backgroundColor !== undefined &&
           brand.imageUrl !== undefined 
  }
}
