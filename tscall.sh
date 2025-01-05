# client stuff
tsc client/client.ts
# have to code groups in js :(
# server stuff
tsc src/*.ts
# put server in dist even though it's not going to work there
rm -rf dist
mkdir dist
cp src/*.js dist/