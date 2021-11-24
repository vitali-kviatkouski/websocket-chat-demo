import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalMsgsComponent } from './personal-msgs.component';

describe('PersonalMsgsComponent', () => {
  let component: PersonalMsgsComponent;
  let fixture: ComponentFixture<PersonalMsgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalMsgsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalMsgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
