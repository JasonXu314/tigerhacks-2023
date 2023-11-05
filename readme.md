![Final](https://github.com/JasonXu314/tigerhacks-2023/assets/86029622/92008be4-3c8b-4606-9b8d-d47d14cd3c58)

## Installation Instructions

Requires NodeJS and one of: an **Android emulator**, **Expo Go**, or **XCode**.

1. Clone the repo
2. `npm install` in the `frontend` directory
3. Run `expo start` and visit the app on the mobile device.

## Inspiration 🎤
It all started with a passion for singing. I wasn't a pro singer by any chance, but among my friends, I was the best!  We used to go to karaoke together, but as we got older and life got busier, we drifted apart because of college, work, and the pandemic.  I used to complain about it a lot. This is how the ultimate idea was born. From being a local joke, the "Song Wars" grew into a full commitment. My teammates and I thought, why not use technology to bring friends and family together and let them sing and have a blast, just like in the good old days. 

## What it does? 
"Song Wars" is a mobile app that lets players have a one-versus-one karaoke match against each other with spectators judging and voting for the best star of the evening! The karaoke room allows hosts to assign the singers, choose songs, and have up to 10 people in the lobby! The app generates 4-digit codes for hosts to share with the players so they can join their private rooms.  "Song Wars" meets users with a pleasant and upbeat interface that successfully matches the pin-point functionality. The app displays lyrics, plays the music, and records the players' performance. Players can see who the real Freddy Mercury is after the spectators's voting result is displayed and rematch each other whenever they want.

## How we built it 🎮
We used React Native for the frontend, and implemented a Rest API & WebSocket Gateway backed by a Prisma connection to MySQL database. All file storage is handled in memory and discarded when needed. For the backend framework, we used raw WebSockets and NestJS, because that is the fastest way to develop scalable prototypes. For lyrics animation we incorporated a from-scratch double timer using nested tail recursion in order to try and mitigate timing imprecision. We also allocated a new MySQL and user to comply with the principle of least privilege and ensure data separation and integrity.


## Challenges we ran into 🏋️
Coming up with an upbeat design, pleasant user experience, developing the whole structure of the game, writing the game logic, and separating users into spectators and singers. Dealing with audio files in React Native and handling the errors was a big part of the struggle as well. We couldn't figure out for a long time how to record and upload the audio and playback the recording from the user. The backend is hosted on our server, using NGINX as an HTTP reverse proxy. We had to figure out how to configure NGINX settings to handle WebSocket connection & ensure that NGINX did not automatically time out the sockets.

## Accomplishments that we're proud of 🏅
We are proud of our teamwork overall and usable demo with all the features. Joining the lobby with the random code, having random profile pictures for the players, a working lyrics screen with animation, a song selector, a working voting system, and accessible data about the votes.  Every member put all their efforts into making the demo functional and pleasant to use. Our design is an upbeat arcade game style and fits the game's theme. **Being able to incorporate all the functionality for the MVP in such a short time was the biggest achievement of all.**

## What we learned 📕
It was the first time we needed to use audio files in React Native. Most of the time, we faced bugs, but after long hours of sleepless nights, we learned how to resolve them—figuring out the logic for that game and handling data. We learned how to connect the frontend and backend to receive and send audio files along with WebSocket messages. Successfully collaborating to make development smoother was also a big part of the learning process.

## What's next for Song Wars 🌠
Our demo is fully functional; however, the future of "Song Wars"  lies far beyond the demo's functionality.  Adding public game mode, where you sing against random strangers, adding vocal training grounds and utilizing AI that gives users personalized verbal feedback if they choose, and the ultimate goal of all of it.. _intense drumming_ is put it all into VR, where players can select the stage they want to sing on, a model of themselves, and see the lyrics dynamically. 
