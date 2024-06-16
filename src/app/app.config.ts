import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"dynamics-9080b","appId":"1:579519724486:web:1981b88ba10cda3a9ad0c7","storageBucket":"dynamics-9080b.appspot.com","apiKey":"AIzaSyDiwaQTKJ2umKpfFqHpLh58KCNQGF9qcdo","authDomain":"dynamics-9080b.firebaseapp.com","messagingSenderId":"579519724486","measurementId":"G-JFBR1H09B6"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"dynamics-9080b","appId":"1:579519724486:web:1981b88ba10cda3a9ad0c7","storageBucket":"dynamics-9080b.appspot.com","apiKey":"AIzaSyDiwaQTKJ2umKpfFqHpLh58KCNQGF9qcdo","authDomain":"dynamics-9080b.firebaseapp.com","messagingSenderId":"579519724486","measurementId":"G-JFBR1H09B6"})), provideFirestore(() => getFirestore()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })]
};
