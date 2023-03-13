import { Component, OnInit } from '@angular/core';

import { DataProvinsi } from 'src/app/model/provinsiModel';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { WilayahService } from '../../wilayah.service';

@Component({
  selector: 'app-data-provinsi',
  templateUrl: './data-provinsi.component.html',
  styleUrls: ['./data-provinsi.component.css'],
})
export class DataProvinsiComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DataProvinsiComponent>,
    private wilayahService: WilayahService
  ) {}

  displayedColumns = ['provinceId', 'provinceName', 'countryNameIdn'];
  totalRec: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 100];
  dataProvinsi: DataProvinsi[] = [];
  dataSource!: MatTableDataSource<DataProvinsi>;
  pageEvent!: PageEvent;
  searchData: any;
  dataSearchProvinsi: any;
  isLoading = false;
  error = false;
  statusText: any;
  noData = false;

  getProvince() {
    this.noData = false;
    this.isLoading = true;
    this.error = false;
    this.dataProvinsi = [];
    this.dataSource = new MatTableDataSource(this.dataProvinsi);
    this.wilayahService
      .getAll(
        'province/?sort=provinceName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe(
        (res) => {
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataProvinsi.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              countryNameIdn: element.countryNameIdn,
              countryId: element.countryId,
              provinceId: element.provinceId,
              provinceName: element.provinceName,
            });
          });
          this.isLoading = false;
          this.error = false;
          this.dataSource = new MatTableDataSource(this.dataProvinsi);
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
    this.noData = false;
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    // * getProvince
    this.dataProvinsi = [];
    this.dataSource = new MatTableDataSource(this.dataProvinsi);
    if (this.searchData != null) {
      this.dataSearchProvinsi = [];
      this.wilayahService
        .getAll(
          'province/??provinceId.contains=' +
            this.searchData +
            '&provinceName.contains=' +
            this.searchData +
            '&countryNameIdn.contains=' +
            this.searchData +
            '&sort=provinceName,asc&page=' +
            this.pageIndex +
            '&size=' +
            this.pageSize
        )
        .subscribe((res) => {
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataSearchProvinsi.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              countryId: element.countryId,
              countryNameIdn: element.countryNameIdn,
              provinceId: element.provinceId,
              provinceName: element.provinceName,
            });
          });
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.dataSearchProvinsi);
        });
    } else {
      this.wilayahService
        .getAll(
          'province/?sort=provinceName,asc&page=' +
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
            this.dataProvinsi.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              countryNameIdn: element.countryNameIdn,
              countryId: element.countryId,
              provinceId: element.provinceId,
              provinceName: element.provinceName,
            });
          });
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.dataProvinsi);
        });
    }
  }

  searchProvinsi() {
    this.isLoading = true;
    this.noData = false;
    this.pageIndex = 0;
    this.dataSearchProvinsi = [];
    this.wilayahService
      .getAll(
        'province/??provinceId.contains=' +
          this.searchData +
          '&provinceName.contains=' +
          this.searchData +
          '&countryNameIdn.contains=' +
          this.searchData +
          '&sort=provinceName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe((res) => {
        this.totalRec = res.body.paging.totalrecord;
        res.body.result.forEach((element: any, index: any) => {
          this.dataSearchProvinsi.push({
            no: this.pageIndex * this.pageSize + index + 1 + '.',
            countryNameIdn: element.countryNameIdn,
            countryId: element.countryId,
            provinceId: element.provinceId,
            provinceName: element.provinceName,
          });
        });
        this.isLoading = false;
        this.noData = true;
        this.dataSource = new MatTableDataSource(this.dataSearchProvinsi);
      });
  }

  onSearchChange() {
    this.noData = false;
    if (this.searchData === '') {
      this.searchProvinsi();
    } else {
    }
  }

  chooseCell(dataProvinsi: any) {
    this.dialogRef.close(dataProvinsi);
  }
  ngOnInit(): void {
    this.getProvince();
  }
}
