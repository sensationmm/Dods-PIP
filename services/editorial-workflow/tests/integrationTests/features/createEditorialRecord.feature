Feature: Create Editorial Record
  createEditorialRecord function accepts a JSON input and creates a record in DynnamoDB

  Scenario: Verify editorial record is stored in DynamoDB
    Given there is an api gateway endpoint "editorial-record"
    And I create a HTTP "POST" request
    And the request has the body '{"document_name": "Test Doc", "s3_location": "ARN to doc", "test_doc": "true"}'
    And the request headers '{"Content-Type": "application/json"}'
    When I send the request
    Then I should receive a 200 status code
    And I should receive an Editorial Record response
    And the record should be saved to DynamoDB

  Scenario: Verify function creates an ID for the record
    Given there is an api gateway endpoint "editorial-record"
    And I create a HTTP "POST" request
    And the request has the body '{"document_name": "Test Doc", "s3_location": "ARN to doc", "test_doc": "true"}'
    And the request headers '{"Content-Type": "application/json"}'
    When I send the request
    Then I should receive a 200 status code
    And I should receive an Editorial Record response
    And the Editorial Record should have an ID

  Scenario: Verify function fails on invalid input
    Given there is an api gateway endpoint "editorial-record"
    And I create a HTTP "POST" request
    And the request has the body '{"s3_location": "ARN to doc", "test_doc": "true"}'
    And the request headers '{"Content-Type": "application/json"}'
    When I send the request
    Then I should receive a 400 status code
    And I should receive a message with the error
