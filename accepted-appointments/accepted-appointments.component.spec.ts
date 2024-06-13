import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedAppointmentsComponent } from './accepted-appointments.component';

describe('AcceptedAppointmentsComponent', () => {
  let component: AcceptedAppointmentsComponent;
  let fixture: ComponentFixture<AcceptedAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptedAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptedAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
