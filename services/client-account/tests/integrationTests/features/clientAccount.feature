Feature: Client Account
  This is an integration for Client Account
  Function is returning "Hello {name}" where "name" parameter is provided through HTTP request params

  Scenario: Verify happy flow of health function
    Given lambda function name is "health"
    When I send HTTP "GET" request
    Then I should receive "healthy"
