# ccn-coverage-vis

Visualizations of coverage and performance analysis for Community Cellular Networks.

Now hosted on https://coverage.seattlecommunitynetwork.org/


## Initial Setup
To install this service, the fist time, you will need to:

1. Required tools and versions:
    1. Install `node` and `npm` according to the directions at https://nodejs.org/en/download/package-manager 
    2. `make` and `docker` are used for local development
2. Clone the service: `https://github.com/Local-Connectivity-Lab/ccn-coverage-vis` 
3. Configure:
    1. `cd cd ccn-coverage-vis`     
    1. Edit `src/utils/config.ts` and set the correct URL for your API host (if you're testing or you're deploying to a new URL).

## Development
Avoid committing your change directly to the `main` branch. Check out your own private branch for your development and submit a pull request when the feature/bug fix/cleanup is ready for review. Follow the [Angular Commit Message Conventions](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) for your commit message. Versions will be managed based on those commit messages. 

## Troubleshooting & Recovery
When a problem occurs, there are several checks to determine where the failure is:
1. Check HTTP errors in the browser
1. Login to the coverage-host
2. Confirm ccn-coverage-vis is operating as expected
3. Confirm nginx is operating as expected

### Checking HTTP errors in the browser
First, open your browser and go to: https://coverage.seattlecommunitynetwork.org/

Is it working?

If not, open up the browser **Web Developer Tools**, usually under the menu Tools > Developer Tools > Web Developer Tools.

With this panel open at the bottom of the screen select the **Network** tab and refresh the browser page.

Look in the first column, Status:
* `200`: OK, everything is good.
* `502`: Error with the backend services (behind nginx)
* `500` errors: problem with nxginx. Look in `/var/log/nginx/error.log` for details.
* `400` errors: problem with the service. Check the service logs and nginx logs.
* Timeout or unreachable error: Something is broken in the network between your web browser and the coverage-vis host.


### Checking nginx
If there appear problems with nginx, then check that the 

Check service operation:
```
systemctl status nginx
```

Check nginx logs:
```
sudo tail /var/log/nginx/error.log
```

Sources of errors might include nginx configuration in `/etc/nginx/conf.d/01-ccn-coverage.conf`

If you need to restart nginx, use: 
```
sudo systemctl restart nginx
```

### Clean Recovery
If nothing else works, the last option is a clean reinstall of the service. The process is:
* Remove the `ccn-coverage-vis` directory.
* Re-install as per **Initial Setup**.


## Testing

We provide a docker compose environment for local testing. Run `docker compose up -d`, and the web server will be running on your local host at port `443`.


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

## Contributing
Any contribution and pull requests are welcome! However, before you plan to implement some features or try to fix an uncertain issue, it is recommended to open a discussion first. You can also join our [Discord channel](https://discord.com/invite/gn4DKF83bP), or visit our [website](https://seattlecommunitynetwork.org/).

## License
ccn-coverage-vis is released under Apache License. See [LICENSE](/LICENSE) for more details.