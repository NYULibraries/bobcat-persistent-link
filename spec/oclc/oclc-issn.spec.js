const { BASE_SEARCH_URL, INSTITUTIONS, ADVANCED_MODE,
        BASE_API_URL, MOCK_API_KEY } = require("../helpers/constants");
const { oclc } = require("../helpers/constants").lambdas;
const worldCatISSN = require('../helpers/worldcat-issn.fixture.js');
const nock = require('nock');

describe('when ISSN found', () => {
  const issn = worldCatISSN.issn;
  const oclcId = worldCatISSN.oclc;
  const institution = "nyu";

  let issnRecRequest;
  beforeEach(() => {
    issnRecRequest =
      nock(BASE_API_URL)
        .get(`/${worldCatISSN.oclc}`)
        .query(true)
        .reply(200, worldCatISSN.xml);
  });

  it("should use the record's first ISSN", (done) => {
    return oclc.event({
      "queryStringParameters": {
        oclc: oclcId,
        institution
      }
    })
    .expectResult(result => {
      expect(issnRecRequest.isDone()).toBe(true);
      expect(result.statusCode).toEqual(302);
      expect(result.headers.Location).toEqual(`${BASE_SEARCH_URL}query=isbn,contains,${issn}&${ADVANCED_MODE}&vid=${institution.toUpperCase()}`);
    })
    .verify(done);
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
