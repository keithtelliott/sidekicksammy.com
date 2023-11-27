export let slugify = (str: string) => {
  // lower case
  // strip out non alpha numeric characters
  // replace spaces with dashes
  let returnString = str.toLowerCase();
  returnString = returnString.replace(/[^a-z0-9 ]/g, "");
  returnString = returnString.replace(/\s+/g, '-');
  return returnString;

}
