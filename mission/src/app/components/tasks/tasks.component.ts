import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { Customer } from 'src/app/models/customer.module';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
    productForm: FormGroup;
    customers$:Observable<Customer[]>
    constructor(private productService: ProductsService, private formBuilder:FormBuilder){}

    ngOnInit():void {
      this.buildForm();
      this.productService.loadCustomers().then(() => {
        this.customers$ = this.productService.customers$;
      });  
    }
   
    buildForm() {
      this.productForm = this.formBuilder.group({
        task_description:['', [Validators.required]],
        name:['',[Validators.required]]
      })
    } 

  async save() {
      await this.productService.addNewTask(this.productForm.value)
  }
}
