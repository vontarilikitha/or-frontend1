import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { OutletContext, Router } from '@angular/router';
import { DataService } from '../Services/data.service';
 //import { UserDataService } from '../services/user-data.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css',

})
export class LogInComponent {


  @ViewChild('emailId') emailId!:any;
  @ViewChild('roleId') roleId!:any;
  @ViewChild('password') password!:any;

  errorMessage:boolean = false;
  file!: Blob;

    
  constructor(private http:HttpClient,private router: Router,private dataService:DataService) {
    // ,
    // ,private userDataService: UserDataService
  }
  ngOnViewInit(){
    this.call();
  }
  async call(){
    console.log('print');
  
  //  this.router.navigateByUrl('/signup');
  
    let response:any;

    let userEmail =this.emailId?.nativeElement.value;
    let roleId = this.roleId?.nativeElement.value;

    if(userEmail == "abc@gmail.com" && roleId=="admin" && this.password?.nativeElement.value=="gog89p13"){
      this.dataService.isAdmin = true;
      this.dataService.showLogIn = false;
      this.dataService.userLoggedIn = true;

      this.dataService.userData = {
        "role" : {
          "roleId" : "admin",
          "roleTitle":"admin"
        }
      }

     // const data2:any = await this.http.get(`http://localhost:8080/getAllAppointments`).toPromise();


      this.router.navigateByUrl('/welcome');
    }
    else{
      console.log(userEmail);
      let a = this.http.get(`http://localhost:8080/getUserByRoleId/${roleId}`).subscribe(
        (data) => {
          console.log(data);
          response = data;

          console.log(this.password?.nativeElement.value);
          console.log(this.roleId?.nativeElement.value);
          
          if(response.password == this.password?.nativeElement.value && response.role.roleId == this.roleId?.nativeElement.value){
            this.dataService.showLogIn = false;
            this.dataService.userLoggedIn = true;
            this.dataService.userData = data;
            if(this.dataService.userData.role.roleTitle == "employer")
              this.dataService.isEmployer = true;
            this.router.navigateByUrl("/welcome");
          }
          else{
            this.errorMessage = true;
          }
        },
        (error) => {
          this.errorMessage = true;
          console.log(error);
        }
      );

    
    }
  
      
  }
  
}

