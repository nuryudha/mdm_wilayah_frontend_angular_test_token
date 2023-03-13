import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../wilayah.service';

@Component({
  selector: 'app-edit-negara',
  templateUrl: './edit-negara.component.html',
  styleUrls: ['./edit-negara.component.css'],
})
export class EditNegaraComponent implements OnInit {
  formValidasi!: FormGroup;
  id: any;
  idNegara: any;
  namaNegara: any;
  nik: any;
  isLoading = true;
  data = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wilayahService: WilayahService,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
    this.cekValidasi();
    this.nik = this.route.snapshot.paramMap.get('nik');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.nik = this.route.snapshot.paramMap.get('nik');
    this.getId();
    this.title.setTitle('Edit Negara');
  }

  getId() {
    this.isLoading = true;
    this.data = false;
    this.wilayahService.getId('country/' + this.id).subscribe(
      (res) => {
        console.log(res);
        this.idNegara = res.body.result.countryId;
        this.namaNegara = res.body.result.countryNameIdn;
        this.data = true;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Service Unavailable',
        });
      }
    );
  }

  saveEdit() {
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
      updatedBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.putId('country/', parameter).subscribe(
      (res) => {
        console.log(res);
        let statusCode = res.body.status.responseCode;
        if (statusCode == '200') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Berhasil',
            showConfirmButton: false,
            timer: 1500,
          }).then((res) => {
            if (res) {
              this.router.navigate(['/wilayah-negara/' + this.nik]);
            }
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Gagal',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      (error) => {
        console.log(error.status);
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

  cekValidasi() {
    this.formValidasi = this.formBuilder.group({
      idNegara: ['', [Validators.required]],
      namaNegara: ['', [Validators.required]],
    });
  }
}
