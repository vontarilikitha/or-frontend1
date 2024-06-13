import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { EmployersDetailsService } from '../Services/employers-details.service';
import { DataService } from '../Services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.css'
})
export class JobsListComponent {

  jobs:any = {};
  @ViewChild('table', { static: true }) table!: ElementRef;
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
  
  constructor(private employerDetailsService:EmployersDetailsService,private renderer:Renderer2,private dataService:DataService,private router:Router){}

  async ngOnInit() {
    try {
      this.jobs  = await  this.employerDetailsService.getAllJobs();
      this.generateTable();
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  }

  generateTable(){

    this.userName = this.employerDetailsService.employerData.userName;
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
      this.renderer.appendChild(this.table.nativeElement,tr1);
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

      let td4 = this.renderer.createElement('td');
      td4.innerHTML = this.jobs[i].jobSalary;
      this.renderer.appendChild(tr1,td4);

      let td6 = this.renderer.createElement('td');
      td6.innerHTML = this.jobs[i].jobDescription;
      this.renderer.appendChild(tr1,td6);




      this.renderer.appendChild(this.table.nativeElement,tr1);
    }
  }

}
