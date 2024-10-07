import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-img-slider',
  templateUrl: './img-slider.component.html',
  styleUrls: ['./img-slider.component.scss']
})
export class ImgSliderComponent implements OnInit {
  @Input() images: string[] = []; 
  currentIndex = 0;

  ngOnInit(): void {
    if (this.images.length === 0) {
      console.warn('No images available in the slider.');
    }
  }

  changeSlide(index: number): void {
    this.currentIndex = index;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
