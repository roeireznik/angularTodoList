import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Customer } from 'src/app/models/customer.module';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private taskSubject = new BehaviorSubject<Customer[]>([])
  private customerSubject = new BehaviorSubject<Customer[]>([])

  get tasks$(): Observable<Customer[]> {
        return this.taskSubject.asObservable()
  }
  get customers$(): Observable<Customer[]> {
        return this.customerSubject.asObservable()
  }
  
  private serverUrl = environment.serverUrl

  async loadTasks(): Promise<Customer[]> {
    const tasks = await firstValueFrom(this.httpClient.get<Customer[]>(`${this.serverUrl}`))
    this.taskSubject.next(tasks)
    return tasks
  }

  async loadCustomers(): Promise<Customer[]> {
    const customers = await firstValueFrom(this.httpClient.get<Customer[]>(`${this.serverUrl}customers`))
    this.customerSubject.next(customers)
    return customers
  }

  async deleteTask(id:number):Promise<any>
  {
    await firstValueFrom(this.httpClient.delete<any>(`${this.serverUrl}deleteTask/?id=${id}`))
    await this.loadTasks()
  }

  async deleteCustomer(id:number):Promise<any>
  {
    await firstValueFrom(this.httpClient.delete<any>(`${this.serverUrl}deleteCustomer/?id=${id}`))
    await this.loadCustomers()
  }

  async addNewTask(task:Customer){
    await firstValueFrom(this.httpClient.post<Customer>(`${this.serverUrl}addTask`,task))
    this.loadTasks()
  }
  async addNewCustomer(customer:Customer){
    await firstValueFrom(this.httpClient.post<Customer>(`${this.serverUrl}addCustomer`,customer))
    this.loadCustomers()
  }

  async isDone(id:number,done:boolean):Promise<any>
  {
    await firstValueFrom(this.httpClient.put<any>(`${this.serverUrl}isdone/?id=${id}&done=${done}`,null))
    this.loadTasks()
  }

  
  async saveTask(task:Customer):Promise<Customer> {
      const p = await firstValueFrom(this.httpClient.put<Customer>(`${this.serverUrl}editCustomer`,task))
      this.loadTasks()
      return p;
  }

  constructor(private httpClient:HttpClient) { }
}
