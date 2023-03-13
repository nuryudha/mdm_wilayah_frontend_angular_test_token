import { AlfabetOnlyDirective } from './directives/alfabet-only.directive';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CreateKabupatenComponent } from './component/wilayah-kabupaten/create-kabupaten/create-kabupaten.component';
import { CreateKecamatanComponent } from './component/wilayah-kecamatan/create-kecamatan/create-kecamatan.component';
import { CreateKelurahanComponent } from './component/wilayah-kelurahan/create-kelurahan/create-kelurahan.component';
import { CreateNegaraComponent } from './component/wilayah-negara/create-negara/create-negara.component';
import { CreateProvinsiComponent } from './component/wilayah-provinsi/create-provinsi/create-provinsi.component';
import { DataKabupatenComponent } from './component/wilayah-kecamatan/data-kabupaten/data-kabupaten.component';
import { DataKecamatanComponent } from './component/wilayah-kelurahan/data-kecamatan/data-kecamatan.component';
import { DataProvinsiComponent } from './component/wilayah-kabupaten/data-provinsi/data-provinsi.component';
import { EditKabupatenComponent } from './component/wilayah-kabupaten/edit-kabupaten/edit-kabupaten.component';
import { EditKecamatanComponent } from './component/wilayah-kecamatan/edit-kecamatan/edit-kecamatan.component';
import { EditKelurahanComponent } from './component/wilayah-kelurahan/edit-kelurahan/edit-kelurahan.component';
import { EditNegaraComponent } from './component/wilayah-negara/edit-negara/edit-negara.component';
import { EditProvinsiComponent } from './component/wilayah-provinsi/edit-provinsi/edit-provinsi.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { WilayahKabupatenComponent } from './component/wilayah-kabupaten/wilayah-kabupaten.component';
import { WilayahKecamatanComponent } from './component/wilayah-kecamatan/wilayah-kecamatan.component';
import { WilayahKelurahanComponent } from './component/wilayah-kelurahan/wilayah-kelurahan.component';
import { WilayahNegaraComponent } from './component/wilayah-negara/wilayah-negara.component';
import { WilayahProvinsiComponent } from './component/wilayah-provinsi/wilayah-provinsi.component';

@NgModule({
  declarations: [
    AppComponent,
    WilayahNegaraComponent,
    WilayahProvinsiComponent,
    CreateNegaraComponent,
    EditNegaraComponent,
    NumberOnlyDirective,
    AlfabetOnlyDirective,
    CreateProvinsiComponent,
    EditProvinsiComponent,
    WilayahKabupatenComponent,
    WilayahKelurahanComponent,
    WilayahKecamatanComponent,
    CreateKabupatenComponent,
    EditKabupatenComponent,
    CreateKecamatanComponent,
    EditKecamatanComponent,
    CreateKelurahanComponent,
    EditKelurahanComponent,
    DataKabupatenComponent,
    DataKecamatanComponent,
    DataProvinsiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
