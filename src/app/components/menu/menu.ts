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
import {
  Input, Component, OnDestroy,
  Renderer2, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterContentInit, ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SubMenuService } from './services/submenu.service';

@Component( {
  selector: 'tl-menu',
  templateUrl: './menu.html',
  styleUrls: [ './menu.scss' ],
  providers: [ SubMenuService ],
} )
export class TlMenu implements AfterContentInit, OnChanges, OnDestroy {

  @Input() items = [];

  @Input() label = '';

  @Input() icon = '';

  @Input() subItem = '';

  @Input() dockWidth = '30px';

  @Input() width = '200px';

  @Input() docked = false;

  @Input() group = '';

  @Input() titleMenu = 'Menu Principal';

  @Input() mode: 'simple' | 'advanced' = 'simple';

  @Input() link = 'sidebar';

  @ViewChild( 'menuList', { read: ViewContainerRef } ) menuList: ViewContainerRef;

  private listElement;

  private iconElement;

  private labelElement;

  private iconSubElement;

  private indexSubMenu = 0;

  private callBack = Function();

  constructor( private renderer: Renderer2, private router: Router, private subMenuService: SubMenuService ) {}

  ngAfterContentInit() {
    this.subMenuService.setRenderer( this.renderer );
    this.subMenuService.setRootMenu( this.menuList );
    this.subMenuService.setViewContainerRef( this.menuList );
    this.createList();
    this.listenDocumentClick();
  }

  createList() {
    const list = this.items;
    for ( let item = 0; item < list.length; item++ ) {
      this.createElementList( list[ item ] );
      this.addRootClass();
      this.handleDockedClass();
      this.handleAlwaysActive( list[ item ][ 'alwaysActive' ] );
      this.insertListElementToList();
      this.createElementIcon( list[ item ][ this.icon ] );
      this.createElementLabel( list[ item ][ this.label ] );
      this.orderElements();
      this.createElementIconSubMenu( list[ item ][ this.subItem ] );
      this.handleListenerSubMenu( list[ item ][ this.subItem ] );
      this.handleSubItems( list[ item ] );
    }
  }

  addRootClass() {
    this.renderer.addClass( this.listElement.nativeElement, 'root-list' );
  }

  handleDockedClass() {
    if ( this.docked ) {
      this.renderer.addClass( this.listElement.nativeElement, 'docked' );
      this.renderer.setStyle( this.listElement.nativeElement, 'grid-template-columns', this.dockWidth );
    }
  }

  handleAlwaysActive( value ) {
    if ( value ) {
      this.renderer.addClass( this.listElement.nativeElement, 'always-active' );
    }
  }

  handleSubItems( item ) {
    if ( item[ this.subItem ] ) {
      if ( this.mode === 'simple' ) {
        this.subMenuService.setAnchorRootElement( this.listElement.nativeElement );
        this.subMenuService.setSubMenuData( item[ this.subItem ], this );
        this.subMenuService.createSimpleSubMenu();
        this.subMenuService.handleDockedMenu();
      } else {
        this.subMenuService.setAnchorRootElement( this.menuList.element.nativeElement.children[ 0 ] );
        this.subMenuService.setSubMenuData( item[ this.subItem ], this );
        this.subMenuService.createAdvancedMenu();
        this.subMenuService.handleDockedMenu();
      }
    }
  }

  handleListenerSubMenu( item ) {
    if ( item ) {
      this.listenClickListElement();
    }
  }

  createElementList( item ) {
    this.listElement = new ElementRef( this.renderer.createElement( 'li' ) );
    this.renderer.addClass( this.listElement.nativeElement, 'ui-menulist-item' );
    this.listenClickElementList( item );
    this.setStyleListElement();
  }

  listenDocumentClick() {
    this.renderer.listen(document, 'click', ($event) => {
      this.subMenuService.closeMenu();
    });
  }

  listenClickElementList( item ) {
    this.renderer.listen( this.listElement.nativeElement, 'click', (MouseEvent) => {
      if ( item[ this.link ] ) {
        this.router.navigate( [ item[ this.link ] ] );
        return;
      }
      if (item['callback']) {
        this.callBack = item['callback'];
        this.callBack(MouseEvent);
      }
    } );
  }

  setStyleListElement() {
    this.renderer.setStyle( this.listElement.nativeElement, 'max-width', this.width );
    this.renderer.setStyle( this.listElement.nativeElement, 'height', this.dockWidth );
    this.renderer.setStyle( this.listElement.nativeElement, 'line-height', this.dockWidth );
    this.renderer.setStyle( this.listElement.nativeElement, 'grid-template-columns',
      this.dockWidth + ' 1fr ' + this.dockWidth );
  }

  createElementIcon( icon ) {
    this.iconElement = new ElementRef( this.renderer.createElement( 'i' ) );
    this.renderer.addClass( this.iconElement.nativeElement, icon );
    this.renderer.addClass( this.iconElement.nativeElement, 'icon' );
    this.renderer.setStyle( this.iconElement.nativeElement, 'height', this.dockWidth );
    this.renderer.setStyle( this.iconElement.nativeElement, 'line-height', this.dockWidth );
  }

  createElementIconSubMenu( subItem ) {
    if ( !this.isDocked() ) {
      this.iconSubElement = new ElementRef( this.renderer.createElement( 'i' ) );
      this.renderer.addClass( this.iconSubElement.nativeElement, 'icon' );
      this.renderer.appendChild( this.listElement.nativeElement, this.iconSubElement.nativeElement );
      if ( subItem ) {
        this.renderer.addClass( this.iconSubElement.nativeElement, 'ion-ios-arrow-right' );
      }
    }
  }

  listenClickListElement() {
    if (this.mode === 'advanced') {
      this.renderer.listen( this.listElement.nativeElement, 'click', ( $event ) => {
        if ( this.isTargetOnListElement( $event ) ) {
          this.subMenuService.getListComponents()[ 0 ].instance.toggleVisibility();
          this.handleVisibilitySubMenu();
        }
      } );
    }
  }

  handleVisibilitySubMenu() {
    this.subMenuService.getListComponents().forEach( ( value, index ) => {
      if ( (index > 0) && (value.instance.visibilitySubMenu) ) {
        value.instance.toggleVisibility();
      }
    } );
  }

  isTargetOnListElement( $event ) {
    for ( const item of $event.currentTarget.children ) {
      if ( item === $event.target ) {
        return true;
      }
    }
    return false;
  }

  createElementLabel( label ) {
    if ( !this.isDocked() ) {
      this.labelElement = new ElementRef( this.renderer.createElement( 'span' ) );
      this.renderer.addClass( this.labelElement.nativeElement, 'label' );
      this.renderer.setStyle( this.labelElement.nativeElement, 'height', this.dockWidth );
      this.renderer.setStyle( this.labelElement.nativeElement, 'line-height', this.dockWidth );
      this.labelElement.nativeElement.innerHTML = label;
      return;
    }
    this.labelElement = null;
  }

  isDocked() {
    return this.listElement.nativeElement.getAttribute( 'class' ).includes( 'docked' );
  }

  orderElements() {
    this.renderer.appendChild( this.listElement.nativeElement, this.iconElement.nativeElement );
    if ( this.labelElement ) {
      this.renderer.appendChild( this.listElement.nativeElement, this.labelElement.nativeElement );
    }
  }

  insertListElementToList() {
    this.renderer.appendChild( this.menuList.element.nativeElement, this.listElement.nativeElement );
  }

  resetList() {
    this.subMenuService.clearView();
    this.menuList.element.nativeElement.innerHTML = '';
    this.indexSubMenu = 0;
  }

  ngOnChanges( changes: SimpleChanges ) {
    if ( changes[ 'docked' ] ) {
      if ( !changes[ 'docked' ].firstChange ) {
        this.resetList();
        this.createList();
      }
    }
  }

  ngOnDestroy() {
  }

}
