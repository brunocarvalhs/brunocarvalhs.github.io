import { Component } from '@angular/core';
import { LinkedinService } from '../../services/linkedin/linkedin.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  constructor(private linkedinService: LinkedinService) {}
}
