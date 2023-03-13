import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataKecamatanComponent } from '../data-kecamatan/data-kecamatan.component';
import { Kabupaten } from 'src/app/model/kabupatenModel';
import { MatTableDataSource } from '@angular/material/table';
import { Negara } from 'src/app/model/negaraModel';
import { Provinsi } from 'src/app/model/provinsiModel';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../../services/wilayah.service';

@Component({
  selector: 'app-create-kelurahan',
  templateUrl: './create-kelurahan.component.html',
  styleUrls: ['./create-kelurahan.component.css'],
})
export class CreateKelurahanComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private title: Title
  ) {
    this.cekValidasi();
    this.nik = this.route.snapshot.paramMap.get('nik');
  }

  namaKelurahan: any;
  kodePos: any;
  idKecamatan: any;
  namaKecamatan: any;
  selectIdKabupaten: any;
  selectIdProvinsi: any;
  selectIdNegara: any;
  dataNegara: Negara[] = [];
  dataSourceNegara!: MatTableDataSource<Negara>;
  dataProvinsi: Provinsi[] = [];
  dataSourceProvinsi!: MatTableDataSource<Provinsi>;
  dataKabupaten: Kabupaten[] = [];
  dataSourceKabupaten!: MatTableDataSource<Kabupaten>;
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
    this.wilayahService
      .getAll('province/?page=0&size=1000')
      .subscribe((res) => {
        this.dataProvinsi = res.body.result;
        this.dataSourceProvinsi = new MatTableDataSource(this.dataProvinsi);
      });
  }

  getKabupaten() {
    this.wilayahService.getAll('city/?page=0&size=1000').subscribe((res) => {
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
        console.log(res);
        this.namaKecamatan = res.districtName;
        this.idKecamatan = res.districtId;
        this.selectIdKabupaten = res.cityId;
        this.selectIdProvinsi = res.provinceId;
        this.selectIdNegara = res.countryId;
      });
  }

  createKelurahan() {
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
      countryId: this.selectIdNegara,
      districtId: this.idKecamatan,
      districtName: this.namaKecamatan,
      provinceId: this.selectIdProvinsi,
      villageName: this.namaKelurahan,
      villagePostalCode: this.kodePos,
      createdBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.postAll('village', parameter).subscribe(
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
              this.router.navigate(['/wilayah-kelurahan/' + this.nik]);
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

  ngOnInit(): void {
    this.getCountry();
    this.getProvinsi();
    this.getKabupaten();
    this.title.setTitle('Buat Kelurahan');
    this.nik = this.route.snapshot.paramMap.get('nik');
    console.log(this.nik);
  }
}
