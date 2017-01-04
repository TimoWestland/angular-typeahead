import { AngularTypeaheadPage } from './app.po';

describe('angular-typeahead App', function() {
  let page: AngularTypeaheadPage;

  beforeEach(() => {
    page = new AngularTypeaheadPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
