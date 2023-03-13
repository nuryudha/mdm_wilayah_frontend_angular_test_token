import { Component, OnInit } from '@angular/core';

import { DataKabupaten } from 'src/app/model/kabupatenModel';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { WilayahService } from '../../wilayah.service';

@Component({
  selector: 'app-data-kabupaten',
  templateUrl: './data-kabupaten.component.html',
  styleUrls: ['./data-kabupaten.component.css'],
})
export class DataKabupatenComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    public dialogRef: MatDialogRef<DataKabupatenComponent>
  ) {}

  displayedColumns = ['cityId', 'cityName', 'provinceName', 'countryNameIdn'];
  totalRec: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 100];
  dataKabupaten: DataKabupaten[] = [];
  dataSource!: MatTableDataSource<DataKabupaten>;
  pageEvent!: PageEvent;
  searchData: any;
  dataSearchKabupaten: any;
  isLoading = false;
  error = false;
  statusText: any;
  noData = false;

  getKabupaten() {
    this.isLoading = true;
    this.error = false;
    this.dataKabupaten = [];
    this.dataSource = new MatTableDataSource(this.dataKabupaten);
    this.wilayahService
      .getAll(
        'city/?sort=cityName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataKabupaten.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              cityId: element.cityId,
              cityName: element.cityName,
              provinceName: element.provinceName,
              countryNameIdn: element.countryNameIdn,
              countryId: element.countryId,
              provinceId: element.provinceId,
            });
          });
          this.isLoading = false;
          this.error = false;
          this.dataSource = new MatTableDataSource(this.dataKabupaten);
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
    // * getKabupaten
    this.dataKabupaten = [];
    if (this.searchData == null) {
      this.wilayahService
        .getAll(
          'city/?sort=cityName,asc&page=' +
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
            this.dataKabupaten.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              cityId: element.cityId,
              cityName: element.cityName,
              provinceName: element.provinceName,
              countryNameIdn: element.countryNameIdn,
              countryId: element.countryId,
              provinceId: element.provinceId,
            });
          });
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.dataKabupaten);
        });
    } else {
      this.noData = true;
      this.dataSearchKabupaten = [];
      this.wilayahService
        .getAll(
          'city/?cityId.contains=' +
            this.searchData +
            '&cityName.contains=' +
            this.searchData +
            '&provinceName.contains=' +
            this.searchData +
            '&countryNameIdn.contains=' +
            this.searchData +
            '&sort=cityName,asc&page=' +
            this.pageIndex +
            '&size=' +
            this.pageSize
        )
        .subscribe((res) => {
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataSearchKabupaten.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              cityId: element.cityId,
              cityName: element.cityName,
              provinceName: element.provinceName,
              countryNameIdn: element.countryNameIdn,
              countryId: element.countryId,
              provinceId: element.provinceId,
            });
          });
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.dataSearchKabupaten);
        });
    }
  }

  searchKabupaten() {
    this.isLoading = true;
    this.noData = false;
    this.pageIndex = 0;
    this.dataSearchKabupaten = [];
    this.wilayahService
      .getAll(
        'city/?cityId.contains=' +
          this.searchData +
          '&cityName.contains=' +
          this.searchData +
          '&provinceName.contains=' +
          this.searchData +
          '&countryNameIdn.contains=' +
          this.searchData +
          '&sort=cityName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe((res) => {
        this.totalRec = res.body.paging.totalrecord;
        res.body.result.forEach((element: any, index: any) => {
          this.dataSearchKabupaten.push({
            no: this.pageIndex * this.pageSize + index + 1 + '.',
            cityId: element.cityId,
            cityName: element.cityName,
            provinceName: element.provinceName,
            countryNameIdn: element.countryNameIdn,
          });
        });
        this.isLoading = false;
        this.noData = true;
        this.dataSource = new MatTableDataSource(this.dataSearchKabupaten);
      });
  }

  onSearchChange() {
    this.noData = false;
    if (this.searchData === '') {
      this.searchKabupaten();
    } else {
    }
  }

  chooseCell(dataKabupaten: any) {
    this.dialogRef.close(dataKabupaten);
  }

  ngOnInit(): void {
    this.getKabupaten();
  }
}
