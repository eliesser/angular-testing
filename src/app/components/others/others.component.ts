import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighligthDirective } from '../../directives/highligth/highligth.directive';
import { ReversePipe } from '../../pipes/reverse/reverse.pipe';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products/products.service';

@Component({
  selector: 'app-others',
  standalone: true,
  imports: [FormsModule, HighligthDirective, ReversePipe],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
})
export class OthersComponent {
  color = 'yellow';
  text = 'Un texto';
  products: Product[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.productService.getAll().subscribe((data) => {
      this.products = data;
    });
  }
}
