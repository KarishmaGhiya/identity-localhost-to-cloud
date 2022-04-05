const { InteractiveBrowserCredential } = require("@azure/identity");

 require("@azure/identity").InteractiveBrowserCredential;

 document.getElementById("aadAuth").onclick = ()=>{
   const credential = new InteractiveBrowserCredential({clientId:"2fb1658b-9a87-49b1-827d-09a2b22052de"});
   const scope = "https://graph.microsoft.com/.default";
   credential.getToken(scope);
 }