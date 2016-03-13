
### The GithubGriller Module:

#### Public Functions

##### `getAllRepos()`:
Inputs: none
Output: Array of repos

This function calls `repos.getAll()`.

##### `getOneRepo`:

##### `getAllIssues:`:

##### `getAllComments`:


#### Internal Functions

##### `repos`
###### `.getAll(req, dep)`
Inputs: request object, dependencies objects.

Output: a request object with an array of repos at request.repos.

Attaches `client`, `githubFunc`, `config`, and `getRemainingPages` to `this`.  

`client`: the GitHub client used to authenticate the user and access their GitHub data.  

`githubFunc`: the function that should be called inside the `getRemainingPages` function.

`config`: the configuration object to be passed as an argument to the `githubFunc`.

`getRemainingPages`: the function to be called in order to recursively make requests to the GitHub servers until all the required data is received.  For instance, GitHub often restricts requests to 100 objects per 'page'; any other pages need `getRemainingPages` in order to be fetched.


##### `issues`
###### `.getAll(req, dep)`
Inputs: request object, dependencies objects
Output: a request object with an array of issues at request.issues.

##### `comments`
###### `.getAll(req, dep)`
Inputs: request object, dependencies objects
Output: a request object with an array of comments at request.comments.

##### `collabs`
###### `.getAll(req, dep)`
Inputs: request object, dependencies objects
Output: a request object with an array of collaborators at request.collabs.

##### `parse`

##### `utils`
