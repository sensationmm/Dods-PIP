Feature: Searching Taxonomies
  Test that the taxonomy lambda can be used to search the taxonomy data when given a term

  Scenario: Verify taxonomies function runs successfully
    Given there is a lambda "taxonomies"
    And I create a HTTP "GET" request
    And I have the URL parameter "tags" with the value "winter"
    When I send the request
    Then I should receive a 200 status code

  Scenario:
    Given there is a lambda "taxonomies"
    And I create a HTTP "GET" request
    And I have the URL parameter "tags" with the value "winter"
    When I send the request
    Then I should receive a 200 status code
    And I receive multiple taxonomies

  Scenario:
    Given there is a lambda "taxonomies"
    And I create a HTTP "GET" request
    And I have the URL parameter "tags" with the value "winter"
    And I have the URL parameter "limit" with the value "1"
    When I send the request
    Then I should receive a 200 status code
    And I receive a single taxonomy