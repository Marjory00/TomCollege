import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container-fluid">
        <h1 class="mt-4 mb-4 text-primary">{{ title }}</h1>
        <hr>
        <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'TomCollege Application';

  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }
}
