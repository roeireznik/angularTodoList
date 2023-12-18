import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { Customer } from 'src/app/models/customer.module';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  tasks$:Observable<Customer[]>
  customers$:Observable<Customer[]>

  editModes: { [key: number]: boolean | never } = {};
  productForm: FormGroup; 
  currentTask: Customer | null = null;
  currentTaskId: number | null = null;

  constructor(private productService: ProductsService, private formBuilder:FormBuilder,private datePipe: DatePipe) { }

  ngOnInit():void {
    this.buildForm();
    this.productService.loadTasks().then(() => {
      this.tasks$ = this.productService.tasks$;
    })

    this.productService.loadCustomers().then(() => {
      this.customers$ = this.productService.customers$;
    });  
    
  }

  async deleteTask(id:number) {
      try {
          await this.productService.deleteTask(id)
          alert('נמחק בהצלחה')
      } catch (error) {
          alert('לא ניתן למחוק את המוצר')
      }
  }

  async isDone(id:number,done:boolean) {
      try {
        await this.productService.isDone(id,done)
        alert('סטטוס שונה')

      } catch (error) {
          alert('לא ניתן לשנות סטטוס')
      }
  }

  editTask(task: Customer) {
    if (this.currentTaskId !== null && this.currentTaskId !== task.ID) {
      this.editModes[this.currentTaskId] = false;
    }


    this.editModes[task.ID] = !this.editModes[task.ID];
    this.currentTaskId = this.editModes[task.ID] ? task.ID : null;

    if (this.editModes[task.ID]) {
      this.productForm.setValue({
        task: task.task_description,
        name: task.coustomer_id,
        date: this.datePipe.transform(task.date, 'yyyy-MM-dd'),
        done: task.is_done,
      });
    } 
  }


  buildForm(): void {
    this.productForm = this.formBuilder.group({
      task: ['', Validators.required],  
      name: [null, Validators.required],
      date: [new Date(), Validators.required],
      done: [false, Validators.required], 
    });

  }



  async save(id:number){

      try {
        const currentTask = await firstValueFrom(this.tasks$)
        .then((tasks) => tasks!.find((task) => task.ID === id));
        if (currentTask) {
          currentTask.task_description = this.productForm.value.task;
          currentTask.name = this.productForm.value.name;
          currentTask.date = this.productForm.value.date;
          currentTask.is_done = this.productForm.value.done;
          this.productForm.reset();
          this.editModes[id] = false
          await this.productService.saveTask(currentTask);

        } else {
          alert('Task not found.');
        }
      } catch (error) {
        alert('Failed to save task.');
      }
  }
}
