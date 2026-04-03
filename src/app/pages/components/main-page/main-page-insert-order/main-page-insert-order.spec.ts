import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageInsertOrder } from './main-page-insert-order';

describe('MainPageInsertOrder', () => {
  let component: MainPageInsertOrder;
  let fixture: ComponentFixture<MainPageInsertOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageInsertOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageInsertOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
