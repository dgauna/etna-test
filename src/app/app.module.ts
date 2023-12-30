import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { TasksComponent } from './core/components/tasks/tasks.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar'
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge'
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { CreateTaskComponent } from './core/components/tasks/create-task/create-task.component';
import { UpdateTaskComponent } from './core/components/tasks/update-task/update-task.component';

import {AppInterceptor} from './core/app.interceptors'
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TasksComponent,
    LoginComponent,
    RegisterComponent,
    CreateTaskComponent,
    UpdateTaskComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    SelectButtonModule,
    DropdownModule,
    InputTextareaModule,
    CardModule,
    DividerModule,
    CheckboxModule,
    AvatarModule,
    BadgeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
