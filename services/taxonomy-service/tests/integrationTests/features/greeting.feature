Feature: Say Hello
  This is an integration test example
  Function is returning "Hello {name}" where "name" parameter is provided through HTTP request params

  Scenario: Verify happy flow of health function
    Given lambda function name is "health"
    When I send HTTP "GET" request
    Then I should receive "healthy"

  Scenario: Verify happy flow of sayHello function
    Given lambda function name is "sayHello" and i set language as "English"
    When I send HTTP "GET" request
    Then I should receive "Hello Mr Kenan Hancer"

  Scenario: Verify Unhappy flow of sayHello function
    Given lambda function name is "sayHello" and i set language as "Greece"
    When I send HTTP "GET" request
    Then I should receive error - "BAD_REQUEST"
