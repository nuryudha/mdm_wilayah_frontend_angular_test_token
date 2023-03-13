import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataProvinsiComponent } from '../data-provinsi/data-provinsi.component';
import { MatTableDataSource } from '@angular/material/table';
import { Negara } from 'src/app/model/negaraModel';
import { Provinsi } from 'src/app/model/provinsiModel';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../../services/wilayah.service';

@Component({
  selector: 'app-edit-kabupaten',
  templateUrl: './edit-kabupaten.component.html',
  styleUrls: ['./edit-kabupaten.component.css'],
})
export class EditKabupatenComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
    this.cekValidasi();
    this.nik = this.activatedRoute.snapshot.paramMap.get('nik');
  }

  namaKabupaten: any;
  selectIdProvinsi: any;
  selectNameProvinsi: any;
  selectIdNegara: any;
  dataSourceNegara!: MatTableDataSource<Negara>;
  dataNegara: Negara[] = [];
  dataSourceProvinsi!: MatTableDataSource<Provinsi>;
  dataProvinsi: Provinsi[] = [];
  formValidasi!: FormGroup;
  id: any;
  idKabupaten: any;
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
        // console.log(res);
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
        // console.log(res);
        this.dataProvinsi = res.body.result;
        this.dataSourceProvinsi = new MatTableDataSource(this.dataProvinsi);
      });
  }

  getIdKabupaten() {
    this.wilayahService.getId('city/' + this.id).subscribe((res) => {
      console.log(res);
      this.namaKabupaten = res.body.result.cityName;
      this.selectNameProvinsi = res.body.result.provinceName;
      this.selectIdProvinsi = res.body.result.provinceId;
      this.selectIdNegara = res.body.result.countryId;
    });
  }

  getDataProvinsi() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.width = '60%';
    dialogConfig.height = '80%';
    this.dialog
      .open(DataProvinsiComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        // console.log(res);
        this.selectIdProvinsi = res.provinceId;
        this.selectNameProvinsi = res.provinceName;
        this.selectIdNegara = res.countryId;
      });
  }

  saveEditKabupaten() {
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
      provinceId: this.selectIdProvinsi,
      countryId: this.selectIdNegara,
      updatedBy: this.nik,
    };
    console.log(parameter);
    this.wilayahService.putId('city/', parameter).subscribe(
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
              this.router.navigate(['/wilayah-kabupaten/' + this.nik]);
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
      idKabupaten: { value: '', disabled: true },
      namaKabupaten: ['', [Validators.required]],
      selectNameProvinsi: ['', [Validators.required]],
      selectIdNegara: { value: '', disabled: true },
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.nik = this.activatedRoute.snapshot.paramMap.get('nik');
    console.log(this.nik);
    this.idKabupaten = this.id;
    this.getCountry();
    this.getProvinsi();
    this.getIdKabupaten();
    this.title.setTitle('Edit Kabupaten');
  }
}
