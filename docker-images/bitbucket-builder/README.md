# Bitbucket Build image

The Bitbucket default environment uses images with old (stable) versions of software, as their
best practices suggest, it is better to find (create) a more specific image and not rely on
their default image.

This build image will start by loading:

- Node LTS (14.17.3)
- AWS CLI, including ECS
