/*
 MIT License

 Copyright (c) 2017 Temainfo Sistemas

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { Component, DoCheck, Input, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../modal.service';
import { ToneColorGenerator } from '../../core/helper/tonecolor-generator';

 @Component({
     selector: 'tl-container-modal',
     templateUrl: './container-modal.html',
     styleUrls: ['./container-modal.scss']
 })
 export class TlContainerModal implements OnInit, DoCheck {

     @Input() containerColor = '#F2F2F2';

     @Input() height = '40px';

     @Input() boxColor = '#66cc99';

     @Input() modalBoxWidth = 150;

     @Input() limitStringBox = 12;

     @ViewChild('container') container;

     @ViewChild( 'wrapper' ) wrapper;

     @ViewChild( 'arrowRight' ) arrowRight;

     private boxColorInactive = '#6da78d';

     private borderBoxColor = '#54a378';

     private isScrolling = false;

     private differ;

     constructor( private modalService: ModalService, private colorService: ToneColorGenerator, differs: KeyValueDiffers ) {
         this.differ = differs.find( {} ).create( null );
     }

     ngOnInit() {
       this.boxColorInactive = this.colorService.calculate(this.boxColor, -0.12);
       this.borderBoxColor = this.colorService.calculate(this.boxColor, -0.2);
     }

     showWindow(item, i) {
         this.modalService.activeModal = item;
         this.modalService.showModal( item, i );
     }

     validateScroll() {
         setTimeout( () => {
             this.wrapper.nativeElement.offsetWidth >= this.container.nativeElement.offsetWidth ?
                 this.isScrolling = true : this.isScrolling = false;
         }, 1 );
     }

     showMoreBoxes() {
         this.handleArrowRight();
         this.handleScrollFinish();
     }

     handleArrowRight() {
         if (  this.container.nativeElement.scrollLeft < this.wrapper.nativeElement.offsetWidth ) {
             this.container.nativeElement.scrollLeft += 150;
         }
     }

     handleScrollFinish() {
         const scrollLeft = this.container.nativeElement.scrollLeft + this.container.nativeElement.offsetWidth;
         if (scrollLeft >= this.wrapper.nativeElement.offsetWidth) {
             this.isScrolling = false;
         }
     }

     ngDoCheck() {
         const changes = this.differ.diff( this.modalService.forms );
         if ( changes ) {
             this.validateScroll();
         }
     }

}