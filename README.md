# automationPractice
Set up on Windows Machine to make the Protractor script to run
1.	Download Node and NPM from the website  
https://nodejs.org/en/download/
2.	Install on the Windows machine.
3.	Once installed open the Command Prompt and verify the installation.
4.	node -v and npm -v will show the installed versions.

C:\Users\alaga>node -v
v12.13.0

C:\Users\alaga>npm -v
6.12.0

5.	Make sure to update the chrome to the latest version. Chrome 78. Since I have used the chromedriver for Chrome 78.
6.	Open Chrome and click Help > About Google Chrome.
7.	Update to the latest version. It should show like 

Google Chrome is up to date
Version 78.0.3904.97 (Official Build) (64-bit)

8.	I have downloaded the chromedriver and packaged it with the Git repo. If it’s not the case, the chrome driver should be downloaded from 
https://chromedriver.chromium.org/downloads
9.	Choose the appropriate version, in my case chrome 78.
https://chromedriver.storage.googleapis.com/index.html?path=78.0.3904.70/

[Skip the steps 8 and 9, since the file is already downloaded]
10.	Then install Protractor globally using the command 

npm install -g protractor

11.	Clone / download the git repo named “automationPractice” from https://github.com/alagappan-qa/automationPractice
12.	From the Command prompt go to the root directory and run the command 

npm install 

13.	The above command will pick the dependencies from package.json and run to create node_modules folder
14.	Finally run 

npm test

15.	This will run the Suite on Chrome Browser since I have made directConnect:true in configuration file.
