import { Routes } from '@angular/router';

import { ProductsComponent } from './components/products/products.component';
import { PipoPreviewComponent } from './components/pipo-preview/pipo-preview.component';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'pico-preview',
    component: PipoPreviewComponent,
  },
];
