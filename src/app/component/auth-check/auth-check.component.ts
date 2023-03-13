import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-auth-check',
  templateUrl: './auth-check.component.html',
  styleUrls: ['./auth-check.component.css'],
})
export class AuthCheckComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Auth Check');
  }
}
