import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TRANSLATIONS } from '@angular/core';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const translations = '....';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    {provide: TRANSLATIONS, useValue: translations }
  ]
};
