const http = require("http");
const url = require("url");
const snap7 = require("node-snap7");
const HOST = "192.168.27.115";
const PORT = 701;

const s7client = new snap7.S7Client();

// Server-side: Establishing connection to the PLC
s7client.ConnectTo("192.168.27.40", 0, 1, function (err) {
  if (err) {
    return console.log("Failed to connect to Siemens PLC. Error: " + err);
  }
  // Server-side: Creating the HTTP server
  const server = http.createServer((request, response) => {
    const { pathname } = url.parse(request.url);
    // Client-side: Handling the root URL request
    if (request.method === "GET" && pathname === "/") {
      console.log("/ happened...");
      // Client-side: Sending the HTML page to the client
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(`
      <html>
      <head>
        <title>HTTP_SERVER~node.js</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          margin: 0;
          padding: 20px;
          background-color: lightgrey; /* Light blue background color */
        }
        
        .mainheading{
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          color: #333333;
        }
        
        .containers-wrapper {
          display: flex; /* Use flex display to place containers next to each other */
          justify-content: space-between; /* Add space between containers */
        }
        .container1,
        .container2 {          
          border: 4px solid #333333;
          padding: 20px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 340px; /* Set a fixed width */
          height: 420px; /* Set a fixed height to make it square */
          margin: 20px auto; /* Center the container horizontally and provide space around it */
          background-color: #b0e0e6; /* Light blue background color */
        }
        
        .button-container {          
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
          transition: background-color 0.3s ease;
        }

        .button1 {
          background-color: red;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
          transition: background-color 0.3s ease;
        }

        .button2 {
          background-color: red;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
          transition: background-color 0.3s ease;
        }

        .button3 {
          background-color: red;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
          transition: background-color 0.3s ease;
        }

        #inputValue {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          margin-right: 10px;
        }
        
        
        .button:hover {
          background-color: #45a049;
        }
        
        .output-container {
          font-size: 10px;
          color: #333333;
          border: 2px solid #333333;
          padding: 2px;
          width: 200px; /* Set a fixed width for all outputs */
          height: 70px; /* Set a fixed height for all outputs */
          overflow: auto; /* Enable scrolling if content exceeds the fixed height */
        }
        
        .output {
          font-size: 20px;
          color: #333333;
          border: 2px solid #333333;
          padding: 2px;
          width: 200px; /* Set a fixed width for all outputs */
          height: 30px; /* Set a fixed height for all outputs */
          overflow: auto; /* Enable scrolling if content exceeds the fixed height */
        }
        
        
        </style>
      </head>
      <body>

      <h1 class = "mainheading">HTTP_SERVER~node.js</h1> 

      <div class="containers-wrapper"> 

        <div class="container1"> 
          <h1>Reading</h1>                   
          <div class="row">
            <div class="button-container">
              <button class="button" onclick="sendReadDBRequest()">Read once</button>
            </div>  

              <div class="output" id="outputDB"></div> 

          </div>
          <div class="row">
            <div class="button-container">
              <button class="button1" onclick="toggleEnable()">Enable reading</button>
            </div>
            <div class="output-container">         
                <h1 id="outputReading"></h1> <!-- New output element for reading DB value -->
            </div>
          </div>          
        </div> 

        <div class="container2">  
          <h1>Writing</h1>                   
          <div class="row">
            <div class="button-container">
              <button class="button2" onclick="writeDB4()">Write once</button>
            </div>

            <input type="number" id="inputValue" placeholder="Enter value" step="any">            
            
          </div>
          <div class="row">  
          <div class="button-container">              
            </div>          
            <div class="output-container">         
                <h1 id="outputWriting"></h1> <!-- New output element for reading DB value -->
            </div>
          </div>          
        </div> 

      </div>

        <script>
          //container 1

          let timerId;
          const button1 = document.querySelector('.button1');
          let cnt = 0;
          let timerId2;

          // getting current boolean value from DB bool !!! when loading the page !!!
          let enabled = false;
          sendReadDBReqbool();            
          function sendReadDBReqbool() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/readDB3');
            xhr.onload = function() {
              if (xhr.status === 200) {
                var dbValue = xhr.responseText;                
                enabled = dbValue === "true"; // Convert "true" to true, "false" to false
                if (enabled) {
                  button1.style.backgroundColor = 'green';
                  startReading();
                  startWriting();
                } else {
                  button1.style.backgroundColor = 'red';
                  stopReading();
                  stopWriting();
                }
                console.log(enabled);
              } 
            };
            xhr.send();
          }

          // read DB value once !
          function sendReadDBRequest() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/readDB1');
            xhr.onload = function() {
              if (xhr.status === 200) {
                var dbValue = parseFloat(xhr.responseText).toFixed(2);
                document.getElementById('outputDB').innerHTML = dbValue;
              } else {
                document.getElementById('outputDB').innerHTML = 'Error reading DB value. Status: ' + xhr.status;
              }
            };
            xhr.send();
          }
          
          // invert enabled bool and write it into PLC DB !
          function toggleEnable() {
            enabled = !enabled; 
            writeDB3();
            // Update the color of button1 based on the enabled state            
            if (enabled) {
              button1.style.backgroundColor = 'green';
            } else {
              button1.style.backgroundColor = 'red';
            }
            if (enabled){
              startReading();
              startWriting();
            } else {
              stopReading();
              stopWriting();
            }                               
          }
         
          // read db value from plc each 100 ms !!!
          function startReading() {
              timerId = setInterval(function() {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', '/readDB2');
              xhr.onload = function() {
                if (xhr.status === 200) {
                  var dbValue = parseFloat(xhr.responseText).toFixed(2);
                  //document.getElementById('outputDB').innerHTML =  dbValue;
                  document.getElementById('outputReading').innerHTML = 'Reading DB value: ' + dbValue; // Update the reading output                                
                } else {
                  document.getElementById('outputReading').innerHTML = 'Error reading DB value. Status: ' + xhr.status;
                }
              };
              xhr.send();
            }, 100);
          }
          
          function stopReading() {
            clearInterval(timerId);
          }
          // write db bool into the plc db !
          function writeDB3() {
            var xhr = new XMLHttpRequest();            
            xhr.open('GET', '/writeDB3?value=' + enabled);
            xhr.onload = function() {
              if (xhr.status === 200) {
                console.log('DB value written successfully.');
                console.log(enabled);
              } else {
                console.log('Error writing DB value. Status: ' + xhr.status);
                console.log(enabled);
              }
            };
            xhr.send();
          }

          //container 2        
                    
          function writeDB4() {
            const valuetoPLC = parseFloat(document.getElementById('inputValue').value);  
            console.log(valuetoPLC);
            cnt = valuetoPLC;
            document.getElementById('outputWriting').innerHTML = 'Writing DB value: ' + cnt; // Update the reading output
            console.log(cnt);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/writeDB4?value=' + encodeURIComponent(valuetoPLC));
            xhr.onload = function() {
              if (xhr.status === 200) {
                console.log('DB value written successfully.');
              } else {
                console.log('Error writing DB value. Status: ' + xhr.status);
              }
            };
            xhr.send();
          }

          // write db value to plc each 100 ms !!!
          function startWriting() {             
            timerId2 = setInterval(function() {
            cnt++;            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/writeDB5?value=' + encodeURIComponent(cnt));
            xhr.onload = function() {
              if (xhr.status === 200) {
                //console.log('DB value written successfully.');
                document.getElementById('outputWriting').innerHTML = 'Writing DB value: ' + cnt; // Update the reading output
              } else {
                console.log('Error writing DB value. Status: ' + xhr.status);
                document.getElementById('outputWriting').innerHTML = 'Error reading DB value. Status: ' + xhr.status;
              }
            };
            xhr.send();
            }, 100);
          }

          function stopWriting() {
            clearInterval(timerId2);
          }

        </script>
      </body>
      </html>
      `);
      response.end();   
      // Server-side: Handling the DB 1 read request
    } else if (request.method === "GET" && pathname === "/readDB1") {
      console.log("/readDB1 happened...");
      // Server-side: Reading the DB value from the PLC
      const dbNumber = 54;
      const start = 0;
      const size = 4;
      s7client.DBRead(dbNumber, start, size, function (err, res) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write("Failed to read DB value. Error: " + err);
        } else {
          var buffer = Buffer.from(res);
          var decimalValue = buffer.readFloatBE(0);
          var formattedValue = decimalValue.toFixed(2);
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.write(formattedValue.toString());
          console.log(formattedValue.toString());
        }
        response.end();
      });
      // Server-side: Handling the DB 1 read request  (each 100 ms)
    } else if (request.method === "GET" && pathname === "/readDB2") {
      //console.log("/readDB1 happened...");
      // Server-side: Reading the DB value from the PLC
      s7client.DBRead(54, 4, 4, function (err, res) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write("Failed to read DB 2 value. Error: " + err);
        } else {
          var buffer = Buffer.from(res);
          var decimalValue = buffer.readFloatBE(0);
          var formattedValue = decimalValue.toFixed(2);
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.write(formattedValue.toString());
        }
        response.end();
      });
       // Server-side: Handling the DB 1 read request
    } else if (request.method === "GET" && pathname === "/readDB3") {
      console.log("/readDB3 happened...");
      // Server-side: Reading the DB value from the PLC
  s7client.DBRead(54, 8, 1, function (err, res) {
    if (err) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.write("Failed to read DB 3 value. Error: " + err);
    } else {
      var buffer = Buffer.from(res);
      var isTrue = buffer.equals(Buffer.from([0x01]));
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.write(isTrue ? "true" : "false");
      console.log(isTrue ? "true" : "false");
    }
    response.end();
  });
    } else if (request.method === "GET" && pathname === "/writeDB3") {
      console.log("/writeDB3 happened...");
      // Server-side: Writing a boolean value to DB 1
      const dbNumber = 54;
      const start = 8;
      const size = 1;
      const buffer = Buffer.alloc(size);
      const value = request.url.includes("true");
      buffer.writeUInt8(value ? 1 : 0);
      s7client.DBWrite(dbNumber, start, size, buffer, function (err) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write("Failed to write DB value. Error: " + err);
        } else {
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.write("DB value written successfully.");
        }
        response.end();
      });
    } else if (request.method === "GET" && pathname === "/writeDB4") {
      console.log("/writeDB4 happened...");
      // Server-side: Writing a float value to DB 1
      const dbNumber = 54;
      const start = 0;
      const size = 4;
      const value = parseFloat(url.parse(request.url, true).query.value); // Get the value from the URL query
      const buffer = Buffer.alloc(size);
      buffer.writeFloatBE(value);
      
      s7client.DBWrite(dbNumber, start, size, buffer, function (err) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write("Failed to write DB value. Error: " + err);
        } else {
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.write("DB value written successfully.");
        }
        response.end();
      });
    } else if (request.method === "GET" && pathname === "/writeDB5") {
      //console.log("/writeDB4 happened...");
      // Server-side: Writing a float value to DB 1
      const dbNumber = 54;
      const start = 0;
      const size = 4;
      const value = parseFloat(url.parse(request.url, true).query.value); // Get the value from the URL query
      const buffer = Buffer.alloc(size);
      buffer.writeFloatBE(value);
      
      s7client.DBWrite(dbNumber, start, size, buffer, function (err) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write("Failed to write DB value. Error: " + err);
        } else {
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.write("DB value written successfully.");
        }
        response.end();
      });
    }
  });

  // Server-side: Starting the HTTP server
  server.listen(PORT, HOST, () => {
    console.log("Server now running...");
  });
});
