import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent implements OnInit {
  image = './assets/images/unauthorized-image.gif';
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Unauthorized');
  }
}
