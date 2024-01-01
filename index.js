#!/usr/bin/env/node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import { Octokit } from "octokit";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import dotenv from "dotenv";
dotenv.config();

let repoName, ownerName, issuePerPage;
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
await welcome();
await askName();
await labels();

async function welcome() {
  console.log(
    gradient.rainbow("\n\n  Welcome to ") +
      chalk.bold.magenta("IssueTracker") +
      gradient.rainbow("  \n")
  );

  const info = `
      IssueTracker is a CLI tool that helps you manage and track issues on your repositories directly from your command line.
      Use it to search for issues based on labels, streamline your issue tracking process, and efficiently manage your projects.
      `;
  console.log(chalk.yellow(info));

  const animation = chalkAnimation.rainbow(
    "\nGet ready to Find your issues from your cli!\n"
  );
  await sleep(3000);
  animation.stop();
}

async function askName() {
  const nameRegex = /^[a-zA-Z0-9-_]+$/;

  const answers = await inquirer.prompt([
    {
      name: "owner_name",
      type: "input",
      message: "Enter the Organization's name:",
      default: "",
      validate: (input) =>
        input.match(nameRegex) ? true : "Please enter a valid owner name.",
    },
    {
      name: "repo_name",
      type: "input",
      message: "Enter the repository name:",
      default: "Repository",
      validate: (input) =>
        input.match(nameRegex) ? true : "Please enter a valid repository name.",
    },
    {
      name: "issue_number",
      type: "number",
      message: "Enter the number of issues to display:",
      default: "10",
      validate: (input) =>
        input > 0 ? true : "Please enter a valid number of issues.",
    },
  ]);

  ownerName = answers.owner_name;
  repoName = answers.repo_name;
  issuePerPage = answers.issue_number;
  console.clear();
  const msg = `${repoName}`;
  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
}

async function labels() {
  if (!ownerName || !repoName) {
    console.log(
      chalk.red("Error: Please provide valid owner and repository names.")
    );
    process.exit(1);
  }

  const spinner = createSpinner("Fetching issues...").start();
  try {
    const octokit = new Octokit({
      auth: process.env.TOKEN,
    });
    const response = await octokit.request(
      `GET /repos/${ownerName}/${repoName}/issues`,
      {
        owner: ownerName,
        repo: repoName,
        per_page: issuePerPage,
      }
    );

    const issues = response.data;
    if (issues.length === 0) {
      console.log(
        chalk.yellow("\nNo issues found for the specified repository.")
      );
      console.log(chalk.green("Thank you for using IssueTracker!"));
      spinner.stop();
      return;
    }

    console.log(chalk.bold.yellow(`Issues for ${ownerName}/${repoName}:\n`));

    issues.forEach((issue) => {
      console.log(chalk.bold.hex("#37FF8B")(`Title: ${issue.title}`));
      console.log(chalk.blue(`Link: ${issue.html_url}`));
      console.log(chalk.whiteBright(`Labels:`));
      issue.labels.forEach((label) => {
        console.log(`- ${chalk.hex(label.color)(label.name)}`);
      });
      console.log("\n-------------------------\n");
    });

    spinner.success({ text: "Issues fetched successfully" });
  } catch (error) {
    if (error.status === 404) {
      console.clear();
      console.log(
        chalk.red(`\n✖ Error: Repository "${ownerName}/${repoName}" not found.`)
      );
    } else {
      console.error(chalk.red(`\nError fetching issues: ${error.message}`));
    }
    process.exit(1);
  }
}
