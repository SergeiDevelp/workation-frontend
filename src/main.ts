import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { WorkationListComponent } from './app/workation-list.component';

bootstrapApplication(WorkationListComponent, appConfig)
  .catch((err) => console.error(err));
