import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsPurchaseComponent } from './products-purchase.component';

describe('ProductsPurchaseComponent', () => {
  let component: ProductsPurchaseComponent;
  let fixture: ComponentFixture<ProductsPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
