import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Kecamatan } from 'src/app/model/kecamatanModel';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { WilayahService } from '../../services/wilayah.service';

@Component({
  selector: 'app-wilayah-kecamatan',
  templateUrl: './wilayah-kecamatan.component.html',
  styleUrls: ['./wilayah-kecamatan.component.css'],
})
export class WilayahKecamatanComponent implements OnInit {
  constructor(
    private wilayahService: WilayahService,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.nik = this.route.snapshot.paramMap.get('nik');
  }

  displayedColumns = [
    'no',
    'districtId',
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
  searchData: any;
  dataSearchKecamatan: any;
  dataKecamatan: Kecamatan[] = [];
  dataSource!: MatTableDataSource<Kecamatan>;
  pageEvent!: PageEvent;
  isLoading = true;
  error = false;
  statusText: any;
  noData = false;
  nik: any;

  getKecamatan() {
    this.noData = false;
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
              cityName: element.cityName,
              provinceName: element.provinceName,
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
    this.noData = false;
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
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
        .subscribe(
          (res) => {
            this.pageEvent = e;
            this.pageSize = e.pageSize;
            this.pageIndex = e.pageIndex;
            this.totalRec = res.body.paging.totalrecord;
            res.body.result.forEach((element: any, index: any) => {
              this.dataKecamatan.push({
                no: this.pageIndex * this.pageSize + index + 1 + '.',
                districtId: element.districtId,
                districtName: element.districtName,
                cityName: element.cityName,
                provinceName: element.provinceName,
                countryNameIdn: element.countryNameIdn,
              });
            });
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(this.dataKecamatan);
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
      this.dataSearchKecamatan = [];
      this.wilayahService
        .getAll(
          'district/?districtId.contains=' +
            this.searchData +
            '&districtName.contains=' +
            this.searchData +
            '&cityName.contains=' +
            this.searchData +
            '&provinceName.contains=' +
            this.searchData +
            '&countryNameIdn.contains=' +
            this.searchData +
            '&sort=districtName,asc&page=' +
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
              cityName: element.cityName,
              provinceName: element.provinceName,
              countryNameIdn: element.countryNameIdn,
            });
          });

          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.dataSearchKecamatan);
        });
    }
  }
  searchKecamatan() {
    this.noData = false;
    this.isLoading = true;
    this.pageIndex = 0;
    this.dataSearchKecamatan = [];
    this.wilayahService
      .getAll(
        'district/?districtId.contains=' +
          this.searchData +
          '&districtName.contains=' +
          this.searchData +
          '&cityName.contains=' +
          this.searchData +
          '&provinceName.contains=' +
          this.searchData +
          '&countryNameIdn.contains=' +
          this.searchData +
          '&sort=districtName,asc&page=' +
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
            cityName: element.cityName,
            provinceName: element.provinceName,
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
      this.searchKecamatan();
    } else {
    }
  }

  deleteKecamatan(dataKecamatan: any) {
    let kecamatanId = dataKecamatan.districtId;
    let nik = this.nik;
    console.log(kecamatanId);
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
          .deleteAll('district/' + kecamatanId + '/' + nik)
          .subscribe(
            (res) => {
              let statusCode = res.body.status.responseCode;
              if (statusCode == '200') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Berhasil',
                  showConfirmButton: false,
                  timer: 1500,
                }).then((res) => {
                  if (res) this.getKecamatan();
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
    this.getKecamatan();
    this.nik = this.route.snapshot.paramMap.get('nik');
    console.log(this.nik);
    this.title.setTitle('Kecamatan');
  }
}
