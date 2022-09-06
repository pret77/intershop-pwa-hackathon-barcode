import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSNavigationLinkComponent } from './cms-navigation-link.component';

describe('Cms Navigation Link Component', () => {
  let component: CMSNavigationLinkComponent;
  let fixture: ComponentFixture<CMSNavigationLinkComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMSNavigationLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNavigationLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
