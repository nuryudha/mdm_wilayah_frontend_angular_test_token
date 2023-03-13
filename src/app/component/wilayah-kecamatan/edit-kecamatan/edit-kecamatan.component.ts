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
  selector: 'app-edit-kecamatan',
  templateUrl: './edit-kecamatan.component.html',
  styleUrls: ['./edit-kecamatan.component.css'],
})
export class EditKecamatanComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private wilayahService: WilayahService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
    this.cekValidasi();
    this.nik = this.activatedRoute.snapshot.paramMap.get('nik');
  }

  formValidasi!: FormGroup;
  dataSourceNegara!: MatTableDataSource<Negara>;
  dataNegara: Negara[] = [];
  dataSourceProvinsi!: MatTableDataSource<Provinsi>;
  dataProvinsi: Provinsi[] = [];
  namaKecamatan: any;
  idKecamatan: any;
  namaKabupaten: any;
  idKabupaten: any;
  selectNameProvinsi: any;
  selectIdProvinsi: any;
  selectNameNegara: any;
  selectIdNegara: any;
  id: any;
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

  getIdKecamatan() {
    this.wilayahService.getId('district/' + this.id).subscribe((res) => {
      console.log(res);
      this.namaKecamatan = res.body.result.districtName;
      this.namaKabupaten = res.body.result.cityName;
      this.idKabupaten = res.body.result.cityId;
      this.selectNameProvinsi = res.body.result.provinceName;
      this.selectIdProvinsi = res.body.result.provinceId;
      this.selectNameNegara = res.body.result.countryNameIdn;
      this.selectIdNegara = res.body.result.countryId;
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
        this.selectIdProvinsi = res.countryId;
        this.selectNameNegara = res.countryNameIdn;
        this.selectIdNegara = res.provinceId;
      });
  }

  saveEditKecamatan() {
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
      districtId: this.idKecamatan,
      districtName: this.namaKecamatan,
      cityId: this.idKabupaten,
      cityName: this.namaKabupaten,
      provinceId: this.selectIdProvinsi,
      countryId: this.selectIdNegara,
      updatedBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.putId('district', parameter).subscribe(
      (res) => {
        console.log(res);
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
      selectNameProvinsi: { value: '', disabled: true },
      selectNameNegara: { value: '', disabled: true },
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.nik = this.activatedRoute.snapshot.paramMap.get('nik');
    console.log(this.nik);
    this.idKecamatan = this.id;
    this.getCountry();
    this.getProvinsi();
    this.getIdKecamatan();
    this.title.setTitle('Edit Kecamatan');
  }
}
