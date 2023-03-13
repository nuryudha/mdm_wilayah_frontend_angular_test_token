import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { WilayahService } from 'src/app/services/wilayah.service';

@Component({
  selector: 'app-auth-check',
  templateUrl: './auth-check.component.html',
  styleUrls: ['./auth-check.component.css'],
})
export class AuthCheckComponent implements OnInit {
  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private services: WilayahService
  ) {}

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response',
    responseType: 'json',
  };

  tokenParameter: string = '';
  urlParameter: any;

  ngOnInit(): void {
    this.title.setTitle('Auth Check');
  }
}
