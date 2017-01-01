# fittfu-fantasy-backend
Web server for FITTFU fantasy app.  API documentation below.
## API Documentation
### /register `POST`
* Parameters 
  * Required
  	* first_name: [String(16)]  
    * last_name : [String(32)]  
    * email     : [String(64)]  
    * password  : [String(64)]

### /login `POST`
* Parameters
  * Required
    * email     : [String(64)]  
    * password  : [String(64)]
