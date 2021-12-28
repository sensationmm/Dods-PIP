# Frontend dist folder

CI process will build images and use Bitbucket "artifacts" feature to save the generated image to
this folder, images are never actually pushed into the repository.

Separate processes for each environment will take the artifact and push the image to the respective
ECR before updating the image on the Fargate cluster.
