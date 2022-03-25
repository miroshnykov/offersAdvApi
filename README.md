### Server environment
```dotenv
# [optional] [default=4000]
NODE_PORT=8080
# [optional] [default=localhost]
NODE_DOMAIN=localhost
# [optional] [default=http]
NODE_PROTOCOL=http
```

### Auth token salts
```dotenv
# [required]
ADMIN_API_SECRET=some_token_salt
# [required]
ACCESS_TOKEN_SECRET=some_token_salt2
# [required]
REFRESH_TOKEN_SECRET=some_token_salt3
# [required]
CONFIRM_TOKEN_SECRET=some_token_salt4
# [required] 
RESTORE_TOKEN_SECRET=some_token_salt5
```

### MySql credentials
```dotenv
# [required]
DB_HOST=localhost
# [required]
DB_PORT=3306
# [required]
DB_USERNAME=root
# [required]
DB_PASSWORD=123
# [required]
DB_NAME=co-admin
```

### SMTP credentials
This must be set for send emails in AUTH user flows.

For local tests use http://ethereal.email/create
```dotenv
# [optional] [default=smtp.ethereal.email]
SMTP_HOST=smtp.ethereal.email
# [optional] [default=587]
SMTP_PORT=587
# [optional] [default=false]
SMTP_SECURE=false
# [optional]
SMTP_USER=barton.hegmann93@ethereal.email
# [optional]
SMTP_PASS=VcyFGhp5S2GtfQb23U
```
### CI/CD
```dotenv
# [optional] Id from a pipeline
API_BUILD=aaaaaa
# [optional] [default=587]
API_DATE=2021-08-21T14:58
# [optional] Hash of a commit this build is from
API_GIT_COMMIT=bbbbbbb
```

### Connecting to the remote db

Use ssh tunnel:

```shell script
ssh -i id_rsa -NL 33060:mysql-1.aezai.com:3306 bastion.aezai.com
```
Then you can connect to localhost:33060

### To generate migrations

Create ormconfig.json inside the root folder:
```json
{
	"name": "default",
	"type": "mysql",
	"host": "localhost",
	"port": 33060,
	"username": "username",
	"password": "password",
	"database": "adcenter",
	"synchronize": false,
	"logging": true,
	"entities": [
		"src/entity/*.ts"
	],
	"migrations": [
		"src/migration/**/*.ts"
	],
	"cli": {
		"entitiesDir": "src/modules",
		"migrationsDir": "src/migrations"
	}
}
```

Then run:
```shell script
npm run gen.migrations -- -n your.new.migration.name
```

### Local development
To install components from a private registry you need gitlab access token
https://gitlab.com/-/profile/personal_access_tokens

When you have you gitlab access token, you can install packages.

`CI_JOB_TOKEN={YOUR_GITLAB_TOKEN} npm install`

Replace {YOUR_GITLAB_TOKEN} with actual token

Dun dev environment 
`npm run dev`
