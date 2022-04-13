const { InteractiveBrowserCredential } = require("@azure/identity");

 require("@azure/identity").InteractiveBrowserCredential;

 const tenantId = "27029f03-7c64-4ef6-88e4-14539e6c8d8c";

 document.getElementById("aadAuth").onclick = async()=>{
   //for ibc, we need single page application for registering redirect URIs
   const credential = new InteractiveBrowserCredential({clientId:"6d4da101-cca5-4e65-a83d-09c9b44cb72b", tenantId:tenantId, loginStyle:"redirect", redirectUri:"http://localhost:8080/secret"});
   const scope = "https://graph.microsoft.com/.default";
   const accessToken = await credential.getToken(scope);
   console.log(accessToken);
 }

 document.getElementById("nodeAuth").onclick = async() => {
  location.replace(getAuthorizeUrl(tenantId,"747a3a69-568f-4d40-9e9c-8f21472f246e","https://graph.microsoft.com/.default","http://localhost:8080/azureRedirect"));
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