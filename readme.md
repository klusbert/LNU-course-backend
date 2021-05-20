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

git clone https://gitlab.klusbert.xyz/klusbert/lnu-courses-api.git
cd lnu-courses-api
npm i
pm2 start ecosystem.config.cjs --env production


sudo apt-get install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
