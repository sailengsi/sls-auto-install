require('shelljs/global');

const yargs = require('yargs')
    .command('install', 'install dependencies', function (yargs) {
        echo('安装依赖');

        yargs.command('composer', 'install php dependencies', function (yargs) {
            echo('composer');
            getParams(yargs, 'composer');

        }).command('npm', 'install node npm dependencies', function (yargs) {
            echo('npm');
            getParams(yargs, 'npm');
        }).command('cnpm', 'install node cnpm dependencies', function (yargs) {
            echo('cnpm');
            getParams(yargs, 'cnpm');
        });
    })
    .argv;


function getParams(yargs, command) {
    var argv = yargs.reset()
        .option("path", {
            alias: "p",
            description: "安装依赖项目所在路径",
            required: true
        })
        .option('rmDependencies', {
            alias: 'r',
            description: "清空项目依赖",
            boolean: true
        })
        .help("h")
        .alias("h", "help")
        .argv;

    const path = argv.path;
    if (typeof path === 'boolean') {
        console.log('缺少path');
        exit(1);
    }

    console.error('argv.rmDependencies', argv.rmDependencies);

    if (argv.rmDependencies) {
        console.error('清除之前的依赖');
        let rdCmd = '';
        let dependenciesDir = '';

        if (command === 'composer') {
            dependenciesDir = 'vendor';
        }

        if (command === 'npm' || command === 'cnpm') {
            dependenciesDir = 'node_modules';
        }

        if (dependenciesDir) {
            rdCmd = `cd ${path} && rm -rf ${dependenciesDir}`;
        }

        if (rdCmd) {
            exec(rdCmd);
        }
    }

    const installCmd = `cd ${path} && ${command} install`;

    exec(installCmd);
}