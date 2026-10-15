import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNav } from './top-nav/top-nav';

@Component({
  selector: 'app-dashboard',
  imports: [TopNav, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
