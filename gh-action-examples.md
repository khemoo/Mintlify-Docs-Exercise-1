# Github Action Examples

## Workflow

Add this workflow to your repository in .github/workflows/trigger-qa-tech.yml

```yaml
name: 'Trigger QA.tech Run'

on:
  workflow_call:
    secrets:
      url:
        description: 'URL to trigger a run via API. Provided by QA.tech, Configuration -> Integrations -> API'
        required: true
      token:
        description: 'API Token to trigger a run via API. Provided by QA.tech, Configuration -> Integrations -> API'
        required: true

jobs:
  post-request:
    runs-on: ubuntu-latest

    steps:
      - id: 'postRequest'
        uses: fjogeleit/http-request-action@v1
        with:
          url: ${{ inputs.url }}
          method: 'POST'
          bearerToken: ${{ inputs.token }}
          customHeaders: '{"Content-Type": "application/json"}'

      - name: Show response from QA.tech
        run: |
          echo ${{ steps.postRequest.outputs.response }}
```

Use above workflow in your workflow after deployment is completed.

Example:

```yaml
name: 'Your deployment workflow'
deploy:
...your deployment step
run-qa-tech:
  needs: deploy
  uses: ./.github/workflows/qatech-run.yml
  secrets:
    url: ${{ secrets.QATECH_API_URL }}
    token: ${{ secrets.QATECH_API_TOKEN }}
```

In this examples you need to add QATECH_API_URL and QATECH_API_TOKEN as secrets to your repository and use them in the workflow. You can find the values in QA.tech under Configuration -> Integrations -> API.
