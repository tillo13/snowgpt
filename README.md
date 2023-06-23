# Project Overview

This project involves creating an AI Chatbot using ServiceNow's service portal and OpenAI's GPT-4 model. It includes a client-side script to manage the UI operations and a server-side script to handle interactions with the Boomi middleware platform, which then interacts with the GPT-4 API.

The client script initializes and manages UI elements, processes user input, and sends requests to the server. Additionally, it includes input cleaning and security measures to protect against potential XSS attacks.

The server script processes the data received from the client, calls the Boomi middleware platform, and returns the processed response from GPT-4 back to the client.

# documentation 

Feel free to try it out at https://boomi.to/snowGPT and read more about it.
Linkedin article: https://www.linkedin.com/posts/andytillo_ai-chatgpt-servicenow-activity-7059218568864808960-nEPh


## Client Script

The client script (JavaScript) is responsible for the following operations:

- Initializing UI elements and state variables.
- Fetching the user's IP address.
- Cleaning user input and checking for potentially malicious input.
- Calculating textarea rows based on input length.
- Handling form submission and server communication.
- Starting and stopping a timer to measure response time.
- Updating the loading message based on various service calls.

## Server Script

The server script (JavaScript) performs the following actions:

- Processing client-side input and calling the Boomi middleware platform.
- Parsing the response from Boomi.
- Managing errors during the parsing process.
- Returning the processed response back to the client.

The server script is also responsible for logging both input and output data.

## Instructions to Use

To use this chatbot:

1. Enter your query into the chatbot interface.
2. Optional: You can toggle between Google Search, GPT-4, and Test Mode based on your needs.
3. Click submit to send your request.
4. The chatbot will process your request and return a response.

Please note that this chatbot has protective measures against potentially malicious inputs. If such an input is detected, it will not be processed, and a warning message will be displayed.

## Dependencies

This project is dependent on the following:

- ServiceNow for the service portal.
- Boomi as a middleware platform.
- OpenAI's GPT-4 model for generating chatbot responses.
- The IPify service for fetching the IP address.
- jQuery for enabling Bootstrap tooltips.

## Version

Current project version as of June 23, 2023.

## License

This project is licensed under the MIT License, which allows it to be used for any purpose. Please refer to the LICENSE file for more information.

