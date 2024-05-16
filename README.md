# ccn-coverage-vis

Visualizations of coverage and performance analysis for Community Cellular Networks.

Now hosted on https://coverage.seattlecommunitynetwork.org/


## Initial Setup
To install this service, the fist time, you will need to:

1. Required tools and versions:
    1. node
    2. npm
2. Configure:
    1. x
    2. y
    3. z
3. Deploy as below.

* What tools are needed and how are they installed?
* What configuration is needed?
* How is configuration set?


## Deploying
Once the service has been setup (as above), it can be deployed using the following process:
1. Login to the <coverage-host>
2. Pull the lastest version from github
3. Restart the server

```
ssh <coverage-host>
cd ccn-coverage-vis
git pull
pm2 restart
```

## Troubleshooting & Recovery
When a problem occurs, there are several checks to determine where the failure is:
1. Check HTTP errors in the browser
1. Login to the <coverage-host>
2. Confirm ccn-coverage-vis is operating as expected
3. Confirm nginx is operating as expected

### Checking HTTP errors in the browser



### Checking ccn-coverage-vis with pm2

```
ssh <coverage-host>
pm2 list
# expect "API" in the list, expect running, screenshot
```


Running? check pm2


### Checking nginx

Check service operation

Check nginx logs



## Testing

Changes to the main branch are automically built and deployed to: https://seattlecommunitynetwork.org/ccn-coverage-vis/

Once changes have been validated, they can be deployed with:

```
ssh coverage-api.westus2.cloudapp.azure.com
cd ccn-coverage-vis/
git switch main
git stash
git pull
npm install
```


# Issues

- Chart doesn't show tooltips.

# TODOs

- Toggle graph view off results in no toggle-on button
- Make the chart more informative
  - Hover on a line should show the exact data and which sites are they from
- Admin Panel
  - Edit Button
  - Toggle Active
- Better compatibility with local development

# Maybe

- More map information
