import { mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

describe('Newsletter Service', () => {
  // let newsletterService: NewsletterService;
  let apiService: ApiService;

  beforeEach(() => {
    apiService = mock(ApiService);
    // newsletterService = new NewsletterService(instance(apiService));
  });

  it("should subscribe user to newsletter when 'subscribeToNewsletter' is called", done => {
    /*when(apiService.get(`subscriptions`, anything())).thenReturn(of(true));

    countryService.getCountries().subscribe(() => {
      verify(apiService.get(`subscriptions`, anything())).once();
      done();
    });*/
  });

  it("should get subscription status when 'getNewsletterSubscription' is called", done => {
    /*when(apiService.get(`countries/countryCode/main-divisions`, anything())).thenReturn(of(regionData));

    countryService.getRegionsByCountry('countryCode').subscribe(regions => {
      verify(apiService.get(`countries/countryCode/main-divisions`, anything())).once();
      expect(regions).toHaveLength(1);
      expect(regions[0]).toHaveProperty('id', 'countryCode_regionID');
      done();
    });*/
  });
});
