import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormControlFeedbackComponent } from '@intershop-pwa/checkout/payment/payment-method-base/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from '@intershop-pwa/checkout/payment/payment-method-base/directives/show-form-feedback.directive';
import { PaymentSaveCheckboxComponent } from '@intershop-pwa/checkout/payment/payment-method-base/formly/payment-save-checkbox/payment-save-checkbox.component';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { PaymentCybersourceCreditcardComponent } from './payment-cybersource-creditcard.component';

describe('Payment Cybersource Creditcard Component', () => {
  let component: PaymentCybersourceCreditcardComponent;
  let fixture: ComponentFixture<PaymentCybersourceCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(FormControlFeedbackComponent),
        MockComponent(NgbPopover),
        MockComponent(PaymentSaveCheckboxComponent),
        MockDirective(ShowFormFeedbackDirective),
        PaymentCybersourceCreditcardComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCybersourceCreditcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentMethod = {
      id: 'CyberSource_CreditCard',
      saveAllowed: false,
    } as PaymentMethod;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit cancel event when cancelNewPaymentInstrument is triggered', () => {
    fixture.detectChanges();

    const emitter = spy(component.cancelPayment);

    component.cancelNewPaymentInstrument();
    verify(emitter.emit()).once();
  });

  it('should emit submit event if submit call back returns with no error and parameter form is valid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submitPayment);

    const payloadjson = {
      data: { number: '4111 1111 1111 1111', type: '001', expirationMonth: '11', expirationYear: '2022' },
      iss: 'test',
      exp: '123423',
      iat: 'test',
      jti: 'test',
    };
    const payload = window.btoa(JSON.stringify(payloadjson));

    component.cyberSourceCreditCardForm.controls.expirationMonth.setValue('11');
    component.cyberSourceCreditCardForm.controls.expirationYear.setValue('2022');
    component.expirationMonthVal = '11';
    component.expirationYearVal = '2022';
    component.submitCallback(undefined, 'header.' + `${payload}` + '.signature');

    verify(emitter.emit(anything())).once();
  });

  it('should not emit submit event if submit call back returns with no error and parameter form is invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submitPayment);

    const payloadjson = {
      data: { number: '4111 1111 1111 1111', type: '001', expirationMonth: '11', expirationYear: '2022' },
      iss: 'test',
      exp: '123423',
      iat: 'test',
      jti: 'test',
    };
    const payload = window.btoa(JSON.stringify(payloadjson));

    component.expirationMonthVal = '11';
    component.expirationYearVal = '2022';
    component.submitCallback(undefined, 'header.' + `${payload}` + '.signature');

    verify(emitter.emit(anything())).never();
  });

  it('should show an error if submit call back returns with an error', () => {
    fixture.detectChanges();
    component.submitCallback({ details: [{ location: 'number', message: 'error in card number' }] }, undefined);

    expect(component.errorMessage.number.message).toEqual('checkout.credit_card.number.error.invalid');
  });
});
