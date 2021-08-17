# SDC-Reviews

I was tasked in rewriting an outdated API, specifically the data generated for the reviews section of this API. The first thing that I did was to take the raw CSV data and convert it into a postgreSQL database. The format of the data needed to be returned in the same format of the API. After that I then rewrote the API code in a more efficient manner that reduced the runtime of the API commands by 10x. This was confirmed using K6.

Next I deployed both database and rewritten code to AWS EC2 and then used Nginx to horizontally scale the application. Thoroughput was tested using Loader.io.

Tech Used: Axios, Express, PostgreSQL, K6, Nginx, AWS, and Loader.io
