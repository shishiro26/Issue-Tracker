# IssueTracker

IssueTracker is a command-line interface (CLI) tool designed to efficiently manage and track issues within GitHub repositories. It facilitates seamless interaction with GitHub's API using the Octokit library.

## How It Works

IssueTracker allows users to fetch issues from a specified GitHub organization's repository. The user inputs the organization name, repository name, and the number of issues to retrieve. The tool then provides detailed information about these issues, including their titles, links, and associated labels.

## How to Use

To utilize IssueTracker, follow these steps:

1. **Installation**: Ensure Node.js is installed. Run the following command in your terminal:

   ```
   npx cli-issue-tracker
   ```

2. **Input**: Enter the GitHub organization name and repository name when prompted. Additionally, specify the number of issues you want to view.

3. **Issue Retrieval**: IssueTracker will retrieve the requested issues from the specified GitHub repository within the organization.

4. **Display**: The tool will display comprehensive details about the issues, such as titles, links, and labels associated with each issue.

5. **Exploration**: Navigate through the fetched issues, explore their details, and efficiently manage your projects based on the provided information.

6. **Completion**: Upon finishing the issue exploration, IssueTracker will summarize the interaction and exit.

Developed by Shishiro
