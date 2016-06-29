// node http-push.js -r http://127.0.0.1:3001 -f D:\http-push\dist -t D:\http-push\upload\dist
// node http-push.js -r http://192.168.100.95:8999 -f D:\http-push\dist -t /home/work/dist
var request = require('request');
var fs = require('fs');
var stat = fs.stat;
var pth = require('path');
var PATH = require('flavored-path');
var colors = require('colors');
var argv = require('yargs').argv;

var endl = '\r\n';
var stdoutSperator = ' ';
var logPrefix = '[http push]'.green + ' - '.green.bold;

var receiver = argv.r;
var pathFrom = argv.f;
var pathTo = argv.t;

if (!receiver) {
    throw new Error('receiver [-r] is required!');
} else if (!pathFrom) {
    throw new Error('path from [-f] is required!');
} else if (!pathTo) {
    throw new Error('path to [-t] is required!');
}

process.stdout.write('/****************************************************************************/'.grey + endl);
process.stdout.write(logPrefix + dateNow() + stdoutSperator +
    'Receiver is: '.green + receiver.yellow + endl);

process.stdout.write(logPrefix + dateNow() + stdoutSperator +
    'Path From: '.green + pathFrom.yellow + endl);

process.stdout.write(logPrefix + dateNow() + stdoutSperator +
    'Path To: '.green + pathTo.yellow + endl);
process.stdout.write('/****************************************************************************/'.grey + endl);

function upload(pathFrom, pathTo) {
    fs.readdir(pathFrom, function(err, paths) {
        if (err) {
            throw err;
        }

        paths.forEach(function(path) {
            var _src = pathFrom + '/' + path;
            var _dst = pathTo + '/' + path;
            var readable;

            if (!PATH.isAbsolute(_src)) {
                _src = pth.resolve(_src);
            }

            if (!PATH.isAbsolute(_dst)) {
                _dst = pth.resolve(_dst);
            }

            stat(_src, function(err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);

                    process.stdout.write(
                        logPrefix + dateNow() + stdoutSperator +
                        '[prepare for uploading]'.yellow + stdoutSperator +
                        _src.green + ' >> '.yellow.bold + _dst.green + endl);

                    request.post({
                        url: receiver,
                        formData: {
                            file: readable,
                            to: _dst
                        }
                    }, function optionalCallback(err, httpResponse, body) {
                        if (err) {
                            return console.error('upload failed:', err);
                        }
                        process.stdout.write(
                            logPrefix + dateNow() + stdoutSperator +
                            '[Upload successful]'.yellow +
                            stdoutSperator +
                            'Server Response With - '.grey +
                            body.green +
                            endl);
                    });
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    upload(_src, _dst);
                }
            });
        });
    });
}

function dateNow() {
    return Date.now().toString().grey;
}

upload(pathFrom, pathTo);
