import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WilayahNegaraComponent } from './component/wilayah-negara/wilayah-negara.component';
import { WilayahProvinsiComponent } from './component/wilayah-provinsi/wilayah-provinsi.component';
import { CreateNegaraComponent } from './component/wilayah-negara/create-negara/create-negara.component';
import { EditNegaraComponent } from './component/wilayah-negara/edit-negara/edit-negara.component';
import { CreateProvinsiComponent } from './component/wilayah-provinsi/create-provinsi/create-provinsi.component';
import { EditProvinsiComponent } from './component/wilayah-provinsi/edit-provinsi/edit-provinsi.component';
import { WilayahKabupatenComponent } from './component/wilayah-kabupaten/wilayah-kabupaten.component';
import { CreateKabupatenComponent } from './component/wilayah-kabupaten/create-kabupaten/create-kabupaten.component';
import { EditKabupatenComponent } from './component/wilayah-kabupaten/edit-kabupaten/edit-kabupaten.component';
import { WilayahKecamatanComponent } from './component/wilayah-kecamatan/wilayah-kecamatan.component';
import { CreateKecamatanComponent } from './component/wilayah-kecamatan/create-kecamatan/create-kecamatan.component';
import { EditKecamatanComponent } from './component/wilayah-kecamatan/edit-kecamatan/edit-kecamatan.component';
import { WilayahKelurahanComponent } from './component/wilayah-kelurahan/wilayah-kelurahan.component';
import { CreateKelurahanComponent } from './component/wilayah-kelurahan/create-kelurahan/create-kelurahan.component';
import { EditKelurahanComponent } from './component/wilayah-kelurahan/edit-kelurahan/edit-kelurahan.component';

const routes: Routes = [
  {
    //negara
    path: 'wilayah-negara/:nik',
    component: WilayahNegaraComponent,
  },
  {
    path: 'create-negara/:nik',
    component: CreateNegaraComponent,
  },
  {
    path: 'edit-negara/:id/:nik',
    component: EditNegaraComponent,
  },
  {
    path: 'wilayah-provinsi/:nik',
    component: WilayahProvinsiComponent,
  },
  {
    path: 'create-provinsi/:nik',
    component: CreateProvinsiComponent,
  },
  {
    path: 'edit-provinsi/:id/:nik',
    component: EditProvinsiComponent,
  },
  {
    path: 'wilayah-kabupaten/:nik',
    component: WilayahKabupatenComponent,
  },
  {
    path: 'create-kabupaten/:nik',
    component: CreateKabupatenComponent,
  },
  {
    path: 'edit-kabupaten/:id/:nik',
    component: EditKabupatenComponent,
  },
  {
    path: 'wilayah-kecamatan/:nik',
    component: WilayahKecamatanComponent,
  },
  {
    path: 'create-kecamatan/:nik',
    component: CreateKecamatanComponent,
  },
  {
    path: 'edit-kecamatan/:id/:nik',
    component: EditKecamatanComponent,
  },
  {
    path: 'wilayah-kelurahan/:nik',
    component: WilayahKelurahanComponent,
  },
  {
    path: 'create-kelurahan/:nik',
    component: CreateKelurahanComponent,
  },
  {
    path: 'edit-kelurahan/:id/:nik',
    component: EditKelurahanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
