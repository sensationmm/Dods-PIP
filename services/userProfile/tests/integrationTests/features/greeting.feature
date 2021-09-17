Feature: User Profile 
  This is an integration test example
  Function is returning "Hello {name}" where "name" parameter is provided through HTTP request params

  Scenario: Verify happy flow of user function
    Given lambda function name is "user"
    When I send HTTP "GET" request
    Then I should receive "user"

  Scenario: Verify happy flow of userByName function
    Given lambda function name is "userByName"
    When I send HTTP "GET" request
    Then I should receive "userByName"

  Scenario: Verify happy flow of role function
    Given lambda function name is "role"
    When I send HTTP "GET" request
    Then I should receive "role"

