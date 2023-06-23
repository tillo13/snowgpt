function($timeout) {    
    var c = this;
  
    // Initialize google_search, use_gpt4, warningMessage, test_mode, spinnerMessage, and ipAddress
    c.data.google_search = false;
    c.data.use_gpt4 = true;
    c.data.warningMessage = "";
    c.data.test_mode = false;
    c.data.spinnerMessage = "";
    c.data.ipAddress = ""; // Add this line to initialize ipAddress
  
    // Add the fetchUserIpAddress function
    async function fetchUserIpAddress() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        // Update the c.data.ipAddress with the fetched IP address
        c.data.ipAddress = data.ip;
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    }
  
    // Call fetchUserIpAddress during initialization
    fetchUserIpAddress();
  
    // Function to clean input by removing or replacing problematic characters
    function cleanInput(input) {
      var cleanedInput = input
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/[""{}]+/g, '\'')
        .replace(/\\/g, '\\\\')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/[^A-Za-z0-9_.,!?'()\-+*\/\s]+/g, '')
        .replace(/(?:<\s*script[^>]*>(.|[\r\n])*?<\s*\/\s*script[^>]*>)/ig, '')
        .replace(/(?:<\s*style[^>]*>(.|[\r\n])*?<\s*\/\s*style[^>]*>)/ig, '')
        .replace(/(?:<\s*iframe[^>]*>(.|[\r\n])*?<\s*\/\s*iframe[^>]*>)/ig, '')
        .replace(/<\s*[^>]+>/g, '')
        .replace(/%3C[^\s]+/gi, '')
        .replace(/%3D[^\s]+/gi, '');
  
      return encodeURIComponent(cleanedInput);
    }
  
    // Function to detect potentially malicious input
    function isMaliciousInput(input) {
      var maliciousPatterns = [
        /<\s*script[^>]*>/i,
        /<\s*style[^>]*>/i,
        /<\s*iframe[^>]*>/i,
        /%3C[^\s]+/i,
        /%3D[^\s]+/i,
        /(?:javascript):/i
      ];
  
      for (var i = 0; i < maliciousPatterns.length; i++) {
        if (maliciousPatterns[i].test(input)) {
          return true;
        }
      }
  
      return false;
    }
  
    // Function to calculate the number of rows needed for the textarea based on the content
    c.calculateRows = function(text) {
      var lines = text.split(/\r|\r\n|\n/);
      return lines.length;
    }
  // Function to reload page if toggle switched
    c.resetPage = function() {
    if (c.data.reset_page) {
      location.reload();
    }
  };
      // Function to create a toggle information string
    c.createToggleInfoString = function() {
      return "(GoogleSearch:" + c.data.google_search +
             " | GPT4:" + c.data.use_gpt4 +
             " | TestMode:" + c.data.test_mode + ")";
    }
  
    // Function to submit data to server and get the response
  c.submit = function() {
    if (isMaliciousInput(c.data.query)) {
      c.data.warningMessage = "<strong>🛑 MaliciousAlertBot:</strong> Heyyy, I think you're trying to be sneaky, please don't. If you are not, and it is breaking, then something else must be going on, or the internet-dogs ate our homework...  Try again or ask linkedin.com/in/andytillo";
    } else {
      c.data.warningMessage = "";
      c.cleanedQuery = cleanInput(c.data.query);
      console.log("Submitting cleaned query to server:", c.cleanedQuery);
      c.data.loading = true;
      c.startTimer();
      c.data.toggleInfoString = c.createToggleInfoString();
  
      c.server.update({
        query: c.cleanedQuery,
        boomiResponses: c.data.boomiResponses,
        google_search: c.data.google_search,
        use_gpt4: c.data.use_gpt4,
        test_mode: c.data.test_mode,
        ipAddress: c.data.ipAddress // Add this line to pass the ipAddress value
      }).then(function() {
        c.stopTimer();
        
        if (c.data.response.to_servicenow === "Hm, it appears chatGPT is overloaded and dropped our sentience here! Try again? ¯\\_(ツ)_/¯") {
          c.data.use_gpt4 = false;
        }
  
        c.data.loading = false;
        // Reset data.query and toggles after submission
        c.data.query = "";
        c.data.google_search = false;
        c.data.use_gpt4 = true;
        c.data.test_mode = false;
      });
    }
  }
  
    c.startTimer = function() {
      c.data.elapsedTime = 0;
      c.updateSpinnerMessage();
      var startTime = new Date().getTime(); // Get the current time when the timer starts
      c.data.timerInterval = setInterval(function() {
        var currentTime = new Date().getTime(); // Get the current time at each interval
  c.data.elapsedTime = ((currentTime - startTime) / 1000).toFixed(2) + " seconds"; // Calculate the elapsed time in seconds and format it with two decimal places
        $timeout(angular.noop);
      }, 1);
    };
  
    c.stopTimer = function() {
      clearInterval(c.data.timerInterval);
    };
  
  c.updateSpinnerMessage = function() {
    if (c.data.test_mode) {
      c.data.spinnerMessage = "Sending to Boomi...";
    } else {
      c.data.spinnerMessage = "Receiving from Boomi...";
      var boomiTime = Math.floor(Math.random() * 4394);
  
      setTimeout(function() {
        if (/servicenow|ticket|count/i.test(c.data.query)) { // Check if the query contains servicenow, ticket, or count
          c.data.spinnerMessage = "Querying ServiceNow...";
          var serviceNowTime = Math.floor(Math.random() * (5000 - 3000)) + 3000; // Random time between 3 and 5 seconds
  
          setTimeout(function() {
            updateSpinnerMessageAfterServiceNow(); // Call the function that updates spinner messages after ServiceNow query
          }, serviceNowTime);
        } else {
          updateSpinnerMessageAfterServiceNow(); // Call the function that updates spinner messages after ServiceNow query
        }
        $timeout(angular.noop);
      }, boomiTime);
    }
  };
  
  function updateSpinnerMessageAfterServiceNow() {
    if (c.data.google_search) {
      c.data.spinnerMessage = "Querying Google...";
      var googleTime = Math.floor(Math.random() * (5824 - 2838)) + 2838;
  
      setTimeout(function() {
        c.data.spinnerMessage = "Sending to chatGPT...";
        var chatGPTTime = Math.min(Math.max(Math.floor(Math.random() * (14828 - 4555)) + 4555, 1000), 3000); // Set minimum timeout to 1000ms and maximum timeout to 3000ms
  
        setTimeout(function() {
          if (c.data.loading) {
            c.data.spinnerMessage = "Waiting on chatGPT...";
            var retryTime = Math.floor(Math.random() * (18723 - 5722)) + 5722;
  
            setTimeout(function() {
              if (c.data.loading) {
                c.data.spinnerMessage = "In chatGPT queue...";
                var sorryTime = Math.floor(Math.random() * (17439 - 7999)) + 7999;
  
                setTimeout(function() {
                  if (c.data.loading) {
                    c.data.spinnerMessage = "¯\\_(ツ)_/¯ ...still in chatGPT queue.";
                  }
                }, sorryTime);
              }
            }, retryTime);
          }
        }, chatGPTTime);
      }, googleTime);
    } else {
      c.data.spinnerMessage = "Waiting on chatGPT...";
    }
  }
  
    // Enable Bootstrap tooltips
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }