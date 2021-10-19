Feature: User Profile 
  This is an integration test example
  Function is returning "Hello {name}" where "name" parameter is provided through HTTP request params

  Scenario: Verify happy flow of user function
    Given lambda function name is "user"
    When I send HTTP "GET" request
    Then I should receive "user"
