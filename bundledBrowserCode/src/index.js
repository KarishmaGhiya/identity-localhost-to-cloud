const { InteractiveBrowserCredential } = require("@azure/identity");

 require("@azure/identity").InteractiveBrowserCredential;

 document.getElementById("aadAuth").onclick = async()=>{
   const credential = new InteractiveBrowserCredential({clientId:"6d4da101-cca5-4e65-a83d-09c9b44cb72b", tenantId:"27029f03-7c64-4ef6-88e4-14539e6c8d8c", loginStyle:"redirect", redirectUri:"http://localhost:8080/secret"});
   const scope = "https://graph.microsoft.com/.default";
   const authenticationCode = await credential.getToken(scope);
   console.log(authenticationCode);
 }