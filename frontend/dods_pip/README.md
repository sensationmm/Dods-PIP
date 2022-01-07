# Dods Political Intelligence Platform

This folder hosts the Frontend for the Dods PIP.

Continuous deployment of code is pushed to a Fargate cluster with an ALB publishing this [page](http://dods-publi-bb29eyratgfk-1522307155.eu-west-1.elb.amazonaws.com/).

##Setup

###Tech Stack
- [React](https://reactjs.org/)
- [NextJs](https://nextjs.org/docs/getting-started)
- [Jest](https://jestjs.io)
- [React testing library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)
- [Styled components](https://styled-components.com/docs)

Backend API is written in node using serverless on an AWS instance

###Requirements
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Postman](https://www.postman.com/downloads/) _(or similar)_ ... for reviewing new and existing API also for initial account creation

###Getting started
1. Once cloned to your local machine request the `.env.local` file from any of the active FE devs on the team 
2. add this env file to `[PROJECT_DIR]/frontend/dods_pip` this is to enable the NextJs fetch proxy to resolve the correct dev environment URL
3. install packages with `yarn` from the `[PROJECT_DIR]/frontend/dods_pip` folder
4. start the project up with `yarn dev`
5. write some awesome code :)

###Setting up a test account
At the time of writing, a complete authentication flow in the website is yet to be complete. Therefore user accounts need to be setup manually

- request an up-to-date postman collection from any of the devs or QAs 
- in postman, using the `dev/signUp` endpoint, create an account
- you’ll receive an email with a confirmation code 
- using the `dev/confirmRegistration` endpoint, submit that confirmation code 
- done, you now are able to login to the website via the home page

####Notes
- Though this _is_ a monorepo, at the time of writing, only a few packages are published to npm infrequently, cross consumption of interfaces etc currently will break the build. please avoid this (or fix it)
- All api endpoints are proxied within next js, please review other api requests if not familiar with this setup
- Though there _are_ a number of PR rules in place, neither of them actually gate the merge

