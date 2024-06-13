import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../Services/data.service';
import emailjs from '@emailjs/browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Router, Routes } from '@angular/router';
import { error } from 'node:console';
import { Appointment } from '../modal/appointment';
import { Role } from '../modal/role';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.css'
})
export class JobApplicationComponent implements OnInit{
  constructor(private dataService:DataService,private http:HttpClient,private router:Router){}

  
  @ViewChild('fullName') fullName: ElementRef | undefined;
  @ViewChild('email') email: ElementRef | undefined;
  @ViewChild('collegeName') collegelName: ElementRef | undefined;
  @ViewChild('collegeAddress') collegeAddress: ElementRef | undefined;
  @ViewChild('yearOfPassing') yearOfPassing: ElementRef | undefined;
  @ViewChild('percentage') percentage: ElementRef | undefined;
  @ViewChild('skills') skills: ElementRef | undefined;
  @ViewChild('project') project: ElementRef | undefined;
  @ViewChild('resume') resume: ElementRef | undefined;


  response : any = {};
  jobName:string = "";
  companyName:string = "";
  jobLocation:string = "";
  salary:string = "";
  jobDescription:string = "";
  noOfOpenings:string = "";

  employerName = "";
  employerMail = "";
  resume2: File | undefined;

  
  appointment :Appointment = new Appointment();
  rolea : Role = new Role();
  
  ngOnInit(){
    console.log(this.dataService.jobData);
    this.jobName = this.dataService.jobData.jobName;
    this.companyName = this.dataService.jobData.company;
    this.jobLocation = this.dataService.jobData.jobLocation;
    this.salary = this.dataService.jobData.jobSalary;
    this.jobDescription = this.dataService.jobData.jobDescription;
    this.noOfOpenings = this.dataService.jobData.jobVacancy;

  }

  async mailToEmployer(){
    emailjs.init('ZjgINeSOg_Y80O0ZB');
    const formData = new FormData();
    formData.append('file', this.resume?.nativeElement.files[0]);
    console.log(this.employerMail);
    try {
      let response = await emailjs.send("service_asbq6km","template_ul8wdt5"      , {
        from_name: "JobSeekho",

        employer : this.employerName,
        job : this.dataService.jobData.jobName,
        jobName : this.dataService.jobData.jobName,
        company : this.dataService.jobData.company,
        jobSalary:this.dataService.jobData.jobSalary,
        jobLocation : this.dataService.jobData.jobLocation,
        jobDescription : this.dataService.jobData.jobDescription,
        jobVacancy : this.dataService.jobData.jobVacancy,

        userName : this.dataService.userData.userName,
        userEmail : this.email?.nativeElement.value,
        collegeName : this.collegelName?.nativeElement.value,
        collegeAddress : this.collegeAddress?.nativeElement.value,
        yearOfPassing : this.yearOfPassing?.nativeElement.value,
        percentage : this.percentage?.nativeElement.value,
        skills : this.skills?.nativeElement.value,
        project : this.project?.nativeElement.value,
        phoneNo : this.dataService.userData.phoneNo,
        resume : formData,

        reply_to : this.employerMail
      });

      console.log("Email sent:", response);
      alert("Email sent");
    } catch (error) {
      console.error("Email sending failed:", error);
      alert("Failed to send email. Please try again.");
    }
  }

  async sendMailToEmployer(){

    
    let response:any;
    let a = await this.http.get(`http://localhost:8080/getUserByRoleId/${this.dataService.jobData.roles.roleId}`).subscribe(
      (data) => {
        console.log(1);
        console.log(data);
        response = data;
        this.employerName = response.userName;
        this.employerMail = response.userEmail;

        //this.mailToEmployer();
        //this.sendMailToGraduate();
        this.addAppointments();

        this.router.navigateByUrl("/jobs");

      },
      (error) => {
        console.log(error);
      }
    );

  }

  async sendMailToGraduate(){
    emailjs.init('ZjgINeSOg_Y80O0ZB');
    console.log(this.dataService.userData.userEmail);
    try {
      let response = await emailjs.send("service_asbq6km","template_q1gsv3w" , {
        from_name: "JobSeekho",
        userName : this.dataService.userData.userName,
        jobName : this.dataService.jobData.jobName,
        companyName : this.dataService.jobData.company,

        reply_to : this.dataService.userData.userEmail
      });

      console.log("Email sent:", response);
      alert("Email sent");
    } catch (error) {
      console.error("Email sending failed:", error);
      alert("Failed to send email. Please try again.");
    }
  }

  onFileSelected(event: any){
    console.log('hello');
    if(event.target.files && event.target.files.length > 0) {
      // Fill file variable with the file content
      this.resume2 = event.target.files[0];
      console.log(this.resume2);
    }
    else{
      console.log('file not selected');
    }
  }

  addAppointments(){
    
    console.log(this.dataService.jobData.jobId);

    this.rolea = {
      roleId: this.dataService.userData.role.roleId,
      roleTitle: 'graduate',
      roleDesc: 'grd'
    }

    this.appointment = {
      jobId: this.dataService.jobData.jobId,
      fullName: this.dataService.userData.userName,
      email: this.email?.nativeElement.value,
      phoneNo: this.dataService.userData.phoneNo,
      college: this.collegelName?.nativeElement.value,
      collegeAddress: this.collegeAddress?.nativeElement.value,
      yearOfPassing: this.yearOfPassing?.nativeElement.value,
      percentage: this.percentage?.nativeElement.value,
      skills: this.skills?.nativeElement.value,
      project: this.project?.nativeElement.value,
      employerId : this.dataService.jobData.roles.roleId,
      status : "pending",
      resume:null,
      rolea: this.rolea
    }
    
    this.http.post<any>("http://localhost:8080/addAppointment" , this.appointment ).subscribe(
      response => {
        console.log(response);
        console.log('Response from backend:', response);
        this.response = response;

        let body = new FormData();
        if (this.resume2 !== undefined) {
          body.append("file", this.resume2);
        }
        

        this.http.post<any>(`http://localhost:8080/updateAppointment/${this.response.id}` , 
          body
        ).subscribe(
          async response => {
            console.log('Response from backend',response);
            console.log(this.dataService.jobData.roles.roleId);
            


          },
          error => {
            console.error('Error sending file to backend',error);
          }
        )
      },
      error => {
        console.error('Error sending data to backend:', error);
        // Handle error as needed
      }
    );
    
  }

}
