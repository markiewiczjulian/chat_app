# chat_app

Node.js, vue.js chat app

You can check out live version [here](https://markiewiczjulian.github.io/chat_app_prod_ready). Frontend is build automatically to github pages using [JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action) and backend is build using [akhileshns/heroku-deploy](https://github.com/AkhileshNS/heroku-deploy) to heroku. Database is hosted on MongoDB Atlas.

# Running locally 

## Prerequisites

- Node.js installed ^12.x (instruction on how to do it [here](https://nodejs.org/en/)),
- Vue.js installed ^2.6.x (instruction on how to do it [here](https://vuejs.org/v2/guide/installation.html)),
- mongodb installed and running (instruction on how to do it [here](https://docs.mongodb.com/manual/installation/)),
- account in the AWS,

## Setup backend

1. You should copy the file backend/.envExample and rename to .env. All fields need to be filled (you will have to check your mongodb configuration).
2. Run npm install to install all needed packages.
3. Now you can run backend with `npm run dev`.

## Setup frontend

1. First of all you will have to [install](https://docs.amplify.aws/cli/start/install) Amplify CLI.
2. After installation move to project under frontend directory and run `amplify init`. There would be few questions and you will have to authenticate yourself into the AWS console.
3. Now we can add the authentication to the project running `amplify add auth`.

- when asked about how do you want the users to sign in choose email,
- rest of settings should be left at default,

4. Log into your AWS Management Console. When inside choose proper region (should match the region that you have chosen when configuring amplify) and go to cognito. If you don't see it immediately you can always search for it in search section (upper left corner). O next page find button with text "Manage User Pools", click it. Find user pool for your app (that's why your app name should not look like "dsdasdsada" especially if you have more than one app), click it. On left you can see "General settings" section. Click "Attributes". In section "Do you want to add custom attributes?" add new attribute. This attribute will hold our avatar info. Choose type "string", name "custom:avatar_num". Min Length, Max Length and Mutable leave as defaults. Click "Save Changes" button.
5. In fronted directory copy .envExample file and rename it to .env. Replace all properties to proper ones (all this information you can find in not versioned file src/aws-exports.js).
6. Push the amplify configuration to cloud by running `amplify push`.
7. When still in frontend directory run `npm install` to install all dependencies.
8. After this you are ready to run `npm run dev`.
9. There should be no users in your new user pool, so you will have to create one using register page.
