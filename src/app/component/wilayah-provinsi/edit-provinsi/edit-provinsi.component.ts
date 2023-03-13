import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { Negara } from 'src/app/model/negaraModel';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../../services/wilayah.service';

@Component({
  selector: 'app-edit-provinsi',
  templateUrl: './edit-provinsi.component.html',
  styleUrls: ['./edit-provinsi.component.css'],
})
export class EditProvinsiComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
    this.cekValidasi();
    this.nik = this.route.snapshot.paramMap.get('nik');
  }

  dataNegara: Negara[] = [];
  dataSource!: MatTableDataSource<Negara>;
  namaProvinsi: any;
  selectIdNegara: any;
  formValidasi!: FormGroup;
  id: any;
  idProvinsi: any;
  statusText: any;
  error = false;
  nik: any;
  isLoading = false;
  data = false;

  getCountry() {
    this.isLoading = true;
    this.data = false;
    this.wilayahService.getAll('country/?page=0&size=1000').subscribe(
      (res) => {
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

  getIdProvinsi() {
    this.wilayahService.getId('province/' + this.id).subscribe((res) => {
      console.log(res);
      this.namaProvinsi = res.body.result.provinceName;
      this.selectIdNegara = res.body.result.countryId;
    });
  }

  saveEditProvinsi() {
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
      countryId: this.selectIdNegara,
      provinceName: this.namaProvinsi,
      provinceId: this.idProvinsi,
      updatedBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.putId('province/', parameter).subscribe(
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
              this.router.navigate(['/wilayah-provinsi/' + this.nik]);
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
      idProvinsi: { value: '', disabled: true },
      namaProvinsi: ['', [Validators.required]],
      selectIdNegara: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.idProvinsi = this.id;
    this.nik = this.route.snapshot.paramMap.get('nik');
    console.log(this.nik);
    this.getCountry();
    this.getIdProvinsi();
    this.title.setTitle('Edit Provinsi');
  }
}
