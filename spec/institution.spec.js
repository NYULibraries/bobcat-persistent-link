const { LAMBDA, BASE_SEARCH_URL, INSTITUTIONS } = require("./helpers/constants");

describe('persistent', () => {
  describe("null query", () => {
    it('should redirect to NYU search', (done) => {
      return LAMBDA.event({
        "queryStringParameters": null
      })
      .expectResult(result => {
        expect(result.statusCode).toEqual(302);
        expect(result.headers.Location).toEqual(`${BASE_SEARCH_URL}&vid=NYU`);
      })
      .verify(done);
    });
  });

  describe('institution view', () => {
    INSTITUTIONS.forEach((institution) => {
      it(`should redirect to ${institution} search`, (done) => {
        return LAMBDA.event({
          "queryStringParameters": {
            institution
          }
        })
        .expectResult(result => {
          expect(result.statusCode).toEqual(302);
          expect(result.headers.Location).toEqual(`${BASE_SEARCH_URL}&vid=${institution}`);
        })
        .verify(done);
      });
    });

    it('should redirect to NYU search if institution invalid', (done) => {
      return LAMBDA.event({
        "queryStringParameters": {
          institution: "banana"
        }
      })
      .expectResult(result => {
        expect(result.statusCode).toEqual(302);
        expect(result.headers.Location).toEqual(`${BASE_SEARCH_URL}&vid=NYU`);
      })
      .verify(done);
    });
  }); // end institution view
});
