# Q Review

[![Build Status](https://travis-ci.com/KeegJordan/CSE403.svg?branch=master)](https://travis-ci.com/KeegJordan/CSE403)

## End User Manual
1. Go to slack.com/apps and search for QReview (TODO, please use instructions for running locally below for now)
2. Install QReview to your workplace
3. QReview creates a new channel when a new pull request is made on GitHub. Use the following commands to interact with QReview:
	* `Inline comment`
	/qreview comment line+ “...”
	/qreview comment line- “...”
	* `General comment`
	/qreview comment "..."
	* `Request changes`
	/qreview request changes “...”
	* `Approve`
	/qreview approve "..."
	* `Learn more`
	/qreview help


### Demo
![1](https://github.com/KeegJordan/CSE403/blob/master/reports/week5/PullRequestCreate.jpg?raw=true)
When a new pull request is made on Github, Q Review fetches the basic information of it, such as the code and requested reviewers. From here, our bot creates a new channel (in this demo called “pull-request-1293”), adds the contributor and requested reviewers to the channel, and sends a snippet of the code to the chat. In this demo, Annabelle and Ethan are the reviewers and Keegan is the contributor.


![2](https://github.com/KeegJordan/CSE403/blob/master/reports/week5/2.png?raw=true)
Ethan says /qreview request changes “please remove the debug code in our production build”, QReview requests changes to the pull request on GitHub and inform the user whether the action has succeeded.  


![3](https://github.com/KeegJordan/CSE403/blob/master/reports/week5/3edited.jpg?raw=true)
When changes are made to the pull request, the bot sends the updated code snippet to the chat. Annabelle says /qreview comment 178+ “Is this line also for debugging?”, QReview adds this comment to line 178+ of the pull request code on GitHub. Then Keegan says /qreview comment 178+ “It was initially…”, QReview adds another comment to line 178+ of the code on GitHub and informs the users.


![4](https://github.com/KeegJordan/CSE403/blob/master/reports/week5/4.png?raw=true)
After that Annabelle tells QReview to request changes again and QReview requests changes for the commit on GitHub.


![5](https://github.com/KeegJordan/CSE403/blob/master/reports/week5/5edited.jpg?raw=true)
When they finally reach an agreement on the code, Annabelle calls the bot to approve the changes by saying /qreview approve “Good Job!...”. QReview then informs the user that the pull request has been approved. 




## Developer Manual

When a review is created in GitHub, users are able to interact with it in Slack.

### Setup

Currently, the best way to try out our app is through our workplace.
If you are interested, please open an issue or contact us so we can invite you to try out the app.

If you chose to set up your own app, you need some credentials to access our server, please contact
us for those information as we don't think it's secure to directly post it here.

That being said, since you need to contact us anyway, we strongly recomment trying through our workspace.

##### Create a Slack app

1. Create an app at api.slack.com/apps
2. Navigate to the OAuth & Permissions page and add the following scopes:
    * `users:read`
    * `chat:write:bot`
3. Click on "Install App to Workspace"
4. Navigate to the Slash Commands page and add a command (e.g., `/qreview`). Put anything for the request URL and short description for now.

###### Create a Github app

1. Create an app at https://github.com/settings/apps
	* Choose a name of your choice.
    * Just put anything for the "Homepage URL" and "User authorization callback
      URL". We don't need them.
    * Put anything for the "Webhook URL" for now.
    * Choose something for the webhook secret. (For development, I used
      "my_github_secret")
    * In the "Permissions" section, give "Read & Write" access for "Pull
      Requests".
    * In the "Subscribe to events" section, check "Pull request".
2. Once you have created the app, click on "Install App" and install the app.
   Choose "Only Select Repositories" to install it to a repository of your
   choice. (For development, I created a new repo that doesn't actually have any
   code.)
3. Click on "Generate private key". Save the resultant file as `github.pem` in
   this directory.
4. Take note of the app ID. We'll need it later.

##### Run locally
1. Get the code
    * Clone this repo and run `npm install` Information page) (install npm first if you havn't, available at here:          	  https://www.npmjs.com/get-npm)
2. Copy the `.env-sample` file to `.env`. In the newly-created `.env` file,
   replace "my_github_secret" with your actual github webhook secret. Replace
   "12345" with your github app ID noted above.
3. Start the dev environment by running `npm run dev`

##### Enable Q Review
1. Go back to the app settings and click on Q Review.
2. Navigate to the Slash Commands page in the slack app settings and set the Request URL to your ngrok URL (printed by `npm run dev`) + /test
    * For example, `https://ade1f065.ngrok.io/test`
3. In your Github app setting (at github.com/settings/apps), change the "Webhook URL" to your ngrok URL + /githubWebhook
	* For example, `https://ade1f065.ngrok.io/githubWebhook`
4. You should now be able to try out the command in Slack. Additionally, it will
   log when a pull request is made on the repo.
   
#### Graph Reproduce
Raw Data and Graph reproduce
Since all of our tests are either survey-based or user-study, our graph is generated based on our gathered data. 

To reproduce the graph for the survey from raw data, click on this url: https://docs.google.com/spreadsheets/d/1-r1j6aMvHRCz_etc8TJ5EaYFBUqdZnuxDL6y-Bm-Tcw/edit?usp=sharing
The graph will be auto-generated based on the data gathered through survey

To reproduce the graph for the comparative study: click on this url:
https://docs.google.com/spreadsheets/d/1lJ3q0a1mGNdyjdGDvmumwzfJpNHEtvdLmyS1nE3YPKg/edit?usp=sharing
The graph will be auto-generated based on the data gathered in the comparative study.

If you want to reproduce the whole tests, you can use our survey questions and comparative study protocol to conduct further testings yourself. These information are available under ‘~/evaluation’ directory.

