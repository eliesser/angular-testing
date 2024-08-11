import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';

@NgModule({
  declarations: [ProductComponent, ProductsComponent, ProductDetailComponent],
  imports: [CommonModule, ProductsRoutingModule, RouterModule],
})
export class ProductsModule {}
