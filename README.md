# 20-Flavors

This program is a simple MEAN stack program that simply keeps tracks of a person's ice cream orders and allows transactions such as buying and refunding.

There are 20 flavors and each flavor has a 1000 cups to buy and you have a budget of $100 starting, so you decide which ice cream flavors to buy.

To run the program, you need MongoDB and NodeJS installed:

1) Download and cd into the project and run "mongod --dbpath dataStorage" (This is so the data starts with the ice cream flavors already initalized at 1000 flavors each)

2) In another terminal on the same project call "node server.js" to keep a server running to handle http requests

3) Open localhost:3000/ and play around with it
