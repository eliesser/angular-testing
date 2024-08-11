import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
