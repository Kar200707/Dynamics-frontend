import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

@Directive({
  selector: '[appResizeHeight]',
  standalone: true
})
export class ResizeHeightDirective implements OnInit{
  @Input() size!: number;

  @HostListener('window:resize')
  private onResize() {
    if (this.size) {
      this.element.nativeElement.style.height = innerHeight - this.size + 'px';
    }
  }

  constructor(private element: ElementRef<HTMLElement>) {  }

  ngOnInit() {
    if (this.size) {
      this.element.nativeElement.style.height = innerHeight - this.size + 'px';
    }
  }

}
