# Postman

## Setup environments
So far in our project we have used all the apis with localhost:3000 where our express is set and is only accessible if our project is running locally which may not be suitable for long run as we deploy thing to differnt environments.

### Add new environments
You can start by adding new environments to the project by clicking on the `eye icon` next to no environments dropdown and finding `Add new environment` button in a dropdown.

#### Add 2 new environments
- Task Manager API - Dev
  - Set Variable as `url` and initial and current values as `localhost:3000`

- Task Manager API - Prod
  - Set Variable as `url` and leave initial and current values as empty for now unless you know the url

Once set change the, `localhost:3000` part in the apis with `{{url}}` and this should work as expected. If you hover over the url part in the postman you can see what values are being passed to this as well.


## Setup Authentication
Postman provides different ways to pass the authorization headers tokens with your requests.

- Header
  - Passing it via headers by selecting `Authorization` and passing the `Bearer <token>`

- Authorization
  - Passing it via Authorization tab by selecting `Bearer Token` and passing the `<token>`

- Authorization - Setting it for whole set of apis in the project
  - Passing it via Authorization tab by selecting `Inherit from the parent`
  - Click Edit the collection from the dropdown menu
  - Select `Authorization` tab, selecting `Bearer Token` and passing the `<token>`
  - by setting this, it should work for all the apis in the collection which has Authorization set to `inherit from parent`
  - make sure to remove this auth from create user and login paths and set it as `No auth`


## Automate new token / Auth handling
You can creation of new token and pass it to the Authorization on the collection automatically by writing a small script in the `pre-request script` or `test` tabs. This script is run before the request is send off, so in our case before the login or create requests are send off.

-  replace the token value in the collection Authorization with a variable {{authToken}} which will be created by the script
- set the below script in the `test` tab of the /login path
```
if (pm.response.code === 200) {
    pm.environment.set('authToken', pm.response.json().token)
}
```
- add the same code to the create - /user path but check for status being `201` for created isntaed of 200