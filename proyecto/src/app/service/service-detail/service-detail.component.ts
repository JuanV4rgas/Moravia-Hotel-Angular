import { Component, Input } from '@angular/core';
import { Service } from '../service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent {
  @Input()
  service!:Service;
}
