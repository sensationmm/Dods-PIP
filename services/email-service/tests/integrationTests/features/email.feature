Feature: Email
  Check that the email lambda can be used to send emails through a third-party service

  Scenario: Send email to one or more recipients successfully
    Given a lambda function named "email"
    And I provide the following information for the request payload
      | to       | blue@somoglobal.com, green@somoglobal.com |
      | from     | no-reply@somoglobal.com                   |
      | subject  | test from SendGrid API                    |
      | mimeType | text/html                                 |
      | content  | <h1>This is the way</h1>                  |
    When I send the HTTP "POST" request
    Then I should receive a 200 status code
    And I should receive an "email sent" message
    And I should receive a "true" success status


  Scenario: Send email to one or more recipients with a invalid 'mimeType' input
    Given a lambda function named "email"
    And I provide the following information for the request payload
      | to       | blue@somoglobal.com, green@somoglobal.com |
      | from     | no-reply@somoglobal.com                   |
      | subject  | test from SendGrid API                    |
      | mimeType | text/html/test                            |
      | content  | <h1>This is the way</h1>                  |
    When I send the HTTP "POST" request
    Then I should receive a 400 status error code
    And I should receive an "request.body.mimeType should be equal to one of the allowed values: application/json, application/xml, application/x-www-form-urlencoded, multipart/form-data, text/plain, text/html, application/pdf, image/png" message
    And I should receive a "false" success status

  Scenario: Send email to one or more recipients with a invalid 'from' input
    Given a lambda function named "email"
    And I provide the following information for the request payload
      | to       | blue@somoglobal.com      |
      | from     | no-reply                 |
      | subject  | test from SendGrid API   |
      | mimeType | text/html                |
      | content  | <h1>This is the way</h1> |
    When I send the HTTP "POST" request
    Then I should receive a 400 status error code
    And I should receive an "request.body.from should match format \"email\"" message
    And I should receive a "false" success status
