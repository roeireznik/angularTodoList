import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { TasksComponent } from './components/tasks/tasks.component';



const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'customers',component:CustomersComponent},
    {path:'tasks',component:TasksComponent},
    {path:'', pathMatch:'full', redirectTo:'home'}
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
