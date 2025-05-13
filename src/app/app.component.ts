import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, ReportsComponent, SettingsComponent],
  template: `
    <h1>Angular 19 Standalone Project</h1>
    <app-dashboard></app-dashboard>
    <app-reports></app-reports>
    <app-settings></app-settings>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
