Feature: Listing Taxonomies
  This is an integration test example
  Function is returning "Hello World" where "name" parameter is provided through HTTP request params

  Scenario: Verify happy flow of health function
    Given lambda function name is "health"
    When I send HTTP "GET" request
    Then I should receive "healthy"

  Scenario: Verify happy flow of taxonomies function
    Given lambda function name is "getTaxonomies"
    When I send HTTP "GET" request
    Then I should receive "Hello World"