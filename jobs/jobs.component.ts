import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2,OnInit, ViewChild } from '@angular/core';
import { Data, Router, RouterModule } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent  implements OnInit{
  constructor(private renderer: Renderer2, private el: ElementRef ,private http: HttpClient,private router:Router , private dataService:DataService) {}

  jobs:any  = {};
  filteredJobs:any = {};
  searchValue :any;
  locationValue = "Location";
  salaryValue = "Select salary";

  @ViewChild('jobscontainer') jobscontainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('sector') sector!: ElementRef;
  @ViewChild('salary') salary!: ElementRef;
  @ViewChild('location') location!: ElementRef;

  ngOnInit(){

    this.http.get("http://localhost:8080/getAllJobs").subscribe(
      (data) => {
        this.jobs = data;
        this.filteredJobs = data;
        this.generateJobComponents();
      },
      (error) => {
        console.log(error);
      }
    );     

  }

  generateJobComponents(){
    const length = Object.keys(this.filteredJobs).length;
    for(let i =0;i<length;i++){
      console.log(this.jobs[i]);
    }

    const tableElement = this.jobscontainer?.nativeElement;
    while (tableElement.firstChild) {
      this.renderer.removeChild(tableElement, tableElement.firstChild);
    }

    for(let i=0;i<length;i++){
      
      let jobName = this.filteredJobs[i].jobName;
      let jobSalary = this.filteredJobs[i].jobSalary+"k";
      let jobLocation = this.filteredJobs[i].jobLocation;
      let company = this.filteredJobs[i].company;

      let jobdiv = this.renderer.createElement('div');
      this.renderer.addClass(jobdiv,"job");

      // job-details1
      let jobd1div = this.renderer.createElement('div');
      this.renderer.addClass(jobd1div,"job-details1");
      
      let b1 = this.renderer.createElement('button');

      let hiring = this.renderer.createElement('div');
      this.renderer.addClass(hiring,"hiring-msg");

      hiring.innerHTML = "<i class='fa-solid fa-arrow-trend-up'></i>";
      let ah = hiring.querySelector('i');
      this.renderer.setStyle(ah, 'color', 'blue');
      this.renderer.setStyle(ah, 'padding-right', '10px');

      let p1 = this.renderer.createElement('p');
      p1.innerHTML = "Actively Hiring";

      this.renderer.appendChild(hiring,p1);
      this.renderer.appendChild(b1,hiring);

      
      let p2 = this.renderer.createElement('p');
      this.renderer.addClass(p2,"job-title");
      p2.innerHTML = jobName;

      let p3 = this.renderer.createElement('p');
      this.renderer.addClass(p3,"company-name");
      p3.innerHTML = company;

      this.renderer.appendChild(jobd1div,b1);
      this.renderer.appendChild(jobd1div,p2);
      this.renderer.appendChild(jobd1div,p3);

      this.renderer.appendChild(jobdiv,jobd1div);
      

      // job details2
      let jobd2div = this.renderer.createElement('div');
      this.renderer.addClass(jobd2div,"job-details2");
      
      let d1 = this.renderer.createElement('div');
      this.renderer.addClass(d1,"location");

      d1.innerHTML = "<i class='fa-solid fa-location-dot'></i>"
      let i2 = d1.querySelector('i');
      this.renderer.setStyle(i2, 'color', 'rgb(56, 56, 249)');
      this.renderer.setStyle(i2, 'margin-right', '10px');

      let p4 = this.renderer.createElement('p');
      p4.innerHTML = jobLocation;

      this.renderer.appendChild(d1,i2);
      this.renderer.appendChild(d1,p4);
      this.renderer.appendChild(jobd2div,d1);



      let d2 = this.renderer.createElement('div');
      this.renderer.addClass(d2,"location");

      d2.innerHTML = "<i class='fa-solid fa-money-bill'></i>"
      let i3 = d2.querySelector('i');
      this.renderer.setStyle(i3, 'color', 'rgb(56, 56, 249)');
      this.renderer.setStyle(i3, 'margin-right', '10px');

      let p5 = this.renderer.createElement('p');
      p5.innerHTML = jobSalary;

      this.renderer.appendChild(d2,i3);
      this.renderer.appendChild(d2,p5);
      this.renderer.appendChild(jobd2div,d2);


      
      let d3 = this.renderer.createElement('div');
      this.renderer.addClass(d3,"location");

      d3.innerHTML = "<i class='fa fa-calendar' aria-hidden='true'></i>"
      let i4 = d3.querySelector('i');
      this.renderer.setStyle(i4, 'color', 'rgb(56, 56, 249)');
      this.renderer.setStyle(i4, 'margin-right', '10px');

      let p6 = this.renderer.createElement('p');
      p6.innerHTML = "2 Years";

      this.renderer.appendChild(d3,i4);
      this.renderer.appendChild(d3,p6);
      this.renderer.appendChild(jobd2div,d3);
      // 
      this.renderer.appendChild(jobdiv,jobd2div);

      

      // job-footer
      let jobfooter = this.renderer.createElement('div');
      this.renderer.addClass(jobfooter, "job-footer");

      let b2 = this.renderer.createElement('button');
      b2.innerHTML = "Full Time";

      let anchor = this.renderer.createElement('a');
      anchor.innerHTML = "View detaills";

      this.renderer.setAttribute(anchor, "routerLink", "/job-application"); 
      this.renderer.setAttribute(anchor,"href" ,"#");

      this.renderer.listen(anchor, 'click', (event) => {
        event.preventDefault();

        if(this.dataService.userData.role.roleTitle == "employer"){
          alert("You can't Apply for a job");
        }
        else{
          console.log('Anchor clicked');
          this.dataService.jobData = this.filteredJobs[i];
          console.log(this.dataService.jobData);
          this.router.navigate(['/job-application']);
        }
         
      });
      
      
      this.renderer.appendChild(jobfooter, b2);
      this.renderer.appendChild(jobfooter, anchor);

      // Create and style the <i> element
      let i5 = this.renderer.createElement('i');
      this.renderer.addClass(i5, 'fa-solid');
      this.renderer.addClass(i5, 'fa-greater-than');
      this.renderer.setStyle(i5, 'color', 'rgb(56, 56, 249)');
      this.renderer.setStyle(i5, 'margin-right', '10px');

      // Append the <i> element to jobfooter
      this.renderer.appendChild(jobfooter, i5);

      this.renderer.appendChild(jobdiv,jobfooter);
      
      if (!this.jobscontainer) {
        console.log('jobscontainer is not initialized!');
        return;
      }
      else
        this.renderer.appendChild(this.jobscontainer.nativeElement,jobdiv);
      
    }
  }

  filterJobs() {
    console.log(this.location?.nativeElement.value);
    console.log(this.sector?.nativeElement.value);
    console.log(this.salary?.nativeElement.value);
    console.log(this.location?.nativeElement.value);
  
    this.filteredJobs = [];
    
    if(this.searchInput?.nativeElement.value != null){
      this.filteredJobs = [...this.filteredJobs, ...this.jobs.filter(
        (j: { jobName: string | any[]; company: string | any[]; }) => {
          return j.jobName.includes(this.searchInput?.nativeElement.value) || j.company.includes(this.searchInput?.nativeElement.value) ;
        }
      )];
    }
  
    
    if(this.salary?.nativeElement.value != "Select salary"){
      this.filteredJobs = [...this.filteredJobs, ...this.jobs.filter(
        (j: { jobSalary: string; }) => {
          const salaryValue = this.salary?.nativeElement.value;
          console.log(parseInt(j.jobSalary.replace(/,/g, '')));
          if (salaryValue == "< 50,000") {
            return parseInt(j.jobSalary.replace(/,/g, '')) <= 50000;
          }
          else if (salaryValue == "50,000 - 1,00,000") {
            return parseInt(j.jobSalary.replace(/,/g, '')) > 50000 && parseInt(j.jobSalary.replace(/,/g, '')) <= 100000;
          }
          else if (salaryValue == "1,00,000 - 2,00,000") {
            return parseInt(j.jobSalary.replace(/,/g, '')) > 100000 && parseInt(j.jobSalary.replace(/,/g, '')) <= 200000;
          }
          else if (salaryValue == "> 2,00,000") {
            return parseInt(j.jobSalary.replace(/,/g, '')) > 200000;
          }
          else
            return false;
        }
      )];
    }
  
    if(this.location?.nativeElement.value != "Location"){
      this.filteredJobs = [...this.filteredJobs, ...this.jobs.filter(
        (j: { jobName: string | any[]; sector: string | any[]; salary: string | any[]; jobLocation: string | any[]; }) => {
          return j.jobLocation.includes(this.location?.nativeElement.value);
        }
      )];
    }
  
    console.log(this.filteredJobs);
    this.filteredJobs = [...new Set(this.filteredJobs)];  
  
    this.generateJobComponents();
  }

  resetFilters(){
    this.searchValue = "";
    this.locationValue = "Location";
    this.salaryValue = "Select salary";
    this.filteredJobs = this.jobs;
    this.generateJobComponents();
  }

}
