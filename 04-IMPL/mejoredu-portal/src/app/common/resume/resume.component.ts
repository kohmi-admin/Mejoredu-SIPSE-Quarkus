import { Component, Input } from '@angular/core';
import { ResumeI } from './interfaces/resume.interface';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent {
  @Input() items: ResumeI[] = [];
}
