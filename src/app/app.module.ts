import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationFormComponent } from './pages/application-form/application-form.component';
import { StatusComponent } from './pages/status/status.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PlansComponent } from './pages/plans/plans.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DisclaimerComponent } from './pages/disclaimer/disclaimer.component';
import { TermsComponent } from './pages/terms/terms.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { DataPrivacyComponent } from './pages/data-privacy/data-privacy.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { TopupApprovalComponent } from './pages/topup-approval/topup-approval.component';
import { TransactionRecordsComponent } from './pages/transaction-records/transaction-records.component';
import { UserTransactionHistoryComponent } from './pages/user-transaction-history/user-transaction-history.component';
import { FarmerIdCardFormComponent } from './pages/farmer-id-card-form/farmer-id-card-form.component';
import { FarmerDetailComponent } from './pages/farmer-detail/farmer-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ApplicationFormComponent,
    StatusComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    PlansComponent,
    ContactComponent,
    DisclaimerComponent,
    TermsComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    DataPrivacyComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    UserManagementComponent,
    TopupApprovalComponent,
    TransactionRecordsComponent,
    UserTransactionHistoryComponent,
    FarmerIdCardFormComponent,
    FarmerDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
