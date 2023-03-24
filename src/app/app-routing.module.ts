import { RouterModule, Routes } from '@angular/router';

import { AuthCheckComponent } from './component/auth-check/auth-check.component';
import { AuthGuard } from './guard/auth.guard';
import { CreateKabupatenComponent } from './component/wilayah-kabupaten/create-kabupaten/create-kabupaten.component';
import { CreateKecamatanComponent } from './component/wilayah-kecamatan/create-kecamatan/create-kecamatan.component';
import { CreateKelurahanComponent } from './component/wilayah-kelurahan/create-kelurahan/create-kelurahan.component';
import { CreateNegaraAuthComponent } from './component/wilayah-negara-auth/create-negara-auth/create-negara-auth.component';
import { CreateNegaraComponent } from './component/wilayah-negara/create-negara/create-negara.component';
import { CreateProvinsiComponent } from './component/wilayah-provinsi/create-provinsi/create-provinsi.component';
import { EditKabupatenComponent } from './component/wilayah-kabupaten/edit-kabupaten/edit-kabupaten.component';
import { EditKecamatanComponent } from './component/wilayah-kecamatan/edit-kecamatan/edit-kecamatan.component';
import { EditKelurahanComponent } from './component/wilayah-kelurahan/edit-kelurahan/edit-kelurahan.component';
import { EditNegaraAuthComponent } from './component/wilayah-negara-auth/edit-negara-auth/edit-negara-auth.component';
import { EditNegaraComponent } from './component/wilayah-negara/edit-negara/edit-negara.component';
import { EditProvinsiComponent } from './component/wilayah-provinsi/edit-provinsi/edit-provinsi.component';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { WilayahKabupatenComponent } from './component/wilayah-kabupaten/wilayah-kabupaten.component';
import { WilayahKecamatanComponent } from './component/wilayah-kecamatan/wilayah-kecamatan.component';
import { WilayahKelurahanComponent } from './component/wilayah-kelurahan/wilayah-kelurahan.component';
import { WilayahNegaraAuthComponent } from './component/wilayah-negara-auth/wilayah-negara-auth.component';
import { WilayahNegaraComponent } from './component/wilayah-negara/wilayah-negara.component';
import { WilayahProvinsiComponent } from './component/wilayah-provinsi/wilayah-provinsi.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth/:token', component: AuthCheckComponent },
  {
    // Negara Authentication
    path: 'wilayah-negara-auth/:token',
    component: WilayahNegaraAuthComponent,
  },
  {
    // Data Negara
    path: 'wilayah-negara',
    canActivate: [AuthGuard],
    component: WilayahNegaraComponent,
  },
  {
    // Buat Negara Authentication
    path: 'create-negara-auth/:token',
    component: CreateNegaraAuthComponent,
  },
  {
    // Buat Negara
    path: 'create-negara',
    canActivate: [AuthGuard],
    component: CreateNegaraComponent,
  },
  {
    // Edit Negara Authentication
    path: 'edit-negara-auth/:id/:token',
    component: EditNegaraAuthComponent,
  },
  {
    // Edit Negara
    path: 'edit-negara/:id',
    canActivate: [AuthGuard],
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
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
