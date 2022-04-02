export function verifyLogin(username: string, password: string): string{
if(username === "karishma"){
 if(password === "ghiya"){
    return("authentication succeeded");
 }
 else{
     return("incorrect password");
 }
}
else{
return("username does not exist");
}
}