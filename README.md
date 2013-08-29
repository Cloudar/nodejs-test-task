nodejs-test-task
================

Test challenge, for async nodejs complex chat application

How many chat window can you support at one time? Two, four, ten? Test yourself!
Application for realtime chating with a lot of people on different themes.

The workflow:

First of all, user have to sign in (write his name, and select room's numbers where he want to chat)
(application will up COMET connection, and send to server user data)
After signing in user see rooms where he can create dialogs (named sticker), and chat there (in stickers) with other users.
If is there no stickers in room, theme in first message in first sticker, is the general theme for whole room.
You need just to write backend... and a little fix frontend.

If you want, you can add a score for users (count of messages per minute for example).

Please use Redis, for storing data.


You can look at interface here: http://timopheym.tk/nodejs-test-task/