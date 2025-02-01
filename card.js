#!/usr/bin/env node

'use strict'

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
clear();

const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    const email = "manishphalswal@gmail.com";
                    const subject = encodeURIComponent("Hello Manish!");
                    const body = encodeURIComponent("I found your profile and would like to connect.");
                    
                    open(`mailto:${email}?subject=${subject}&body=${body}`, { wait: true })
                        .then(() => console.log("\n✅ Default mail client should open now.\n"))
                        .catch(err => console.log("\n❌ Failed to open mail client:", err));
                }
            },
            
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: () => {
                    const loader = ora({
                        text: 'Downloading Resume...',
                        spinner: cliSpinners.material,
                    }).start();
            
                    // Correct URL for Google Docs PDF export
                    const pdfUrl = 'Your_Resume_URL';
                    
                    // Set the correct filename
                    const filePath = path.join(process.cwd(), 'Downloaded_file.pdf');
                    
                    // Make the request and save as PDF
                    let pipe = request({ url: pdfUrl, headers: { 'User-Agent': 'Mozilla/5.0' } })
                        .pipe(fs.createWriteStream(filePath));
            
                    pipe.on("finish", function () {
                        console.log(`\n✅ Resume downloaded at: ${filePath}\n`);
                        open(filePath); // Opens the PDF
                        loader.stop();
                    });
            
                    pipe.on("error", function (err) {
                        console.log("\n❌ Error downloading resume:", err.message);
                        loader.stop();
                    });
                }
            },

            {
                name: "Just quit.",
                value: () => {
                    console.log("Hasta la vista.\n");
                }
            }
        ]
    }
];

const data = {
    name: chalk.bold.green("                  Manish Kumar"),
    //handle: chalk.white("@manish_kumar"),
    work: `${chalk.white("Lead Salesforce Developer at")} ${chalk
        .hex("#2b82b2")
        .bold("KPMG")}`,
    github: chalk.gray("https://github.com/") + chalk.green("manish-phalswal"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("manish001"),
    npx: chalk.red("npx") + " " + chalk.white("manish_kumar"),

    labelWork: chalk.white.bold("       Work:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelCard: chalk.white.bold("    NPM Package:")
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelWork}  ${data.work}`,
        ``,
        `${data.labelGitHub}  ${data.github}`,
        `${data.labelLinkedIn}  ${data.linkedin}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `${chalk.italic("I am currently looking for new opportunities,")}`,
        `${chalk.italic("my inbox is always open. Whether you have a")}`,
        `${chalk.italic("question or just want to say hi, I will try")}`,
        `${chalk.italic("my best to get back to you!")}`,
        `${chalk.italic("With 7+ years of IT experience in Salesforce.com,")}`,
        `${chalk.italic("Vlocity/Omnistudio, and Industry CPQ,")}`,
        `${chalk.italic("leading projects across Telecom, Financial Services")}`,
        `${chalk.italic("Nonprofit, and Healthcare.")}`,
        `${chalk.italic("I’m certified in Salesforce OmniStudio, Platform")}`,
        `${chalk.italic("Developer 1, and AI, and have hands-on experience")}`,
        `${chalk.italic("with GIT version control, Jira, and Confluence for")}`,
        `${chalk.italic("agile project management.")}`,
        `${chalk.italic("-----------------------------------------------")}`,
        `${chalk.italic("Email me or download my resume by selecting")}`,
        `${chalk.italic("one of the options below.")}`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "single",
        borderColor: "green"
    }
);


console.log(me);
const tip = [
    `Tip: Try ${chalk.cyanBright.bold(
        "cmd/ctrl + click"
    )} on the links above`,
    '',
].join("\n");
console.log(tip);

prompt(questions).then(answer => answer.action());
