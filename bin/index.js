#!/usr/bin/env node
import { Command } from "commander";
import { createProject } from "../src/main.js";
import chalk from "chalk";

const program = new Command();

program
  .name("create-xp-app")
  .description("⚡ Quickly scaffold an Express.js project")
  .argument("<project-name>", "Name of your project")
  .option("-t, --type <type>", "Language type (js | ts)")
  .option(
    "--template <template>",
    "Project template (minimal | rest | realtime)"
  )
  .option(
    "-p, --package-manager <packageManager>",
    "Package manager to install dependencies (npm | yarn)"
  )
  .version("1.0.0")
  .action((projectName, options) => {
    console.log(
      chalk.cyan.bold(`\n🚀 Create Express App — Express Generator\n`)
    );
    createProject(projectName, options);
  });

program.parse(process.argv);
