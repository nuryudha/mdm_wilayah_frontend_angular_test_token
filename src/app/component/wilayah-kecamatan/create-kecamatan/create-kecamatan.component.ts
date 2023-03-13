import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataKabupatenComponent } from '../data-kabupaten/data-kabupaten.component';
import { MatTableDataSource } from '@angular/material/table';
import { Negara } from 'src/app/model/negaraModel';
import { Provinsi } from 'src/app/model/provinsiModel';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../../services/wilayah.service';

@Component({
  selector: 'app-create-kecamatan',
  templateUrl: './create-kecamatan.component.html',
  styleUrls: ['./create-kecamatan.component.css'],
})
export class CreateKecamatanComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title
  ) {
    this.cekValidasi();
    this.nik = this.route.snapshot.paramMap.get('nik');
  }
  selectNameProvinsi: any;
  selectIdProvinsi: any;
  selectNameNegara: any;
  selectIdNegara: any;
  dataSourceNegara!: MatTableDataSource<Negara>;
  dataNegara: Negara[] = [];
  dataSourceProvinsi!: MatTableDataSource<Provinsi>;
  dataProvinsi: Provinsi[] = [];
  namaKabupaten: any;
  idKabupaten: any;
  namaKecamatan: any;
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

  getDataKabupaten() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.width = '60%';
    dialogConfig.height = '80%';
    this.dialog
      .open(DataKabupatenComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        this.namaKabupaten = res.cityName;
        this.idKabupaten = res.cityId;
        this.selectNameProvinsi = res.provinceName;
        this.selectIdProvinsi = res.provinceId;
        this.selectNameNegara = res.countryNameIdn;
        this.selectIdNegara = res.countryId;
      });
  }
  createKecamatan() {
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
      cityId: this.idKabupaten,
      cityName: this.namaKabupaten,
      countryId: this.selectIdNegara,
      districtName: this.namaKecamatan,
      provinceId: this.selectIdProvinsi,
      createdBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.postAll('district', parameter).subscribe(
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
              this.router.navigate(['/wilayah-kecamatan/' + this.nik]);
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
      idKecamatan: { value: '', disabled: true },
      namaKecamatan: ['', [Validators.required]],
      namaKabupaten: ['', [Validators.required]],
      selectIdProvinsi: { value: '', disabled: true },
      selectIdNegara: { value: '', disabled: true },
    });
  }

  ngOnInit(): void {
    this.getCountry();
    this.getProvinsi();
    this.title.setTitle('Buat Kecamatan');
    this.nik = this.route.snapshot.paramMap.get('nik');
    console.log(this.nik);
  }
}
