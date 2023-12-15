// this file will export a function that will be used in ./hubspot.ts where if the
// post is a to let us know about a new message or new chat, we will call this function
// this function will;
// 1. get the threaded messages and last message
// 2. identify if the last message is from the visitor
// 3. identify if a staff member has responded
// 4. if the last message is from a visitor, and no staff member has responded, build a response
// 5. to build the response we need the following
// 5.a. query the fixie database for the appropriate data
// 5.b. query the json
