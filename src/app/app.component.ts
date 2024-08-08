import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule, RouterOutlet} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {MobileNavPanelComponent} from "./components/mobile-nav-panel/mobile-nav-panel.component";
import {PlayerComponent} from "./components/player/player.component";
import {LayoutComponent} from "./layout/layout.component";
declare var gapi: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MainComponent,
    MobileNavPanelComponent,
    RouterModule,
    PlayerComponent,
    LayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dynamics';
  private gapiSetup: boolean = false;
  private authInstance: any; // Change to any
  public user: any; // Change to any

  private CLIENT_ID = '579519724486-vs33uj6nmoa1ho14k06ti2emvlosqi4h.apps.googleusercontent.com';
  private API_KEY = 'YOUR_API_KEY';
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private SCOPES = 'https://www.googleapis.com/auth/drive.file';

  ngOnInit() {
    this.initializeGapiClient();
  }

  private initializeGapiClient() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES,
      }).then(() => {
        this.gapiSetup = true;
        this.authInstance = gapi.auth2.getAuthInstance();
        // this.authInstance.isSignedIn.listen(this.updateSigninStatus.bind(this));
        // this.updateSigninStatus(this.authInstance.isSignedIn.get());
      });
    });
  }
  //
  // private updateSigninStatus(isSignedIn: boolean) {
  //   if (isSignedIn) {
  //     this.user = this.authInstance.currentUser.get();
  //   } else {
  //     this.user = null;
  //   }
  // }
  //
  // public signIn() {
  //   if (this.gapiSetup) {
  //     this.authInstance.signIn().then(user => {
  //       this.user = user;
  //     });
  //   }
  // }
  //
  // public signOut() {
  //   if (this.gapiSetup) {
  //     this.authInstance.signOut().then(() => {
  //       this.user = null;
  //     });
  //   }
  // }
  //
  // public listFiles() {
  //   if (this.user) {
  //     gapi.client.drive.files.list({
  //       pageSize: 10,
  //       fields: 'nextPageToken, files(id, name)',
  //     }).then(response => {
  //       console.log(response.result.files);
  //     });
  //   }
  // }
}
