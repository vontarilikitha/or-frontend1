import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EmployersDetailsService } from '../Services/employers-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employers-list',
  templateUrl: './employers-list.component.html',
  styleUrls: ['./employers-list.component.css']
})
export class EmployersListComponent implements OnInit {

  employers: any[] = [];
  @ViewChild('table', { static: true }) table!: ElementRef;

  constructor(private renderer: Renderer2, private employerDetailsService: EmployersDetailsService,private router:Router) {}

  async ngOnInit() {
    try {
      this.employers = await this.employerDetailsService.getAllEmployers();
      this.generateTable();
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  }

  
  generateTable() {
    // Clear existing table rows
    const tableElement = this.table.nativeElement;
    while (tableElement.firstChild) {
      this.renderer.removeChild(tableElement, tableElement.firstChild);
    }

    for (let i = 0; i < this.employers.length; i++) {
      let tr = this.renderer.createElement('tr');

      let td1 = this.renderer.createElement('td');
      let anchor = this.renderer.createElement('a');
      anchor.innerHTML = this.employers[i].userName;
      
      
      
      this.renderer.setAttribute(anchor, "routerLink", "/employer-profile"); 
      this.renderer.setAttribute(anchor,"href" ,"#");
      this.renderer.listen(anchor, 'click', (event) => {
        event.preventDefault();

        console.log('Anchor clicked');
        this.employerDetailsService.employerData = this.employers[i];
        this.router.navigate(['/employer-profile']);
         
      });
      this.renderer.appendChild(td1,anchor);
      this.renderer.appendChild(tr, td1);



      let td2 = this.renderer.createElement('td');
      td2.innerHTML = this.employers[i].roleId;
      this.renderer.appendChild(tr, td2);

      let td3 = this.renderer.createElement('td');
      td3.innerHTML = this.employers[i].email;
      this.renderer.appendChild(tr, td3);

      let td4 = this.renderer.createElement('td');
      td4.innerHTML = this.employers[i].phoneNo;
      this.renderer.appendChild(tr, td4);


      let td7 = this.renderer.createElement('td');
      td7.innerHTML = this.employers[i].company;
      this.renderer.appendChild(tr, td7);


      this.renderer.appendChild(this.table.nativeElement, tr);
    }
  }
}
