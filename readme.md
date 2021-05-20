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
    git clone https://github.com/klusbert/LNU-course-backend.git
    cd LNU-course-backend

## Start the server

First we need to update the mongo connection string, we use mongo atlas and they provide connection string.

    npm i
    pm2 start ecosystem.config.cjs --env production


## Update running server
ssh into the target backend and cd to LNU-course-backend
then type:

    git pull

The server should now reconfigure it self, sometimes git pull overwrite ecosystem.config.cjs, in that case we need to update mongoconnection string and save it.
