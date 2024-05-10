import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-form-loader-skeleton',
  standalone: true,
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './form-loader-skeleton.component.html',
  styleUrl: './form-loader-skeleton.component.scss',
})
export class FormLoaderSkeletonComponent { }
