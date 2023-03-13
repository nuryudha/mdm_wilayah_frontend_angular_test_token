import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../wilayah.service';

@Component({
  selector: 'app-create-negara',
  templateUrl: './create-negara.component.html',
  styleUrls: ['./create-negara.component.css'],
})
export class CreateNegaraComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private title: Title
  ) {
    this.cekValidasi();
    this.nik = this.route.snapshot.paramMap.get('nik');
  }
  formValidasi!: FormGroup;
  idNegara: any;
  namaNegara: any;
  nik: any;
  cekValidasi() {
    this.formValidasi = this.formBuilder.group({
      idNegara: ['', [Validators.required]],
      namaNegara: ['', [Validators.required]],
    });
  }

  getCountry() {
    this.wilayahService.getAll('country/?page=0&size=1000').subscribe(
      (res) => {},
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Service Unavailable',
        });
      }
    );
  }
  createNegara() {
    if (this.formValidasi.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Isian tidak lengkap',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  
    let parameter = {
      countryId: this.idNegara,
      countryNameIdn: this.namaNegara,
      createdBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.postAll('country', parameter).subscribe(
      (res) => {
        let statusCode = res.body.status.responseCode;
        let statusDesc = res.body.status.responseDesc;
        console.log(res);
        if (statusCode == '200') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: statusDesc,
            showConfirmButton: false,
            timer: 1500,
          }).then((res) => {
            if (res) {
              this.router.navigate(['/wilayah-negara/' + this.nik]);
            }
          });
        } else if (statusCode == '400') {
          console.log('>>>>>>>>>');
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: statusDesc,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Service Not Found',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      (error) => {
        let errorText = error.error.status.responseDesc;
        console.log(error);
        if (error.status == '400') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: errorText,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,

            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'error',
            title: 'Service Unavailable',
          });
        }
      }
    );
  }

  ngOnInit(): void {
    this.title.setTitle('Buat Negara');
    this.getCountry();
    this.nik = this.route.snapshot.paramMap.get('nik');
  }
}
