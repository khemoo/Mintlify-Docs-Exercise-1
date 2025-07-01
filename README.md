# QA.tech Documentation

Welcome to the official documentation repository for QA.tech. This repository contains all the guides, API references, best practices, and integration instructions for using QA.tech products and services.

## Features

- Comprehensive guide pages
- Easy navigation
- Customizable documentation
- API Reference pages
- Examples using popular components

### Development

To preview documentation changes locally, install the [Mintlify CLI](https://www.npmjs.com/package/mintlify):

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where `mint.json` is located):

```
mintlify dev
```

### Publishing Changes

Install the QA.tech GitHub App to automatically propagate changes from this repository to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the installation link on your QA.tech dashboard.

#### Troubleshooting

- `mintlify dev` isn't running: Run `mintlify install` to re-install dependencies.
- Page loads as a 404: Make sure you are running in a folder with `mint.json`.
