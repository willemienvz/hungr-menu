import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../models/menu';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Restaurant } from '../../models/restaurant';
import { Branding } from '../../models/branding';
import { StateService } from '../../state.service';
import { Category } from '../../models/category';
import { MenuItem } from '../../models/menu-item';
import { ViewTimeService } from '../../services/view-time.service';
import { Special } from '../../models/special';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy{
  activeMenu:Menu = {} as Menu;
  activeIndex = 0; 
  activeRestaurant:Restaurant = {} as Restaurant;
  brand:Branding = {} as Branding;
  selectedCategory: Category= {} as Category;
  categories: Category[]= [];
  subcategories: Category[] = [];
  items: MenuItem[] = [];
  selectedCategoryId:number = 0;
  activeSubcategoryId: number | null = null;
  dynamicStyles: { [key: string]: string } = {};
  holdIDRestaurant:string = '';
  specialsList: string[] = [];

  private startTime: number = 0;
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private stateService: StateService,
    private router: Router,
    private viewTimeService: ViewTimeService
  ) { }

  ngOnInit(): void {
  

    this.startTime = Date.now();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.holdIDRestaurant = id;
     
      this.fetchMenu(id); 
      
    });
    this.stateService.menu$.subscribe(menu => this.activeMenu = menu);
    this.stateService.restaurant$.subscribe(restaurant => this.activeRestaurant = restaurant);
    this.stateService.branding$.subscribe(branding => this.brand = branding);
    this.selectedCategory = this.categories[0];
   
  }

  ngOnDestroy(): void {
    const endTime = Date.now();
    const viewingTime = endTime - this.startTime;
    this.viewTimeService.recordViewingTime(this.activeMenu.menuID, viewingTime); 
  }

  setActive(index: number, subcategoryId: number | null) {
    this.activeIndex = index;
    this.activeSubcategoryId = subcategoryId;
    this.getFilteredItems();
  }

  fetchSpecials(id:string){
      this.firestore.collection<Special>('specials', ref => ref.where('menu', '==', id))
      .valueChanges()
      .subscribe(specials => {
        this.specialsList = specials.map(special => special.imageUrl);
      });
    }


  fetchMenu(id:string){
    this.firestore.collection<Restaurant>('restuarants', ref => ref.where('restaurantID', '==', id))
    .valueChanges()
    .subscribe(restaurant => {
      this.activeRestaurant = restaurant[0];
      this.stateService.setRestaurant(this.activeRestaurant);
      console.log('activeRestaurant', this.activeRestaurant);
      this.firestore.collection<Menu>('menus', ref => ref.where('menuID', '==', this.activeRestaurant.menuID))
      .valueChanges()
      .subscribe(menus => {
        this.activeMenu = menus[0];
        this.categories = this.activeMenu.categories;
        this.selectedCategory = this.categories[0];
        this.subcategories = this.categories[0].subcategories || [];
        this.items = this.activeMenu.items;
        this.stateService.setMenu(this.activeMenu);
        console.log('activeMenu', this.activeMenu);
        this.fetchSpecials(this.activeMenu.menuID);
       
      });

      this.firestore.collection<Branding>('branding', ref => ref.where('parentID', '==', this.activeRestaurant.ownerID))
      .valueChanges()
      .subscribe(brand => {
        this.brand = brand[0];
        this.stateService.setBranding(this.brand);
        this.setDynamicStyles();
        console.log('brand', this.brand);
      });
    });

    
  }

  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.selectedCategoryId = this.selectedCategory.id;
      this.subcategories = this.selectedCategory.subcategories || [];
  
      if (this.subcategories.length > 0) {
        this.activeSubcategoryId = this.subcategories[0].id;
      } else {
        this.activeSubcategoryId = null;
      }
      this.getFilteredItems();
    } else {
      console.log('No category selected.');
    }
  }

onSubcategoryChange(subcategory: Category) {
  this.activeSubcategoryId = subcategory.id;
  this.getFilteredItems();
}
getFilteredItems() {
   let id= null;
  if (this.activeSubcategoryId !== null){
    id = this.activeSubcategoryId;
  }else{
    id = this.selectedCategoryId;
  }
  const filteredItems = this.items.filter(item => item.categoryId === id);


  return filteredItems
}

navigateToItem(itemId: number) {
  this.router.navigate([`/${this.holdIDRestaurant}/items/${itemId}`]);
}

  setDynamicStyles() {
    console.log(this.brand.mainHeadingColor);
    this.dynamicStyles = {
      color: this.brand.mainHeadingColor,
      fontSize: this.getFontSize(this.brand.mainHeadingSize),
      fontFamily: this.brand.mainHeadingTypeface,
      textTransform: this.getTextTransform(this.brand.mainHeadingLettercase)
    };
  }

  getFontSize(size: string): string {
    switch (size) {
      case 'Small': return '12px';
      case 'Medium': return '16px';
      case 'Large': return '24px';
      default: return '16px';
    }
  }

  getTextTransform(caseType: string): string {
    switch (caseType) {
      case 'uppercase': return 'uppercase';
      case 'lowercase': return 'lowercase';
      case 'capitalize': return 'capitalize';
      default: return 'none';
    }
  }
}
