#! /usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { removeSync, copySync } = require("fs-extra");
const GIT_REPO = "https://github.com/geonwooPark/boilerplate";

// project-name 미입력
if (process.argv.length < 3) {
  console.log("[ERROR]: Enter as in the example below");
  console.log("ex) npx create-ts-ventileco [project-name]");
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
        `[ERROR]: The file ${projectName} already exist in the current directory.`
      );
    } else {
      console.log(error);
    }
    process.exit(1);
  }
}

async function generator() {
  try {
    // git clone
    console.log("[INFO]: Downloading create-ts-ventileco...");
    execSync(`git clone ${GIT_REPO} ${tempPath}`);

    // 임시 폴더에서 react-boilerplate만 복사
    console.log("[INFO]: Copying files...");
    copySync(`${tempPath}/boilerplate`, projectPath);

    // 임시 폴더 삭제
    removeSync(tempPath);

    // 현재 경로 이동
    console.log("[INFO]: Moving into directory...");
    if (!isCurrentPathProject) {
      process.chdir(projectPath);
    }

    // 의존성 설치
    console.log("[INFO]: install dependencies...");
    execSync("git init && pnpm install && pnpm exec husky install");

    // SUCCESS !
    console.log("[SUCCESS]: Success to create-ts-ventileco. Available now !");
    console.log(`
      SSSSS  U   U  CCCC  CCCC  EEEEE  SSSSS  SSSSS
      S      U   U  C      C      E     S      S
      SSSSS  U   U  C      C      EEEE  SSSSS  SSSSS
         S   U   U  C      C      E         S     S
      SSSSS   UUU   CCCC  CCCC  EEEEE  SSSSS  SSSSS
    `);
  } catch (error) {
    console.log(error);
  }
}

generator();
