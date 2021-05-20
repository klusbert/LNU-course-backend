docker build . -t klusbert/lnu-api
# API calls

| URL                          | METHOD | BODY                                                                                                             | RETURNS                                           |
|------------------------------|--------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| /api/courses/search/keyword  | GET    | none*                                                                                                            | Search result                                     |
| /api/courses/course/courseID | GET    | none*                                                                                                            | Course information                                |
| /api/auth/login              | POST   | {username: "username",password:"password"}                                                                       | {loggedIn:true,token"token",userName: "username"} |
| /api/courses/postreview      | POST   | {token:"token",courseID:"courseID",message:"message",rating:rating,anonymous:true\|\|false,,studentID:studentID} | {success}                                         |
| /api/courses/scorereview     | POST   | {token:"token",reviewID:"reviewID"}        

# Installation cs cloud


## Install node
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 -g

## Clone repo
git clone https://gitlab.klusbert.xyz/klusbert/lnu-courses-api.git
cd lnu-courses-api

## Start the server

First we need to update the mongo connection string, we use mongo atlas and they provide connection string.
npm i
pm2 start ecosystem.config.cjs --env production

