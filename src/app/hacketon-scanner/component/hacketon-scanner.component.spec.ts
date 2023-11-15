import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HacketonScannerComponent } from './hacketon-scanner.component';

describe('Hacketon Scanner Component', () => {
  let component: HacketonScannerComponent;
  let fixture: ComponentFixture<HacketonScannerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HacketonScannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HacketonScannerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
