#! /usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { removeSync, copySync } = require("fs-extra");
const chalk = require("chalk"); // chalk 패키지 추가
const ora = require("ora"); // ora 패키지 추가

const GIT_REPO = "https://github.com/geonwooPark/boilerplate";

// project-name 미입력
if (process.argv.length < 3) {
  console.log(
    chalk.red("[ERROR]: Please provide a project name as shown below")
  );
  console.log(chalk.green("Usage: npx create-ts-ventileco [project-name]"));
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const isCurrentPathProject = projectName === ".";

const tempPath = path.join(currentPath, "temp");
const projectPath = isCurrentPathProject
  ? currentPath
  : path.join(currentPath, projectName);

// project-name 입력시
if (!isCurrentPathProject) {
  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === "EEXIST") {
      // 이미 해당 경로 존재
      console.log(
        chalk.red(
          `[ERROR]: The directory "${projectName}" already exists in the current location.`
        )
      );
    } else {
      console.log(chalk.red("An unexpected error occurred: "), err);
    }
    process.exit(1);
  }
}

async function generator() {
  const spinner = ora("[INFO]: Cloning project repository...").start(); // ora spinner 추가

  try {
    // git clone
    execSync(`git clone ${GIT_REPO} ${tempPath}`);
    spinner.succeed(); // 완료 시 메시지 변경

    // 임시 폴더에서 react-boilerplate만 복사
    spinner.start("[INFO]: Copying project files...");
    copySync(`${tempPath}/boilerplate`, projectPath);
    spinner.succeed();

    // 임시 폴더 삭제
    spinner.start("[INFO]: Cleaning up temporary files...");
    removeSync(tempPath);
    spinner.succeed();

    // 현재 경로 이동
    spinner.start("[INFO]: Changing to project directory...");
    if (!isCurrentPathProject) {
      process.chdir(projectPath);
    }
    spinner.succeed();

    // 의존성 설치
    spinner.start("[INFO]: Installing dependencies...");
    execSync("git init && pnpm install && pnpm exec husky install");
    spinner.succeed();

    // SUCCESS!
    console.log(
      chalk.green(
        "[SUCCESS]: Project setup completed successfully. You're ready to go!"
      )
    );
    console.log(
      chalk.blue(`
      SSSSS  U   U  CCCC  CCCC  EEEEE  SSSSS  SSSSS
      S      U   U  C      C      E     S      S
      SSSSS  U   U  C      C      EEEE  SSSSS  SSSSS
         S   U   U  C      C      E         S     S
      SSSSS   UUU   CCCC  CCCC  EEEEE  SSSSS  SSSSS
    `)
    );
  } catch (error) {
    spinner.fail(
      chalk.red("[ERROR]: An error occurred during the setup process.")
    );
    console.log(chalk.red("Error details: "), error);
  }
}

generator();
