import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Keluarahan } from 'src/app/model/kelurahanModel';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../services/wilayah.service';

@Component({
  selector: 'app-wilayah-kelurahan',
  templateUrl: './wilayah-kelurahan.component.html',
  styleUrls: ['./wilayah-kelurahan.component.css'],
})
export class WilayahKelurahanComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.nik = this.route.snapshot.paramMap.get('nik');
  }

  displayedColumns = [
    'no',
    'villageId',
    'villageName',
    'villagePostalCode',
    'districtName',
    'cityName',
    'provinceName',
    'countryNameIdn',
    'action',
  ];
  totalRec: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 100];
  pageEvent!: PageEvent;
  searchData: any;
  dataKeluarahan: Keluarahan[] = [];
  dataSource!: MatTableDataSource<Keluarahan>;
  dataSearchKeluarahan: any;
  isLoading = true;
  error = false;
  statusText: any;
  noData = false;
  nik: any;

  getKelurahan() {
    this.noData = false;
    this.isLoading = true;
    this.error = false;
    this.dataKeluarahan = [];
    this.dataSource = new MatTableDataSource(this.dataKeluarahan);
    this.wilayahService
      .getAll(
        'village/?sort=villageName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe(
        (res) => {
          this.totalRec = res.body.paging.totalrecord;
          res.body.result.forEach((element: any, index: any) => {
            this.dataKeluarahan.push({
              no: this.pageIndex * this.pageSize + index + 1 + '.',
              villageId: element.villageId,
              villageName: element.villageName,
              villagePostalCode: element.villagePostalCode,
              districtName: element.districtName,
              cityName: element.cityName,
              provinceName: element.provinceName,
              countryNameIdn: element.countryNameIdn,
            });
          });
          this.isLoading = false;
          this.error = false;
          this.dataSource = new MatTableDataSource(this.dataKeluarahan);
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
    // * getKelurahan
    this.dataKeluarahan = [];
    if (this.searchData == null) {
      this.wilayahService
        .getAll(
          'village/?sort=villageName,asc&page=' +
            this.pageIndex +
            '&size=' +
            this.pageSize
        )
        .subscribe(
          (res) => {
            this.pageEvent = e;
            this.pageSize = e.pageSize;
            this.pageIndex = e.pageIndex;
            this.totalRec = res.body.paging.totalrecord;
            res.body.result.forEach((element: any, index: any) => {
              this.dataKeluarahan.push({
                no: this.pageIndex * this.pageSize + index + 1 + '.',
                villageId: element.villageId,
                villageName: element.villageName,
                villagePostalCode: element.villagePostalCode,
                districtName: element.districtName,
                cityName: element.cityName,
                provinceName: element.provinceName,
                countryNameIdn: element.countryNameIdn,
              });
            });
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(this.dataKeluarahan);
          },
          (error) => {
            console.log(error);
            console.log(error.error.error);
            let errorText = error.error.error;
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: errorText,
              showConfirmButton: true,
            });
          }
        );
    } else {
      this.dataSearchKeluarahan = [];
      this.wilayahService
        .getAll(
          'village/?villageId.contains=' +
            this.searchData +
            '&villageName.contains=' +
            this.searchData +
            '&villagePostalCode.contains=' +
            this.searchData +
            '&districtName.contains=' +
            this.searchData +
            '&cityName.contains=' +
            this.searchData +
            '&provinceName.contains=' +
            this.searchData +
            '&countryNameIdn.contains=' +
            this.searchData +
            '&sort=villageName,asc&page=' +
            this.pageIndex +
            '&size=' +
            this.pageSize
        )
        .subscribe(
          (res) => {
            this.totalRec = res.body.paging.totalrecord;
            res.body.result.forEach((element: any, index: any) => {
              this.dataSearchKeluarahan.push({
                no: this.pageIndex * this.pageSize + index + 1 + '.',
                villageId: element.villageId,
                villageName: element.villageName,
                villagePostalCode: element.villagePostalCode,
                districtName: element.districtName,
                cityName: element.cityName,
                provinceName: element.provinceName,
                countryNameIdn: element.countryNameIdn,
              });
            });
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(this.dataSearchKeluarahan);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  searchKelurahan() {
    this.isLoading = true;
    this.noData = false;
    this.pageIndex = 0;
    this.dataSearchKeluarahan = [];
    this.wilayahService
      .getAll(
        'village/?villageId.contains=' +
          this.searchData +
          '&villageName.contains=' +
          this.searchData +
          '&villagePostalCode.contains=' +
          this.searchData +
          '&districtName.contains=' +
          this.searchData +
          '&cityName.contains=' +
          this.searchData +
          '&provinceName.contains=' +
          this.searchData +
          '&countryNameIdn.contains=' +
          this.searchData +
          '&sort=villageName,asc&page=' +
          this.pageIndex +
          '&size=' +
          this.pageSize
      )
      .subscribe((res) => {
        this.totalRec = res.body.paging.totalrecord;
        res.body.result.forEach((element: any, index: any) => {
          this.dataSearchKeluarahan.push({
            no: this.pageIndex * this.pageSize + index + 1 + '.',
            villageId: element.villageId,
            villageName: element.villageName,
            villagePostalCode: element.villagePostalCode,
            districtName: element.districtName,
            cityName: element.cityName,
            provinceName: element.provinceName,
            countryNameIdn: element.countryNameIdn,
          });
        });
        this.isLoading = false;
        this.noData = true;
        this.dataSource = new MatTableDataSource(this.dataSearchKeluarahan);
      });
  }

  onSearchChange() {
    this.noData = false;
    if (this.searchData === '') {
      this.searchKelurahan();
    } else {
    }
  }

  deleteKelurahan(dataKeluarahan: any) {
    let kelurahanId = dataKeluarahan.villageId;
    let nik = this.nik;
    console.log(kelurahanId);
    Swal.fire({
      title: 'Apakah kamu yakin?',
      text: 'Apakah kamu yakin ingin menghapus data ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Tidak',
    }).then((res) => {
      if (res.isConfirmed) {
        this.wilayahService
          .deleteAll('village/' + kelurahanId + '/' + nik)
          .subscribe(
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
                  if (res) this.getKelurahan();
                });
              } else {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: statusDesc,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Service Unavailable',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
      }
    });
  }

  ngOnInit(): void {
    this.getKelurahan();
    this.nik = this.route.snapshot.paramMap.get('nik');
    console.log(this.nik);
    this.title.setTitle('Kelurahan');
  }
}
