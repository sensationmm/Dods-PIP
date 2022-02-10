## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | ~> 1.0.8 |
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.8 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | 3.62.0 |
| <a name="requirement_random"></a> [random](#requirement\_random) | 3.1.0 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dev"></a> [dev](#module\_dev) | ./environments/deployment | n/a |
| <a name="module_dev-premodule"></a> [dev-premodule](#module\_dev-premodule) | ./premodule | n/a |
| <a name="module_prod-premodule"></a> [prod-premodule](#module\_prod-premodule) | ./premodule | n/a |
| <a name="module_production"></a> [production](#module\_production) | ./environments/deployment | n/a |
| <a name="module_qa"></a> [qa](#module\_qa) | ./environments/deployment | n/a |
| <a name="module_qa-premodule"></a> [qa-premodule](#module\_qa-premodule) | ./premodule | n/a |
| <a name="module_test"></a> [test](#module\_test) | ./environments/deployment | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_db_password"></a> [db\_password](#input\_db\_password) | rds database password | `string` | n/a | yes |

## Outputs

| Name | Description | Value | Sensitive |
|------|-------------|-------|:---------:|
| <a name="output_dev_backend_url"></a> [dev\_backend\_url](#output\_dev\_backend\_url) | 'Dev' Environment Base URL Backend | `"https://hxyqgu6qy7.execute-api.eu-west-1.amazonaws.com/dev"` | no |
| <a name="output_dev_db_address"></a> [dev\_db\_address](#output\_dev\_db\_address) | 'Dev' Environment DB address | `"pip-dev-clients-rds.cjsy5u6jeoud.eu-west-1.rds.amazonaws.com"` | no |
| <a name="output_dev_db_bastion"></a> [dev\_db\_bastion](#output\_dev\_db\_bastion) | 'Dev' Environment DB bastion host | `"ssh -i ~/.ssh/dods-bastion-key.pem admin@3.249.96.90"` | no |
| <a name="output_dev_frontend_url"></a> [dev\_frontend\_url](#output\_dev\_frontend\_url) | 'Dev' Environment URL Frontend | `"http://pip-dev-fargate-lb-1826645209.eu-west-1.elb.amazonaws.com"` | no |
| <a name="output_prod_backend_url"></a> [prod\_backend\_url](#output\_prod\_backend\_url) | 'Prod' Environment Base URL Backend | `"https://ptj39c1w19.execute-api.eu-west-1.amazonaws.com/production"` | no |
| <a name="output_prod_db_address"></a> [prod\_db\_address](#output\_prod\_db\_address) | 'Prod' Environment DB address | `"pip-production-clients-rds.cftk9xwprk29.eu-west-1.rds.amazonaws.com"` | no |
| <a name="output_prod_db_bastion"></a> [prod\_db\_bastion](#output\_prod\_db\_bastion) | 'Prod' Environment DB bastion host | `"ssh -i ~/.ssh/dods-bastion-key.pem admin@54.216.44.114"` | no |
| <a name="output_prod_frontend_url"></a> [prod\_frontend\_url](#output\_prod\_frontend\_url) | 'Prod' Environment URL Frontend | `"http://pip-production-fargate-lb-1219860305.eu-west-1.elb.amazonaws.com"` | no |
| <a name="output_qa_backend_url"></a> [qa\_backend\_url](#output\_qa\_backend\_url) | 'qa' Environment Base URL Backend | `"https://fz02gxbz09.execute-api.eu-west-1.amazonaws.com/qa"` | no |
| <a name="output_qa_db_address"></a> [qa\_db\_address](#output\_qa\_db\_address) | 'qa' Environment DB address | `"pip-qa-clients-rds.cedmoibgghrd.eu-west-1.rds.amazonaws.com"` | no |
| <a name="output_qa_db_bastion"></a> [qa\_db\_bastion](#output\_qa\_db\_bastion) | 'qa' Environment DB bastion host | `"ssh -i ~/.ssh/dods-bastion-key.pem admin@52.19.139.227"` | no |
| <a name="output_qa_frontend_url"></a> [qa\_frontend\_url](#output\_qa\_frontend\_url) | 'qa' Environment URL Frontend | `"http://pip-qa-fargate-lb-2136712671.eu-west-1.elb.amazonaws.com"` | no |
| <a name="output_test_backend_url"></a> [test\_backend\_url](#output\_test\_backend\_url) | 'test' Environment Base URL Backend | `"https://nbv1vb4ao9.execute-api.eu-west-1.amazonaws.com/test"` | no |
| <a name="output_test_db_address"></a> [test\_db\_address](#output\_test\_db\_address) | 'test' Environment DB address | `"pip-test-clients-rds.c3ydj4ksayxh.eu-west-1.rds.amazonaws.com"` | no |
| <a name="output_test_db_bastion"></a> [test\_db\_bastion](#output\_test\_db\_bastion) | 'test' Environment DB bastion host | `"ssh -i ~/.ssh/dods-bastion-key.pem admin@52.50.114.158"` | no |
| <a name="output_test_frontend_url"></a> [test\_frontend\_url](#output\_test\_frontend\_url) | 'test' Environment URL Frontend | `"http://pip-test-fargate-lb-1817426860.eu-west-1.elb.amazonaws.com"` | no |
