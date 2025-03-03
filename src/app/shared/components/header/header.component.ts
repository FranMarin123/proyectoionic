import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
})
export class HeaderComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input() backButtonURL: string | null = null;

  constructor() {}

  ngOnInit() {}
}