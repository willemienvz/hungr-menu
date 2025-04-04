import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { SelectTableDialogComponent } from '../select-table-dialog/select-table-dialog.component';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  activeMenu: Menu = {} as Menu;
  activeIndex = 0;
  activeRestaurant: Restaurant = {} as Restaurant;
  brand: Branding = {} as Branding;
  selectedCategory: Category = {} as Category;
  categories: Category[] = [];
  subcategories: Category[] = [];
  items: MenuItem[] = [];
  selectedCategoryId: number = 0;
  activeSubcategoryId: number | null = null;
  dynamicStyles: { [key: string]: string } = {};
  dynamicStylesText: { [key: string]: string } = {};
  holdIDRestaurant: string = '';
  specialsList: string[] = [];
  recommendedItems: MenuItem[] = [];

  slickConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: false,
  };

  private startTime: number = 0;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: AngularFirestore,
    private readonly stateService: StateService,
    private readonly router: Router,
    private readonly viewTimeService: ViewTimeService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startTime = Date.now();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.holdIDRestaurant = id;

      this.fetchMenu(id);
    });
    this.stateService.menu$.subscribe((menu) => (this.activeMenu = menu));
    this.stateService.restaurant$.subscribe(
      (restaurant) => (this.activeRestaurant = restaurant)
    );
    this.stateService.branding$.subscribe(
      (branding) => (this.brand = branding)
    );
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
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.dropdownOpen = false;
    this.onCategoryChange();
  }
  fetchSpecials(id: string) {
    this.firestore
      .collection<Special>('specials', (ref) => ref.where('menu', '==', id))
      .valueChanges()
      .subscribe((specials) => {
        this.specialsList = specials.map((special) => special.imageUrl);
      });
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const insideDropdown = target.closest('.custom-dropdown');
    if (!insideDropdown) {
      this.dropdownOpen = false;
    }
  }

  fetchMenu(id: string) {
    this.firestore
      .collection<Restaurant>('restuarants', (ref) =>
        ref.where('restaurantID', '==', id)
      )
      .valueChanges()
      .subscribe((restaurant) => {
        this.activeRestaurant = restaurant[0];
        this.stateService.setRestaurant(this.activeRestaurant);
        this.showTableDialogOnFirstVisit();

        this.firestore
          .collection<Menu>('menus', (ref) =>
            ref.where('menuID', '==', this.activeRestaurant.menuID)
          )
          .valueChanges()
          .subscribe((menus) => {
            this.activeMenu = menus[0];

            // Filter categories that have items
            this.categories = this.activeMenu.categories.filter((category) =>
              this.activeMenu.items.some(
                (item) => item.categoryId === category.id
              )
            );

            // Set first valid category
            if (this.categories.length > 0) {
              this.selectedCategory = this.categories[0];
              this.subcategories = this.selectedCategory.subcategories || [];
              this.selectedCategoryId = this.selectedCategory.id;
              this.activeSubcategoryId =
                this.subcategories.length > 0 ? this.subcategories[0].id : null;
            }

            this.items = this.activeMenu.items;
            this.selectRandomRecommendedItems();
            this.stateService.setMenu(this.activeMenu);
            console.log('Filtered Categories:', this.categories);
            this.fetchSpecials(this.activeMenu.menuID);
          });

        this.firestore
          .collection<Branding>('branding', (ref) =>
            ref.where('parentID', '==', this.activeRestaurant.ownerID)
          )
          .valueChanges()
          .subscribe((brand) => {
            this.brand = brand[0];
            this.stateService.setBranding(this.brand);
            this.setDynamicStyles();
            this.setSubDynamicStyles();
            console.log('Brand:', this.brand);
          });
      });
  }

  selectRandomRecommendedItems() {
    this.recommendedItems = this.items
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }
  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.selectedCategoryId = this.selectedCategory.id;
      this.subcategories = this.selectedCategory.subcategories || [];

      this.activeSubcategoryId =
        this.subcategories.length > 0 ? this.subcategories[0].id : null;
      this.getFilteredItems();
    } else {
      console.log('No valid category selected.');
    }
  }
  scrollLeft() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -250,
        behavior: 'smooth',
      });
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 250,
        behavior: 'smooth',
      });
    }
  }

  onSubcategoryChange(subcategory: Category) {
    this.activeSubcategoryId = subcategory.id;
    this.getFilteredItems();
  }
  getFilteredItems() {
    let id = null;
    if (this.activeSubcategoryId !== null) {
      id = this.activeSubcategoryId;
    } else {
      id = this.selectedCategoryId;
    }
    const filteredItems = this.items.filter((item) => item.categoryId === id);

    return filteredItems;
  }

  navigateToItem(itemId: string) {
    console.log(itemId);
    this.router.navigate([`/${this.holdIDRestaurant}/items`, itemId]);
  }

  setDynamicStyles() {
    console.log(this.brand.mainHeadingColor);
    this.dynamicStyles = {
      color: this.brand.mainHeadingColor,
      fontSize: this.getFontSize(this.brand.mainHeadingSize),
      fontFamily: this.brand.mainHeadingTypeface,
      textTransform: this.getTextTransform(this.brand.mainHeadingLettercase),
    };
  }

  setSubDynamicStyles() {
    this.dynamicStylesText = {
      color: this.brand.bodyColor,
      fontSize: this.getFontSize(this.brand.bodySize),
      fontFamily: this.brand.bodyTypeface,
      textTransform: this.getTextTransform(this.brand.bodyLettercase),
    };
  }

  getFontSize(size: string): string {
    switch (size) {
      case 'Small':
        return '12px';
      case 'Medium':
        return '16px';
      case 'Large':
        return '24px';
      default:
        return '16px';
    }
  }

  getTextTransform(caseType: string): string {
    switch (caseType) {
      case 'uppercase':
        return 'uppercase';
      case 'lowercase':
        return 'lowercase';
      case 'capitalize':
        return 'capitalize';
      default:
        return 'none';
    }
  }

  showTableDialogOnFirstVisit() {
    const orderSet = localStorage.getItem('orderID');

    /*  if (!orderSet) {
      const dialogRef = this.dialog.open(SelectTableDialogComponent, {
        data: {
          tables: this.activeRestaurant.tables,
          numberTables: this.activeRestaurant.numberTables
        },
        width: '95vw' 
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        const userId = JSON.parse(localStorage.getItem('user')!)?.uid;
        if (result.option === 'join') {
          this.joinCurrentOrder(result.table, userId);
        } else if (result.option === 'new') {
          this.createNewOrder(result.table, userId);
        }
      });
    } */
  }

  joinCurrentOrder(tableNumber: number, userId: string) {
    const tableIndex = tableNumber - 1;
    const tableData = this.activeRestaurant.tables[tableIndex];
    const [orderId, userArray] = this.parseOrderData(tableData);

    if (!userArray.includes(userId)) {
      userArray.push(userId);
      const updatedTableData = `${orderId}, [${userArray.join(', ')}]`;

      localStorage.setItem('orderID', orderId);
      this.updateTableData(tableIndex, updatedTableData);
      console.log(
        `User ${userId} joined order ${orderId} at table ${tableNumber}`
      );
    } else {
      localStorage.setItem('orderID', orderId);
      console.log(`User ${userId} is already part of the order.`);
    }
  }
  createNewOrder(tableNumber: number, userId: string) {
    const tableIndex = tableNumber - 1;

    if (!this.activeRestaurant.tables) {
      this.activeRestaurant.tables = new Array(
        this.activeRestaurant.numberTables
      ).fill('');
    }

    const newOrderId = `${uuidv4()}`;
    const userArray = [userId];
    const newOrderData = `${newOrderId}, [${userArray.join(', ')}]`;

    this.firestore.collection('orders').doc(newOrderId).set({
      orderId: newOrderId,
      tableIndex: tableIndex,
      restaurantID: this.activeRestaurant.restaurantID,
      status: 'pending',
      items: [],
    });
    localStorage.setItem('orderID', newOrderId);
    this.updateTableData(tableIndex, newOrderData);
    console.log(
      `Created new order ${newOrderId} with user ${userId} at table ${tableNumber}`
    );
  }

  updateTableData(tableIndex: number, updatedTableData: string) {
    console.log(tableIndex, updatedTableData);
    const updatedTables = [...this.activeRestaurant.tables];
    console.log(updatedTables);
    updatedTables[tableIndex] = updatedTableData;
    console.log(updatedTables);

    this.firestore
      .collection('restuarants')
      .doc(this.activeRestaurant.restaurantID)
      .update({
        tables: updatedTables,
      });
  }

  parseOrderData(tableData: string): [string, string[]] {
    const [orderId, users] = tableData.split(', ');
    const userArray = users
      .replace(/[\[\]']/g, '')
      .split(', ')
      .filter((user) => user.trim().length > 0);
    return [orderId, userArray];
  }
}
