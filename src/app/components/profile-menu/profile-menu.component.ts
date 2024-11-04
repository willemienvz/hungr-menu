import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss'
})
export class ProfileMenuComponent {
  profileForm!: FormGroup;


  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
    private firestore: AngularFirestore) {}
    userID:string='';
  ngOnInit(): void {
    this.profileForm = this.fb.group({
      personalizedRecommendations: false,
      promotionalEmails: false,
      emailReceipts: false,
    });

    this.userID = JSON.parse(localStorage.getItem('user')!)?.uid;

    this.loadUserSettings();

    // Listen for changes on each toggle and update Firebase
    this.profileForm.get('personalizedRecommendations')?.valueChanges.subscribe((value) => {
      this.updateSetting('tipsTutorials', value);
    });

    this.profileForm.get('promotionalEmails')?.valueChanges.subscribe((value) => {
      this.updateSetting('marketingConsent', value);
    });

    this.profileForm.get('emailReceipts')?.valueChanges.subscribe((value) => {
      this.updateSetting('emailSlippie', value);
    });
  }


  loadUserSettings() {
  //continue here
  }

  // Update Firebase with new toggle values
  updateSetting(field: string, value: boolean) {
    const userId = this.authService.getCurrentUserId();
    this.firestore.collection('users').doc(this.userID).update({
      [field]: value,
    }).then(() => {
      console.log(`Updated ${field} to ${value}`);
    }).catch((error) => {
      console.error("Error updating settings:", error);
    });
  }
  logout() {
    this.authService.SignOut().then(() => {
      this.router.navigate(['/sign-in']); 
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
