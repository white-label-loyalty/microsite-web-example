# microsite-web-example

## Running the demo

1. Make sure that Node.js is installed on your system. It has been tested with
   Node v12.10.0 but should also work with earlier versions that support
   async/await and class syntax (though these are not strictly required).
2. Clone this repository.
3. Edit the microsite hostname and client ID parameters on line 5 of `server.js`
   to match your microsite's details.
4. In your command line run the following command from within the cloned
   repository directory on your computer: `node server.js`.
5. You should see a message in your command line saying
   `Demo site availbable at http://localhost:5000`.
6. Visit the site you'll see that you are transparently authenticated as the
   Jane Doe user.
