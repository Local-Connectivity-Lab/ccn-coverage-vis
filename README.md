# ccn-coverage-vis

Visualizations of coverage and performance analysis for Community Cellular Networks.

Now hosted on https://coverage.seattlecommunitynetwork.org/

# Testing & Deployment

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
