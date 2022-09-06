import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';

import { CMSNavigationPageComponent } from './cms-navigation-page.component';

describe('Cms Navigation Page Component', () => {
  let component: CMSNavigationPageComponent;
  let fixture: ComponentFixture<CMSNavigationPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMSNavigationPageComponent],
      providers: [{ provide: CMSFacade, useFactory: () => instance(mock(CMSFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNavigationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
