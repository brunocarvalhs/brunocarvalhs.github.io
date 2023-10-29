import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  language = ['pt-br', 'es', 'en'];

  constructor() {}
}
