data.boomiResponses = [];

if (input) {
  $sp.log("Received input:");
  $sp.log(input);
  
  // Access the passed IP address here
  var ipAddress = input.ipAddress;
  $sp.log("Received IP address: " + ipAddress);
    
  data.boomiResponses = input.boomiResponses;

  var endpointValue = "google_search:" + input.google_search + "|use_gpt4:" + input.use_gpt4 + "|test_mode:" + input.test_mode;
  data.response = callBoomi(input.query, endpointValue, ipAddress); // Pass ipAddress here
  var now = new Date();
  data.boomiResponses.unshift({question: input.query, response: data.response, timestamp: now.toLocaleString()});
  $sp.log("calc with input as follows... ");
  $sp.log(input);
  $sp.log("boomiResponses array...");
  $sp.log(data.boomiResponses);
} else {
  $sp.log("calc initializing ");
  data.query = "What is Boomi?";
}

function callBoomi(searchTerm, endpointValue, ipAddress) { // Add ipAddress parameter here
  var r = new sn_ws.RESTMessageV2('Boomi_REST_Message_k8', 'Default POST');
  // Set the request timeout to 120 seconds (120,000 milliseconds)
  r.setRequestTimeout(120000);
  var working_sentience = "";
  var running_sentience_characters = "";
  var current_cost_estimate = "";
  var running_token_count = "";
  var iteration_counter = "";
  var script_log = "";

    if (data.boomiResponses.length > 0) {
    var lastResponse = data.boomiResponses[0];

    working_sentience = lastResponse.response.working_sentience || "";
    running_sentience_characters = lastResponse.response.running_sentience_characters || "";
    current_cost_estimate = lastResponse.response.current_cost_estimate || "";
    running_token_count = lastResponse.response.running_token_count || "";
    iteration_counter = lastResponse.response.iteration_counter || "";
    script_log = lastResponse.response.script_log || "";
  }

  iteration_counter = data.boomiResponses.length; // Update the iteration_counter value

  r.setStringParameter('from_servicenow', encodeURIComponent(searchTerm));
  r.setStringParameter('endpoint', endpointValue);
  r.setStringParameter('ip_address', ipAddress); // Add this line to include ipAddress in the payload
  r.setStringParameter('working_sentience', encodeURIComponent(working_sentience));
  r.setStringParameter('running_sentience_characters', running_sentience_characters);
  r.setStringParameter('current_cost_estimate', current_cost_estimate);
  r.setStringParameter('running_token_count', running_token_count);
  r.setStringParameter('iteration_counter', iteration_counter); // Pass the updated iteration_counter value
  var currentUnixTimestamp = Math.floor(Date.now() / 1000);
  r.setStringParameter('incoming_timestamp', currentUnixTimestamp.toString());
  var response = r.execute();
  var responseBody = response.getBody();
  var httpStatus = response.getStatusCode();
  var responseObject;

  try {
      responseObject = JSON.parse(responseBody);
  } catch (e) {
      $sp.log("Error parsing JSON:");
      $sp.log(e);
      responseObject = {
          to_servicenow: "Hm, it appears chatGPT is overloaded and dropped our sentience here! Try again? ¯\\_(ツ)_/¯",
          roundtrip_time: 0,
          endpoint: ""
      };
  }

  $sp.log("Response object:");
  $sp.log(responseObject);

  return {
    to_servicenow: responseObject.to_servicenow,
    endpoint: responseObject.endpoint,
    roundtrip_time: responseObject.roundtrip_time,
    working_sentience: responseObject.working_sentience || "",
    running_sentience_characters: responseObject.running_sentience_characters || "",
    current_cost_estimate: responseObject.current_cost_estimate || "",
    running_token_count: responseObject.running_token_count || "",
    iteration_counter: responseObject.iteration_counter || "",
    script_log: responseObject.script_log || ""
  };
}