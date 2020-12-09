var fetchedtoken;
var signername;
var signeremail;
$(document).ready(function(){
    GetUserDetails()
    
    });

 function GetUserDetails() {  
    var url = "https://dmcs-dev.itfc-idb.org/apps/Memo/_api/web/currentuser";  
    $.ajax({  
        url: url,  
        headers: {  
            Accept: "application/json;odata=verbose"  
        },  
        async: false,   
        success: function (data) {  
        console.log("Hi",data.d.UserId.NameId);
            var emailid = data.d.UserId.NameId; 
            authredirect(emailid);
           
            
        },  
        eror: function (data) {  
            alert("An error occurred. Please try again.");  
        }  
    });  
}  


function authredirect(emailid){

var config = {  
  auth: {  
      clientId: "35b83573-7b3b-4dde-9060-ef7845fb3700",  
      authority: "https://login.microsoftonline.com/ec9121b6-25f6-408f-9fba-c760737450ab"  
  },  
  cache: {  
      cacheLocation: "sessionStorage"       
        
  }  
};  
  
// Add here the scopes to request when obtaining an access token for MS Graph API
// for more, visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/docs/scopes.md
var graphConfig = {  
  graphEndPoint: "https://graph.microsoft.com/v1.0/me"  
}; 

var requestPermissionScope = {  
  scopes: ["api://6b959fad-c896-413a-abe7-6c24c463fb81/access_as_user"],
 loginHint: ""+emailid+""  
 
}; 

var myMSALObj = new Msal.UserAgentApplication(config);

function RetrieveAccessToken() {  

  myMSALObj.acquireTokenSilent(requestPermissionScope)
  .then(result => fetchedtoken=result.accessToken)
    .catch(error => { console.log(error); 
    console.log("silent token acquisition fails. acquiring token using popup");
     // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenPopup(requestPermissionScope)
      .then(tokenResponse => { return tokenResponse; })
      .catch(error => { console.log(error); }); }); 
}

RetrieveAccessToken();


}

//function passing accesstoken to Web api
function GetTask1(){

signername=document.getElementById('name').value;
signeremail=document.getElementById('email').value;
console.log("tokeninside",fetchedtoken);
 const headers = new Headers();
 const bearer = `Bearer ${fetchedtoken}`;

 headers.append("Authorization", bearer);
console.log("headers",headers);
 const options = {
   
     method: "GET",
     headers: headers
 };
 var url = "https://localhost:44337/api/Signature?signerName="+signername+"&signerEmail="+signeremail+"";
 console.log("url",url);

 
 fetch(url,options)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log("hrray",data.url);
        window.open("https://dmcs-dev.itfc-idb.org/apps/Memo/SitePages/Docusign.aspx?url="+ encodeURI(data.url), '_blank');
       // window.top.location.href = "https://dmcs-dev.itfc-idb.org/apps/Memo/SitePages/Docusign.aspx?url=" +data.url;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

}

