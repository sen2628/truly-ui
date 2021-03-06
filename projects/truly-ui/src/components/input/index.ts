import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TlInput } from './input';
import { TlMessageValidationComponent } from './components/messagevalidation/messagevalidation.component';
import { CharcaseDirective } from './directives/charcase.directive';

import { ValidatorsModule } from '../validators/index';
import { OverlayModule } from '@angular/cdk/overlay';
import { InternalsModule } from '../internals/index';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    InternalsModule,
    OverlayModule
  ],
  declarations: [
    TlInput,
    CharcaseDirective,
    TlMessageValidationComponent,
  ],
  exports: [
    TlInput,
    CharcaseDirective,
    TlMessageValidationComponent
  ],
} )
export class InputModule {
}
