import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EmployersDetailsService } from '../Services/employers-details.service';
import emailjs from '@emailjs/browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthGuardService } from '../Services/auth-guard.service';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.css'
})
export class EmployerProfileComponent {
  
  jobs:any = {};
  @ViewChild('table') table: ElementRef|undefined;
  userName: any;
  roleId: any;
  userMail: any;
  phoneNo: any;
  address: any;
  nationality: any;
  company: any;
  companyAddress: any;
  sector: any;
  companySize: any;

  
  @ViewChild('phoneNo1') phoneNo1:ElementRef | undefined;
  @ViewChild('address1') address1: ElementRef | undefined;
  @ViewChild('sector1') sector1: ElementRef | undefined;
  @ViewChild('nationality1') nationality1: ElementRef | undefined;
  @ViewChild('companySize1') companySize1: ElementRef | undefined; 
  @ViewChild('company1') company1: ElementRef | undefined;
  @ViewChild('companyAddress1') companyAddress1: ElementRef | undefined;

  showModal:boolean = false;
  password: any;
  

  constructor(private employerDetailsService:EmployersDetailsService,private renderer:Renderer2,private http:HttpClient,private router: Router ,public authService:AuthGuardService , public dataService:DataService ){}

  async ngOnInit() {
    try {
      this.jobs  = await  this.employerDetailsService.getJobsByRoleId();
      this.generateTable();
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  }

  generateTable(){

    this.userName = this.employerDetailsService.employerData.userName;
    this.password = this.employerDetailsService.employerData.password;
    this.roleId = this.employerDetailsService.employerData.roleId;
    this.userMail = this.employerDetailsService.employerData.email;
    this.phoneNo = this.employerDetailsService.employerData.phoneNo;
    this.address = this.employerDetailsService.employerData.address;
    this.nationality = this.employerDetailsService.employerData.nationality;
    this.companyAddress = this.employerDetailsService.employerData.companyAddress;
    this.sector = this.employerDetailsService.employerData.sector;
    this.company = this.employerDetailsService.employerData.company;
    this.companySize = this.employerDetailsService.employerData.companySize;

    if(Object.keys(this.jobs).length == 0){
      let tr1 = this.renderer.createElement('tr');
      let p = this.renderer.createElement('p');
      p.innerHTML = "No Jobs Posted";
      this.renderer.addClass(p,'no-jobs');
      this.renderer.appendChild(tr1,p);
      this.renderer.appendChild(this.table?.nativeElement,tr1);
      return;
    }
    for(let i=0;i<Object.keys(this.jobs).length;i++){

      let tr1 = this.renderer.createElement('tr');

      
      let td2 = this.renderer.createElement('td');
      let anchor = this.renderer.createElement('a');
      anchor.innerHTML = this.jobs[i].jobName;
      
      
      this.renderer.setAttribute(anchor, "routerLink", "/job-profile"); 
      this.renderer.setAttribute(anchor,"href" ,"#");

      this.renderer.listen(anchor, 'click', (event) => {
        event.preventDefault();

        this.dataService.jobData = this.jobs[i];
        console.log('Anchor clicked');
        this.router.navigate(['/job-profile']);
         
      });

      this.renderer.appendChild(td2,anchor);
      this.renderer.appendChild(tr1, td2);

      let td1 = this.renderer.createElement('td');
      td1.innerHTML = this.jobs[i].company;
      this.renderer.appendChild(tr1,td1);

      let td3 = this.renderer.createElement('td');
      td3.innerHTML = this.jobs[i].jobType;
      this.renderer.appendChild(tr1,td3);

      let td4 = this.renderer.createElement('td');
      td4.innerHTML = this.jobs[i].jobSalary;
      this.renderer.appendChild(tr1,td4);

      let td5 = this.renderer.createElement('td');
      td5.innerHTML = this.jobs[i].jobLocation;
      this.renderer.appendChild(tr1,td5);

      let td6 = this.renderer.createElement('td');
      td6.innerHTML = this.jobs[i].jobDescription;
      this.renderer.appendChild(tr1,td6);

      let td7 = this.renderer.createElement('td');
      td7.innerHTML = this.jobs[i].jobVacancy;
      this.renderer.appendChild(tr1,td7);



      this.renderer.appendChild(this.table?.nativeElement,tr1);
    }
  }

  async deleteEmployer(){

    this.http.delete(`http://localhost:8080/deleteUserByRoleId/${this.roleId}`).subscribe(
      async response => {
        console.log('Response from backend:', response);

        emailjs.init('4rF1y6IRYUNj2kI-3');
        let body = `Hello Employer
          \n
          We are very sorry to inform you , that the Admin has deleted your Account.
          \n
          Best wishes,
          \nJobSeekho team`;

        try {
          let response = await emailjs.send( "service_ga6bnio","template_cqgom6d" , {
            from_name: "JobSeekho",
            body : body,
            reply_to : this.userMail
          });

          console.log("Email sent:", response);
          alert("Email sent");
        } catch (error) {
          console.error("Email sending failed:", error);
          alert("Failed to send email. Please try again.");
        }

        this.router.navigateByUrl('/employers-list');
      },
      error => {
        console.error('Error sending data to backend:', error);
        // Handle error as needed
      }
    );
  }

  editEmployer() {
    this.showModal = !this.showModal;    
  }

  async edit(){
    let user = {
      userName : this.userName,
      userEmail:this.userMail,
      password:this.password,

      nationality : this.nationality1?.nativeElement.value,
      phoneNo:this.phoneNo1?.nativeElement.value,
      role:{
        roleId:this.roleId,
        roleTitle:'employer',
        roleDesc:'emp'
      }
    }

    let employer = {
      company:this.company1?.nativeElement.value,
      companyAddress:this.companyAddress1?.nativeElement.value,
      sector:this.sector1?.nativeElement.value,
      companySize:this.companySize1?.nativeElement.value,
      address:this.address1?.nativeElement.value,
      role:{
        roleId:this.roleId,
        roleTitle:'employer',
        roleDesc:'emp'
      }
    }


    this.http.post<any>("http://localhost:8080/updateUserByRoleId" , user).subscribe(
      response => {
        console.log('Response from backend:', response);
        
        this.http.post<any>("http://localhost:8080/updateEmployerByRoleId" , employer).subscribe(
          async response => {
            console.log('Response from backend:', response);

            emailjs.init('4rF1y6IRYUNj2kI-3');
            let body = `Hello User
              \n
              Admin has updated your information.
              \n
              Your Info : 
              \nuserName : ${this.userName},
              \nuserEmail:${this.userMail},
              \npassword:${this.password},

              \nnationality : ${this.nationality1?.nativeElement.value},
              \nphoneNo:${this.phoneNo1?.nativeElement.value},
              
              \ncompany:${this.company1?.nativeElement.value},
              \ncompanyAddress:${this.companyAddress1?.nativeElement.value},
              \nsector:${this.sector1?.nativeElement.value},
              \ncompanySize:${this.companySize1?.nativeElement.value},
              \naddress:${this.address1?.nativeElement.value},
              \n
              Best wishes,
              \nJobSeekho team`;

            try {
              let response = await emailjs.send( "service_ga6bnio","template_cqgom6d" , {
                from_name: "JobSeekho",
                body : body,
                reply_to : this.userMail
              });

              console.log("Email sent:", response);
              alert("Email sent");
            } catch (error) {
              console.error("Email sending failed:", error);
              alert("Failed to send email. Please try again.");
            }

            this.router.navigateByUrl('/employers-list');
          },
          error => {
            console.error('Error sending data to backend:', error);
            // Handle error as needed
          }
        );
      },
      error => {
        console.error('Error sending data to backend:', error);
        // Handle error as needed
      }
    );
    
  }

}
