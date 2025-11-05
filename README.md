


# ui data dale wo save ho gia ga data base ma or api ma bhi 
# step # 1
## sab ha phale src/ folder ma file create kare 
###### lib/folderis ka ander file lib.js

# step # 2

## app/folder ma api/folder create kare in anader ka or folder data/ is ka ander file rote.js

# step # 3
## .env file setup OR db.js file setup mysql link

# step # 4
## BASIC ap api banane ha data/rote.js ka ander get ka  ADVANCE AP SQL KA LINK KARE 

# step # 5
### IMAGE DALNE KA LIA PUBLIC/ KA FOLDER AIK FOLDER CREATE KARE uploads ka image kia lia only 

# step # 6
## or main file page.tsx from banan ha 

# step # 7
## agar api data dekna ha tuo  api/data ase ho ga 

# step # 8
## agar ui ma dekna ha tuo app/ ma folder bano kise name sa customer/page.tsx app ui fecth kare ka 



# step # 9
## mysql data base full table 
```
CREATE DATABASE IF NOT EXISTS media;
USE media;
CREATE TABLE Ret (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Description TEXT,
  ImageUrl VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- DROP TABLE IF EXISTS Ret;


INSERT INTO Ret (Name, Description, ImageUrl) VALUES

('BMW X5', 'Luxury SUV, 2022 model', '/uploads/bmw_x5.jpg');

SELECT * FROM Ret;   

```
