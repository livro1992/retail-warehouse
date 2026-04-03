import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageReceiverOrder } from './main-page-receiver-order';

describe('MainPageReceiverOrder', () => {
  let component: MainPageReceiverOrder;
  let fixture: ComponentFixture<MainPageReceiverOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageReceiverOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageReceiverOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
