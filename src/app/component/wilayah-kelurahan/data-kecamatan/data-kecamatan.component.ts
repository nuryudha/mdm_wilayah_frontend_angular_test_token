import { Component, OnInit } from '@angular/core';

import { DataKecamatan } from 'src/app/model/kecamatanModel';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { WilayahService } from '../../../services/wilayah.service';

@Component({
  selector: 'app-data-kecamatan',
  templateUrl: './data-kecamatan.component.html',
  styleUrls: ['./data-kecamatan.component.css'],
})
export class DataKecamatanComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    public dialogRef: MatDialogRef<DataKecamatanComponent>
  ) {}
  displayedColumns = [
    'districtId',
    'districtName',
    'cityName',
    'provinceName',
    'countryNameIdn',
  ];
  totalRec: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 100];
  pageEvent!: PageEvent;
  searchData: any;
  dataSearchKecamatan: any;
  dataSource!: MatTableDataSource<DataKecamatan>;
  dataKecamatan: DataKecamatan[] = [];
  isLoading = false;
  error = false;
  statusText: any;
  noData = false;

  getKecamatan() {
    this.isLoading = true;
    this.error = false;
    this.dataKecamatan = [];
    this.dataSource = new MatTableDataSource(this.dataKecamatan);
    this.wilayahService
      .getAll(
        'district/?sort=districtName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe(
        (res) => {
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataKecamatan.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              districtId: element.districtId,
              districtName: element.districtName,
              cityId: element.cityId,
              cityName: element.cityName,
              provinceId: element.provinceId,
              provinceName: element.provinceName,
              countryId: element.countryId,
              countryNameIdn: element.countryNameIdn,
            });
          });
          this.isLoading = false;
          this.error = false;
          this.dataSource = new MatTableDataSource(this.dataKecamatan);
        },
        (error) => {
          console.log(error);
          this.statusText = error.statusText;
          this.isLoading = false;
          this.error = true;
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
      );
  }

  handlePageEvent(e: PageEvent) {
    this.isLoading = true;
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log(this.pageEvent);
    // * getKecamatan
    this.dataKecamatan = [];
    if (this.searchData == null) {
      this.wilayahService
        .getAll(
          'district/?sort=districtName,asc&page=' +
            this.pageIndex +
            '&size=' +
            this.pageSize
        )
        .subscribe((res) => {
          this.pageEvent = e;
          this.pageSize = e.pageSize;
          this.pageIndex = e.pageIndex;
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataKecamatan.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              districtId: element.districtId,
              districtName: element.districtName,
              cityId: element.cityId,
              cityName: element.cityName,
              provinceId: element.provinceId,
              provinceName: element.provinceName,
              countryId: element.countryId,
              countryNameIdn: element.countryNameIdn,
            });
          });
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.dataKecamatan);
        });
    } else {
      this.isLoading = false;
      this.noData = true;
      this.dataSearchKecamatan = [];
      this.wilayahService
        .getAll(
          'district/?district.contains=' +
            this.searchData +
            '&districtName.contains=' +
            this.searchData +
            '&cityName.contains=' +
            this.searchData +
            '&provinceName.contains=' +
            this.searchData +
            '&countryNameIdn.contains=' +
            this.searchData +
            '&page=' +
            this.pageIndex +
            '&size=' +
            this.pageSize
        )
        .subscribe((res) => {
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataSearchKecamatan.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              districtId: element.districtId,
              districtName: element.districtName,
              cityId: element.cityId,
              cityName: element.cityName,
              provinceId: element.provinceId,
              provinceName: element.provinceName,
              countryId: element.countryId,
              countryNameIdn: element.countryNameIdn,
            });
          });
          this.dataSource = new MatTableDataSource(this.dataSearchKecamatan);
        });
    }
  }

  searchKabupaten() {
    this.isLoading = true;
    this.noData = false;
    this.pageIndex = 0;
    this.dataSearchKecamatan = [];
    this.wilayahService
      .getAll(
        'district/?district.contains=' +
          this.searchData +
          '&districtName.contains=' +
          this.searchData +
          '&cityName.contains=' +
          this.searchData +
          '&provinceName.contains=' +
          this.searchData +
          '&countryNameIdn.contains=' +
          this.searchData +
          '&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe((res) => {
        this.totalRec = res.body.paging.totalrecord;
        res.body.result.forEach((element: any, index: any) => {
          this.dataSearchKecamatan.push({
            no: this.pageIndex * this.pageSize + index + 1 + '.',
            districtId: element.districtId,
            districtName: element.districtName,
            cityId: element.cityId,
            cityName: element.cityName,
            provinceId: element.provinceId,
            provinceName: element.provinceName,
            countryId: element.countryId,
            countryNameIdn: element.countryNameIdn,
          });
        });
        this.isLoading = false;
        this.noData = true;
        this.dataSource = new MatTableDataSource(this.dataSearchKecamatan);
      });
  }

  onSearchChange() {
    this.noData = false;
    if (this.searchData === '') {
      this.searchKabupaten();
    } else {
    }
  }

  chooseCell(dataKecamatan: any) {
    // console.log(dataKecamatan);
    this.dialogRef.close(dataKecamatan);
  }

  ngOnInit(): void {
    this.getKecamatan();
  }
}
