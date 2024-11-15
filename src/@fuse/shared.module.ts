import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { MaterialModule } from './material.module';
import { FuseMaterialColorPickerModule } from './components';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';


@NgModule({
    providers: [
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, maxWidth: '100vh'}}
    ],
    imports  :  [
        FusePipesModule,
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FusePipesModule,
        ReactiveFormsModule,
        FuseMaterialColorPickerModule,
        FuseDirectivesModule,
        NgxSpinnerModule
    ],
    
    exports  : [
        FusePipesModule,
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FusePipesModule,
        ReactiveFormsModule,
        FuseMaterialColorPickerModule,
        FuseDirectivesModule,
        NgxSpinnerModule
    ]
})
export class FuseSharedModule
{}
