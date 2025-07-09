import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationFormComponent } from './pages/application-form/application-form.component';
import { StatusComponent } from './pages/status/status.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PlansComponent } from './pages/plans/plans.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DisclaimerComponent } from './pages/disclaimer/disclaimer.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { DataPrivacyComponent } from './pages/data-privacy/data-privacy.component';
import { AuthGuard } from './guards/auth.guard';

import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { TopupApprovalComponent } from './pages/topup-approval/topup-approval.component';
import { TransactionRecordsComponent } from './pages/transaction-records/transaction-records.component';
import { UserTransactionHistoryComponent } from './pages/user-transaction-history/user-transaction-history.component';
import { FarmerDetailComponent } from './pages/farmer-detail/farmer-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'application-form', component: ApplicationFormComponent },
  { path: 'status', component: StatusComponent },
  { path: 'about', component: AboutComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'data', component: DataPrivacyComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/topups', component: TopupApprovalComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/transactions', component: TransactionRecordsComponent, canActivate: [AdminAuthGuard] },
  { path: 'transactions', component: UserTransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'farmer/:farmerId', component: FarmerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
