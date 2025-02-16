# chat_app

Node.js, vue.js, mongodb, AWS (especially AWS Amplify) chat app

You can check out live version [here](https://dev.d3u86g5tze9ctl.amplifyapp.com/). Frontend is build manually (command `npm run deploy`) using AWS Amplify and stored on AWS. Backend is build automatically (on push to main branch) using [akhileshns/heroku-deploy](https://github.com/AkhileshNS/heroku-deploy) to heroku. Database is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

# Running locally

> This project is a monorepo meaning that backend and frontend are stored within this repository in dedicated directories called backend and frontend. All commands that correspond to setup of for example backend should be run in the backend (if not stated otherwise).

## Prerequisites

- Node.js installed ^12.x (instruction on how to do it [here](https://nodejs.org/en/)),
- Vue.js installed ^2.6.x (instruction on how to do it [here](https://vuejs.org/v2/guide/installation.html)),
- mongodb installed and running (instruction on how to do it [here](https://docs.mongodb.com/manual/installation/)),
- account in the AWS,

## Setup backend

1. You should copy the file backend/.envExample and rename to .env. All fields need to be filled (you will have to check your mongodb configuration).
2. Run `npm install` to install all needed packages.
3. Now you can run backend with `npm run dev`.

## Setup frontend

1. First of all you will have to [install](https://docs.amplify.aws/cli/start/install) Amplify CLI.
2. After installation move to project under frontend directory and run `amplify init`. There would be few questions and you will have to authenticate yourself into the AWS console.
3. Now we can add the authentication to the project running `amplify add auth`.

- when asked about how do you want the users to sign in choose email,
- rest of settings should be left at default,

4. Log into your AWS Management Console. When inside choose proper region (should match the region that you have chosen when configuring amplify) and go to cognito. If you don't see it immediately you can always search for it in search section (upper left corner). On the next page find button with text "Manage User Pools", click it. Find user pool for your app (that's why your app name should not look like "dsdasdsada" especially if you have more than one app), click it. On left you can see "General settings" section. Click "Attributes". In section "Do you want to add custom attributes?" add new attribute. This attribute will hold our avatar info. Choose type "string", name "avatar_num" ("custom:" prefix will be added by AWS on save). Min Length, Max Length and Mutable leave as defaults. Click "Save Changes" button.
5. In fronted directory copy .envExample file and rename it to .env. Replace all properties to proper ones (all this information you can find in your console after you started the backend).
6. Push the amplify configuration to cloud by running `amplify push`.
7. When still in frontend directory run `npm install` to install all dependencies.
8. After this you are ready to run `npm run dev`.
9. There should be no users in your new user pool, so you will have to create one using register page.

## Deploy on AWS

If you wish to use the AWS amplify `amplify publish` command to add this app automatically to your AWS you will have to add the hosting `amplify add hosting` and then choose either automatic builds or manual ones. For more info about this check [this](https://aws.amazon.com/blogs/aws/host-your-apps-with-aws-amplify-console-from-the-aws-amplify-cli/) article from AWS team. When you are ready (and if you have chosen the manual deploy) you can run the `amplify publish` command (or `npm run deploy` which basically does the same thing) or you can just push changes to your repo and let the AWS deploy your app automatically.

# TODO

1. Tests, we need more tests.
2. Add option forget password.
3. Add option to choose the avatar to register form (instead of assigning random one).
