import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataKecamatanComponent } from '../data-kecamatan/data-kecamatan.component';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { HttpHeaders } from '@angular/common/http';
import { Kabupaten } from 'src/app/model/kabupatenModel';
import { MatTableDataSource } from '@angular/material/table';
import { Negara } from 'src/app/model/negaraModel';
import { Provinsi } from 'src/app/model/provinsiModel';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../../services/wilayah.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-kelurahan',
  templateUrl: './edit-kelurahan.component.html',
  styleUrls: ['./edit-kelurahan.component.css'],
})
export class EditKelurahanComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder,
    private handleError: ErrorRequestService
  ) {
    this.cekValidasi();
    this.token = this.authUser.token;
    this.nik = this.authUser.profileHeader.nik;
  }

  authUser: any = JSON.parse(localStorage.getItem('auth-user') || '{}');

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.idKelurahan = this.id;
    console.log(this.nik);
    this.getCountry();
    this.getProvinsi();
    this.getKabupaten();
    this.getIdKelurahan();
    this.title.setTitle('Edit Kelurahan');
  }

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

  formValidasi!: FormGroup;
  id: any;
  namaKelurahan: any;
  idKelurahan: any;
  kodePos: any;
  namaKecamatan: any;
  idKecamatan: any;
  selectIdKabupaten: any;
  selectNamaKabupaten: any;
  dataKabupaten: Kabupaten[] = [];
  dataSourceKabupaten!: MatTableDataSource<Kabupaten>;
  selectIdProvinsi: any;
  selectNamaProvinsi: any;
  dataProvinsi: Provinsi[] = [];
  dataSourceProvinsi!: MatTableDataSource<Provinsi>;
  selectIdNegara: any;
  selectNamaNegara: any;
  dataNegara: Negara[] = [];
  dataSourceNegara!: MatTableDataSource<Negara>;
  statusText: any;
  error = false;
  nik: any;
  isLoading = false;
  data = false;
  token: any;

  getCountry() {
    this.httpOptions.headers = this.httpHeaders.set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.isLoading = true;
    this.data = false;
    this.wilayahService
      .getAllc(
        'country/?page=0&size=1000',
        this.httpOptions,
        catchError(this.handleError.handleErrorDetailUser.bind(this))
      )
      .subscribe(
        (res) => {
          this.dataNegara = res.body.result;
          this.dataSourceNegara = new MatTableDataSource(this.dataNegara);
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

  getProvinsi() {
    this.httpOptions.headers = this.httpHeaders.set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.wilayahService
      .getAllc(
        'province/?page=0&size=1000',
        this.httpOptions,
        catchError(this.handleError.handleErrorDetailUser.bind(this))
      )
      .subscribe((res) => {
        this.dataProvinsi = res.body.result;
        this.dataSourceProvinsi = new MatTableDataSource(this.dataProvinsi);
      });
  }

  getKabupaten() {
    this.httpOptions.headers = this.httpHeaders.set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.wilayahService
      .getAllc(
        'city/?page=0&size=1000',
        this.httpOptions,
        catchError(this.handleError.handleErrorDetailUser.bind(this))
      )
      .subscribe((res) => {
        this.dataKabupaten = res.body.result;
        this.dataSourceKabupaten = new MatTableDataSource(this.dataKabupaten);
      });
  }

  getDataKecamatan() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.width = '60%';
    dialogConfig.height = '80%';
    this.dialog
      .open(DataKecamatanComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.namaKecamatan = res.districtName;
        this.idKecamatan = res.districtId;
        this.selectIdKabupaten = res.cityId;
        this.selectIdProvinsi = res.provinceId;
        this.selectIdNegara = res.countryId;
      });
  }

  getIdKelurahan() {
    this.httpOptions.headers = this.httpHeaders.set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.wilayahService
      .getIdc(
        'village/' + this.id,
        this.httpOptions,
        catchError(this.handleError.handleErrorDetailUser.bind(this))
      )
      .subscribe((res) => {
        console.log(res);
        this.namaKelurahan = res.body.result.villageName;
        this.kodePos = res.body.result.villagePostalCode;
        this.namaKecamatan = res.body.result.districtName;
        this.idKecamatan = res.body.result.districtId;
        this.selectIdKabupaten = res.body.result.cityId;
        this.selectNamaKabupaten = res.body.result.cityName;
        this.selectIdProvinsi = res.body.result.provinceId;
        this.selectNamaProvinsi = res.body.result.provinceName;
        this.selectIdNegara = res.body.result.countryId;
        this.selectNamaNegara = res.body.result.countryNameIdn;
      });
  }
  saveEditKelurahan() {
    this.httpOptions.headers = this.httpHeaders.set(
      'Authorization',
      `Bearer ${this.token}`
    );
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
      cityId: this.selectIdKabupaten,
      cityName: this.selectNamaKabupaten,
      countryId: this.selectIdNegara,
      countryNameIdn: this.selectNamaNegara,
      districtId: this.idKecamatan,
      districtName: this.namaKecamatan,
      provinceId: this.selectIdProvinsi,
      provinceName: this.selectNamaProvinsi,
      villageId: this.idKelurahan,
      villageName: this.namaKelurahan,
      villagePostalCode: this.kodePos,
      updatedBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService
      .putIdc(
        'village',
        parameter,
        this.httpOptions,
        catchError(this.handleError.handleErrorDetailUser.bind(this))
      )
      .subscribe(
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
                this.router.navigate(['/wilayah-kelurahan']);
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
      idKelurahan: { value: '', disabled: true },
      namaKelurahan: ['', [Validators.required]],
      kodePos: ['', [Validators.required]],
      namaKecamatan: ['', [Validators.required]],
      selectIdKabupaten: { value: '', disabled: true },
      selectIdProvinsi: { value: '', disabled: true },
      selectIdNegara: { value: '', disabled: true },
    });
  }
}
