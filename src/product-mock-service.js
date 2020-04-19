const mbHelper = require('./mock-injector');
const settings = require('./settings');

function injectMock() {
    const stubs = [
        {
            predicates: [{
                and: [
                    { equals: { method: "GET" } },
                    { startsWith: { "path": "/customers/" } }
                ]
            }],
            responses: [
                {
                    is: {
                        statusCode: 200,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: '{ "firstName": "${row}[first_name]", "lastName": "${row}[last_name]", "email": "${row}[email]" }'
                    },
                    _behaviors: {
                        lookup: [
                            {
                                "key": {
                                  "from": "path",
                                  "using": { "method": "regex", "selector": "/customers/(.*)$" },
                                  "index": 1
                                },
                                "fromDataSource": {
                                  "csv": {
                                    "path": "test-data/customer.csv",
                                    "keyColumn": "id"
                                  }
                                },
                                "into": "${row}"
                              }
                        ]
                    }
                }
            ]
        }
    ];

    const imposter = {
        port: settings.product_mock_port,
        protocol: 'http',
        stubs: stubs
    };

    return mbHelper.postImposter(imposter);
}

module.exports = { injectMock };