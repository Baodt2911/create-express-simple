import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPPORTED_PACKAGE_MANAGERS = ["npm", "yarn"];

function isPackageManagerAvailable(command) {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export async function createProject(projectName, options) {
  let { type, template, packageManager } = options;

  // ✅ Chỉ gọi toLowerCase nếu có giá trị
  let lang = type ? type.toLowerCase() : undefined;
  let tmpl = template ? template.toLowerCase() : undefined;
  let pkgManager = packageManager ? packageManager.toLowerCase() : undefined;

  // Nếu người dùng không truyền type → hỏi
  if (!lang || !["js", "ts"].includes(lang)) {
    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Select language:",
        choices: ["JavaScript", "TypeScript"],
      },
    ]);
    lang = selected === "TypeScript" ? "ts" : "js";
  }

  // Nếu người dùng không truyền template → hỏi
  if (!tmpl || !["minimal", "rest", "realtime"].includes(tmpl)) {
    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Select template:",
        choices: ["Minimal", "REST API", "Realtime (Socket.IO)"],
      },
    ]);
    tmpl =
      selected === "REST API"
        ? "rest"
        : selected === "Realtime (Socket.IO)"
        ? "realtime"
        : "minimal";
  }

  const availableManagers = SUPPORTED_PACKAGE_MANAGERS.filter(
    isPackageManagerAvailable
  );

  if (!availableManagers.length) {
    console.log(
      chalk.red(
        "❌ No supported package managers found. Please install npm or yarn."
      )
    );
    process.exit(1);
  }

  const defaultPackageManager = availableManagers.includes("npm")
    ? "npm"
    : availableManagers[0];

  if (pkgManager && !SUPPORTED_PACKAGE_MANAGERS.includes(pkgManager)) {
    console.log(
      chalk.yellow(
        `⚠️  Unsupported package manager "${pkgManager}". Falling back to ${defaultPackageManager}.`
      )
    );
    pkgManager = defaultPackageManager;
  } else if (pkgManager && !isPackageManagerAvailable(pkgManager)) {
    console.log(
      chalk.yellow(
        `⚠️  Package manager "${pkgManager}" not found. Falling back to ${defaultPackageManager}.`
      )
    );
    pkgManager = defaultPackageManager;
  } else if (!pkgManager) {
    pkgManager = defaultPackageManager;
  }

  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, "../templates", lang, tmpl);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`❌ Folder "${projectName}" already exists.`));
    process.exit(1);
  }

  if (!fs.existsSync(templateDir)) {
    console.log(chalk.red(`❌ Template not found: ${templateDir}`));
    process.exit(1);
  }

  const spinner = ora(`Creating ${tmpl} (${lang}) project...`).start();
  await fs.copy(templateDir, targetDir);
  spinner.succeed("Project created successfully! 🎉");

  // Update package.json name
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  // Cài đặt dependencies
  try {
    console.log(chalk.yellow("\n📦 Installing dependencies..."));
    const installCommand = pkgManager === "yarn" ? "yarn install" : "npm install";
    execSync(installCommand, { cwd: targetDir, stdio: "inherit" });
    console.log(
      chalk.green(
        `\n✅ Installation complete with ${pkgManager === "yarn" ? "Yarn" : "npm"}!\n`
      )
    );
  } catch {
    console.log(
      chalk.red(
        `⚠️  Failed to install dependencies. Run '${pkgManager === "yarn" ? "yarn install" : "npm install"}' manually.`
      )
    );
  }

  console.log(chalk.cyan(`\n✨ Done! Get started with:`));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(
    chalk.white(`  ${pkgManager === "yarn" ? "yarn start" : "npm start"}\n`)
  );
}
