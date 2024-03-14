# ccn-coverage-vis

Visualizations of coverage and performance analysis for Community Cellular Networks.

Now hosted on https://coverage.seattlecommunitynetwork.org/

# Testing & Deployment

Changes to the main branch are automically built and deployed to: https://seattlecommunitynetwork.org/ccn-coverage-vis/

Once changes have been validated, they can be deployed with:

```
ssh SSH_DEPLOYMENT_SERVER
cd ccn-coverage-vis/
git switch main
git stash
git pull
npm install
```

1. SSH into the coverage-api azure server with the username. Make sure to have permisions to do so, use this command if the above does not work:

ssh -i PATH_TO_PRIVATE_KEY USERNAME@HOSTNAME

2. Navigate to the ccn-coverage-vis directory
3. Switch to the amin branch
4. Perform git stash to save any uncommitted changes that can be used lated in the working copy.
5. Pull the main version of the code
6. Use npm install to install all modules listed as dependencies in package.json 

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
