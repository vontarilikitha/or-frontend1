import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatesListComponent } from './graduates-list.component';

describe('GraduatesListComponent', () => {
  let component: GraduatesListComponent;
  let fixture: ComponentFixture<GraduatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraduatesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraduatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
