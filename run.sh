node src/index.js
if command -v google-chrome-stable &> /dev/null
then
    google-chrome-stable "127.0.0.1:3000"
else
    google-chrome "127.0.0.1:3000"
fi