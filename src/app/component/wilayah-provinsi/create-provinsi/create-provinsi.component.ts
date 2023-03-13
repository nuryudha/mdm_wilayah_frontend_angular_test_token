import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { Negara } from 'src/app/model/negaraModel';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../wilayah.service';

@Component({
  selector: 'app-create-provinsi',
  templateUrl: './create-provinsi.component.html',
  styleUrls: ['./create-provinsi.component.css'],
})
export class CreateProvinsiComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private title: Title
  ) {
    this.dataSource = new MatTableDataSource(this.dataNegara);
    this.nik = this.route.snapshot.paramMap.get('nik');
    this.cekValidasi();
  }

  dataNegara: Negara[] = [];
  dataSource!: MatTableDataSource<Negara>;
  namaProvinsi: any;
  selectIdNegara: any;
  formValidasi!: FormGroup;
  statusText: any;
  error = false;
  nik: any;
  isLoading = false;
  data = false;
  noData = false;

  getCountry() {
    this.isLoading = true;
    this.data = false;
    this.wilayahService.getAll('country/?page=0&size=1000').subscribe(
      (res) => {
        console.log(res);
        this.dataNegara = res.body.result;
        this.dataSource = new MatTableDataSource(this.dataNegara);
        this.data = true;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.statusText = error.statusText;
        this.error = true;
        Swal.fire({
          icon: 'error',
          title: 'Service Unavailable',
        });
      }
    );
  }

  createProvinsi() {
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
      provinceName: this.namaProvinsi,
      createdBy: this.nik,
      countryId: this.selectIdNegara,
    };
    console.log(parameter);

    this.wilayahService.postAll('province', parameter).subscribe(
      (res) => {
        let statusCode = res.body.status.responseCode;
        let statusDesc = res.body.status.responseDesc;
        if (statusCode == '200') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: statusDesc,
            showConfirmButton: false,
            timer: 1500,
          }).then((res) => {
            if (res) {
              this.router.navigate(['/wilayah-provinsi/' + this.nik]);
            }
          });
        } else if (statusCode == '400') {
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
        console.log(error.status);
        console.log(error.error.result[0].objectName);
        console.log(error.error.result[0].message);
        let errorText = error.error.status.responseDesc;
        console.log(errorText);
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
      idProvinsi: { value: '', disabled: true },
      namaProvinsi: ['', [Validators.required]],
      selectIdNegara: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCountry();
    this.title.setTitle('Buat Provinsi');
    this.nik = this.route.snapshot.paramMap.get('nik');
    console.log(this.nik);
  }
}
