import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { MaterialModule } from './material.module';
import { FuseMaterialColorPickerModule } from './components';


@NgModule({
    imports  :  [
        FusePipesModule,
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FusePipesModule,
        ReactiveFormsModule,
        FuseMaterialColorPickerModule,
        FuseDirectivesModule
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
        FuseDirectivesModule
    ]
})
export class FuseSharedModule
{}
