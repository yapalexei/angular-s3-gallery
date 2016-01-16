'use strict';

describe('Service: imageList', function () {

  // load the service's module
  beforeEach(module('s3XmlParseApp'));

  // instantiate service
  var imageList;
  beforeEach(inject(function (_imageList_) {
    imageList = _imageList_;
  }));

  it('should do something', function () {
    expect(!!imageList).toBe(true);
  });

});
