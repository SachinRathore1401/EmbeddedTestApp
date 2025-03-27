var temp=''
document.addEventListener('DOMContentLoaded', function(){

    const expirationTime = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  
  console.log(expirationTime);
    const linkDataKey = 'link';
    const timestampKey = 'linkTimestamp';
    const previousparam = 'previousparam'
    const now = Date.now();
  
    // Retrieve the link and timestamp from local storage
    let linkData = localStorage.getItem(linkDataKey);
    let linkTimestamp = localStorage.getItem(timestampKey);
    if (linkData && linkTimestamp) {
      const timestamp = parseInt(linkTimestamp, 10);
      if (now - timestamp < expirationTime) {
        // Link is valid and not expired
        let decoded = window.atob(linkData);
        let previousparams = localStorage.getItem(previousparam)
        if(previousparams != scriptParams.param1)
        {
          localStorage.removeItem(previousparam);
          localStorage.removeItem(linkDataKey);
          localStorage.removeItem(timestampKey);
          fetchNewLink();
        }
        else{
          try {
            appendIframe(decoded)
          } catch {
            console.error('Dashboard container element not found');
            appendIframecatch("<h1 style='text-align:center; font-size:18px; color:red;'>Not found. Please contact your administrator.</h1>")
          }
        }
        
      } else {
        // Link has expired, clear it from local storage
        localStorage.removeItem(previousparam);
        localStorage.removeItem(linkDataKey);
        localStorage.removeItem(timestampKey);
        fetchNewLink();
      }
    } else {
      // No link data in local storage, fetch a new link
      fetchNewLink();
    }
  
    function fetchNewLink() {
      temp =scriptParams.param1
      const requestOptions = {
        method: 'GET',
        headers: {
          'FrameOptionsId': scriptParams.param1,
          'Content-Type': 'application/json'
        }
      };
  
      const requestOptionsForIP = {
        method: 'GET',
      };
  
      var param3 = window.location.host;
      console.log(param3);
      fetch("https://ipwhois.app/json/", requestOptionsForIP)
        .then(res => res.json())
        .then(data => {
          var ipAddressData = data.ip;
          var loc = data.city + "," + data.region + "," + data.country;
          console.log(scriptParams.param1);
          fetch("http://192.168.0.190:81/api/EmbeddedDashboard/Validator?clientId=" + scriptParams.param1 + "&domain=" + param3 + "&ipAddress=" + ipAddressData + "&location=" + loc, requestOptions)
            .then(async response => {
              await response.json().then(data => {
                console.log('Data received:', data);
                if (data.item != null && data.isError == false) {
                  const iframeUrl = data.item;
                  localStorage.setItem(previousparam, scriptParams.param1);
                  localStorage.setItem(linkDataKey, window.btoa(iframeUrl));
                  localStorage.setItem(timestampKey, now.toString()); // Store current timestamp
                  appendIframe(iframeUrl)
                } else {
                  appendIframecatch('Unautorize Please Contact to adminstrator',"<p style='text-align:center; font-size:18px; color:red;'>Something went wrong</p>")
                  
                }
              }).catch(error => {
                console.log('error', error);
                appendIframecatch("<h1 style='text-align:center; font-size:18px; color:red;'>Unauthorize</h1>")
              });
            });
        });
    }
  });

  function appendIframe(iframeUrl)
  {
    console.log(iframeUrl);
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.width = '90%';
    iframe.height = '80%'
    iframe.frameBorder = '0%';
    iframe.allowFullScreen = true;
    document.getElementById(scriptParams.param2).appendChild(iframe);
  
  }
  
  function appendIframecatch(text)
  {
    const iframe = document.createElement('iframe');
    iframe.src = '';
    iframe.width = '90%';
    iframe.height ='80%'
    iframe.frameBorder = '10%';
    iframe.allowFullScreen = true;
    iframe.srcdoc=text
    document.getElementById(scriptParams.param2).appendChild(iframe);
  }  
  
