https://hub.docker.com/r/htamarin/ctfdefoumalade

# CTF HT
This Website need you to be broken.
You will need to find flags

## Scenario

You discover a wonderfull website on the web but you find out that you don't know any account identifier and the sign in form is disabled.

## Prérequis

- Docker
- burpsuite
- dirburster
- your ip

In the case you dont have docker

git clone 
npm install

mysql setup

username : root
password : root


CREATE database ctf;
USE database;
CREATE TABLE utilisateur 
(
   id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
   username VARCHAR(50),
   motdepasse VARCHAR(50),
   role VARCHAR(50)
);
INSERT INTO utilisateur (username,motdepasse,role) VALUES ('ctf@ctf.fr','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','ctf');


**The challenges are the following**:
1. Register and login (easy)

2. You must click on the button to hope to generate a great score, you have to beat the score of 999999

3. Get to the ctf account (hard)

**How to complete thoses challenges**:
1. You have to inspect elements on the register page to find the form password then you can create an account and log in OR you can connect as an user by using sql injection.

2. You must go on the "challenge" tab and try to beat the score, but it's logically impossible, you must intercept the POST request using burpsuite and change your score to get the flag !

3. You have to dirburst on the website to find a page /page when you can see "as an admin" the usernames of certains id users.
By using SQL injection retrieve the password of all account, and the account of "CTF@ctf.fr" .
1' UNION SELECT username, motdepasse FROM utilisateur #
-> BUT ! The password is encrypted in sha1, you will have to decrypt it using https://md5decrypt.net/Sha1/. When you'v done, you can connect as ctf to get the second flag.