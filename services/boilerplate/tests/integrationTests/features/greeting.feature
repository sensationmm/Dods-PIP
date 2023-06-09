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

  Scenario: Verify happy flow of sayHello function
    Given lambda function name is "sayHello" and i set language as "Turkish"
    When I send HTTP "GET" request
    Then I should receive "Merhaba Mr Kenan Hancer"

  Scenario: Verify Unhappy flow of sayHello function
    Given lambda function name is "sayHello" and i set language as "Greece"
    When I send HTTP "GET" request
    Then I should receive error - "BAD_REQUEST"

  Scenario: Verify happy flow of sayEnglishHello function
    Given lambda function name is "sayEnglishHello"
    When I send HTTP "GET" request
    Then I should receive "Hello Mr Kenan Hancer"

  Scenario: Verify happy flow of sayTurkishHello function
    Given lambda function name is "sayTurkishHello"
    When I send HTTP "GET" request
    Then I should receive "Merhaba Mr Kenan Hancer"

  Scenario: Verify happy flow of getFullName function
    Given lambda function name is "getFullName"
    When I send HTTP "GET" request
    Then I should receive "Mr Kenan Hancer"