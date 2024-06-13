import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router';
import { Job } from '../modal/job';
import { Role } from '../modal/role';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.css'
})
export class AddJobComponent {

  constructor(private http:HttpClient,private router:Router){}

  isAgree:boolean = false;

  jobData : Job = new Job();
  roles : Role = new Role();
  
  @ViewChild('roleId') roleId: ElementRef | undefined;
  @ViewChild('jobName') jobName: ElementRef | undefined;
  @ViewChild('jobType') jobType:ElementRef | undefined;
  @ViewChild('jobDescription') jobDescription:ElementRef | undefined;
  @ViewChild('salary') salary: ElementRef | undefined;
  @ViewChild('companyName') companyName: ElementRef | undefined;
  @ViewChild('jobLocation') jobLocation: ElementRef | undefined;
  @ViewChild('jobVacancy') jobVacancy: ElementRef | undefined;


  storeJob(){
    
    this.roles = {
      roleId: this.roleId?.nativeElement.value,
      roleTitle:'employer',
      roleDesc:'emp'
    }

    this.jobData = {
      roles:this.roles,
      jobName: this.jobName?.nativeElement.value,
      jobType: this.jobType?.nativeElement.value,
      jobDescription: this.jobDescription?.nativeElement.value,
      jobSalary: this.salary?.nativeElement.value,
      company: this.companyName?.nativeElement.value,
      jobLocation: this.jobLocation?.nativeElement.value,
      jobVacancy: this.jobVacancy?.nativeElement.value,
    }

    console.log(this.jobData);

    this.http.post<any>("http://localhost:8080/addJob" , this.jobData).subscribe(
          response => {
            console.log('Response from backend:', response);
            this.router.navigateByUrl('/jobs');
            
            // Handle response as needed
          },
          error => {
            console.error('Error sending data to backend:', error);
            // Handle error as needed
          }
        );


  }


  agreeClicked(){
    this.isAgree = !this.isAgree;
  }
}
