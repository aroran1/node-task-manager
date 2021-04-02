# Heroku Deployment

For heroku set up you should delete the extra folders / files like playground or tutorials-only OR add `.slugignore` file to marks the files / folders that you would like heroku to ignore but want to leav it in for git.

Heroku site: 
- Login to heroku
- create an app with unique name `aroran-task-manager` & choose a region
- Heroku git URL | Heroku Domain
`https://git.heroku.com/aroran-task-manager.git | https://aroran-task-manager.herokuapp.com/`

Terminal:
- `heroku login`
- `heroku create aroran-task-manager` - to create a project with cmd
- set up heroku git `heroku git:remote -a aroran-task-manager` - (required in terminal if app created via site)
- [Config](https://devcenter.heroku.com/articles/config-vars)
  - Heroku set env config with `heroku config:set <key=value>` ie `heroku config:set =value>`
  - to see already set configs run `<projectName> Config Vars`
  - to remove a config key `heroku config:unset <key>`
  - Make sure to set JWT_SECRET, SENDGRID_API_KEY and MONGODB_URL
    - For MONGODB_URL, Goto Mongo DB Atlas cluster > connect > connect your application, which looks like this
    `mongodb+srv://TaskManagerApp:<password>@cluster0.ndsrj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    - you can change `myFirstDatabase` to `task-manager-api` in the url and make sure to wrap it in single quotes whne passing it to set as MONGODB_URL='mongodb+srv://TaskManagerApp:<password>@cluster0.ndsrj.mongodb.net/task-manager-api?retryWrites=true&w=majority' (to avoid special character)
  - PORT is not required as its maintained and managed by Heroku automatically
- `git push heroku master` to push to heroku remote which was  set up when we used `heroku create`
  