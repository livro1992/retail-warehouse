import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageDashboard } from './main-page-dashboard';

describe('MainPageDashboard', () => {
  let component: MainPageDashboard;
  let fixture: ComponentFixture<MainPageDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
