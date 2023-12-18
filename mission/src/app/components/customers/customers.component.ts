import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { Customer } from 'src/app/models/customer.module';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
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
      name:['',[Validators.required]],
      job:['',[Validators.required]],
      phone:['',[Validators.required]],
      email:['',[Validators.required]]
    })
  } 

  async save() {
      await this.productService.addNewCustomer(this.productForm.value)
  }

  async deleteCustomer(id:number){
    if(confirm('Do you sure you want to delete customer all the tasks that related to him will be deleted') == true){
        try {
          await this.productService.deleteCustomer(id)
          alert('נמחק בהצלחה')
        } catch (error) {
            alert('לא ניתן למחוק את המוצר')
        }
    }

  }





  
}
