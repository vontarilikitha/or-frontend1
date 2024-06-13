import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateProfileComponent } from './graduate-profile.component';

describe('GraduateProfileComponent', () => {
  let component: GraduateProfileComponent;
  let fixture: ComponentFixture<GraduateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraduateProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraduateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
