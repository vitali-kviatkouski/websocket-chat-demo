import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMsgsComponent } from './system-msgs.component';

describe('SystemMsgsComponent', () => {
  let component: SystemMsgsComponent;
  let fixture: ComponentFixture<SystemMsgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemMsgsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMsgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
