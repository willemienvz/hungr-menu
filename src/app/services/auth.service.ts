import { Injectable, NgZone } from '@angular/core';
import { User } from './user';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { DataService } from './data.service';
import { ToastService } from './toast.service';
import { BehaviorSubject, first, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; 
  private redirectUrl: string | null = null;
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  id:any;
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public dataService: DataService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.afAuth.authState.pipe(first()).subscribe((user) => {
      this.isLoggedInSubject.next(!!user?.emailVerified);
    });
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }
  SignIn(email: string, password: string, id: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.isLoggedInSubject.next(true);
            localStorage.setItem('isLoggedIn', 'true'); 

            const targetRoute = this.redirectUrl ? this.redirectUrl : `/${id}`;
            this.router.navigate([targetRoute]);
            this.redirectUrl = null;
          }
        });
      })
      .catch((error) => {
        this.toastService.showToast(error.message, 'error');
      });
  }

  // Sign up with email/password
  signUp(email: string, password: string, name: string, surname: string): Observable<void> {
    return new Observable<void>((observer) => {
        this.afAuth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const userId = userCredential.user?.uid;
                if (userId) {
                    this.afs.collection('users').doc(userId).set({
                        email,
                        name,
                        surname
                    }).then(() => {
                        observer.next();
                        observer.complete();
                        this.router.navigate(['/home']);
                    });
                }
            })
            .catch((error) => observer.error(error));
    });
}

  SignUpEditor(email: string, data: any): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user')!);
    const parentId = user.uid;
    const password = 'th1s1s@t3mpP@ssw0rdPl3@s3Ch@ng3m3!123';
  
    return new Promise<void>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this.SendVerificationMailEditor();
          resolve(); 
        })
        .catch((error) => {
          reject(error); 
        });
    });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

   // Send email verfificaiton when new editor sign up
   SendVerificationMailEditor() {
    const currentUser = this.afAuth.currentUser;
    if (currentUser) {
      return currentUser.then((user: any) => {
        return user.sendEmailVerification().then(() => {
        }).catch((error: any) => {
          console.log('Error sending verification email: ' + error.message);
        });
      }).catch((error: any) => {
        console.log('Error getting current user: ' + error.message);
      });
    } else {
      console.log('No user is currently signed in.');
      return Promise.resolve();
    }
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, formDataStep1:any, formDataStep2:any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      firstName: formDataStep1.firstName,
      Surname: formDataStep1.lastName,
      email: formDataStep1.userEmail,
      cellphoneNumber: formDataStep1.cellphone,
      emailVerified: user.emailVerified,
      marketingConsent:formDataStep2.receiveMarketingInfo,
      tipsTutorials:formDataStep2.receiveMarketingInfo,
      userInsights:formDataStep2.receiveMarketingInfo,
      aboutUsDisplayed:false,
      cardHolderName: formDataStep1.cardname,
      cardNumber:formDataStep1.cardnumber,
      cvv: formDataStep1.cvv,
      expiryDate: formDataStep1.expirydate,
      accountType:'admin',
      subscriptionType: formDataStep2.billingOption,
      parentId:'',

    };
    return userRef.set(userData, {
      merge: true,
    });
  }
 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.isLoggedInSubject.next(false);
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['sign-in']);
    });
  }

  getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null);
        }
      });
    });
  }

  sendEmailInvitation(email: string, docId: string) {
    const actionCodeSettings = {
      url: 'https://main.d9ek0iheftizq.amplifyapp.com/confirm-user?docId=' + docId,
      handleCodeInApp: true // This must be true
    };

    return this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        console.log('success sent');        
      })
      .catch(error => {
        console.error('Error sending email invitation: ', error);
      });
  }
 
}