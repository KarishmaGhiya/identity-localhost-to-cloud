const { InteractiveBrowserCredential } = require("@azure/identity");
const { RedirectCredential } = require("@azure/identity-spa");

 require("@azure/identity").InteractiveBrowserCredential;

 const tenantId = "27029f03-7c64-4ef6-88e4-14539e6c8d8c";

 document.getElementById("aadAuth").onclick = async()=>{
   //for ibc, we need single page application for registering redirect URIs
  //  const credential = new InteractiveBrowserCredential({clientId:"6d4da101-cca5-4e65-a83d-09c9b44cb72b", tenantId:tenantId, loginStyle:"redirect", redirectUri:"http://localhost:8080/secret"});
  //  const scope = "https://graph.microsoft.com/.default";
  //  const accessToken = await credential.getToken(scope);
  //  console.log(accessToken);


  //using RedirectCredential
  const credential = new RedirectCredential({clientId:"6d4da101-cca5-4e65-a83d-09c9b44cb72b",tenantId:tenantId, redirectUri:"http://localhost:8080/secret"});
  const scope = "https://graph.microsoft.com/.default";
  let state = {
    "application": "state"
  }

 }

 document.getElementById("nodeAuth").onclick = async() => {
   //04b07795-8ddb-461a-bbee-02f9e1bf7b46 - default
   //747a3a69-568f-4d40-9e9c-8f21472f246e - type web
   //"ed0e15fd-bb43-44e2-8d9c-b9c9758e0a46" //type public client
  location.replace(getAuthorizeUrl(tenantId,"ed0e15fd-bb43-44e2-8d9c-b9c9758e0a46","https://graph.microsoft.com/.default","http://localhost:8080/azureRedirect"));
 }

 function getAuthorizeUrl(tenantId, clientId, scopes,redirectUri) {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });
  const authorityHost = "https://login.microsoftonline.com";
  const query = params.toString();
  return `${authorityHost}/${tenantId}/oauth2/v2.0/authorize?${query}`;
}