/*from BAIDU FIS https://github.com/fex-team/receiver*/
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var colors = require('colors');

var hostname = '127.0.0.1';
var port = parseInt(process.argv[2]) || 3001;

var endl = '\r\n';
var stdoutSperator = ' ';
var logPrefix = '[http push receiver]'.green + ' - '.green.bold;

var server = http.createServer((req, res) => {
    function error(err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.toString()); //fail
    }

    function next(from, to) {
        fs.readFile(from, function(err, content) {
            if (err) {
                error(err);
            } else {
                process.stdout.write(logPrefix + dateNow() + stdoutSperator +
                    '[prepare for receiving] '.yellow + to.green + endl);

                fs.writeFile(to, content, function(err) {
                    if (err) {
                        process.stdout.write(logPrefix + dateNow() + stdoutSperator +
                            '[receiving failed] '.red + to.grey + endl);

                        error(err);
                    }
                    process.stdout.write(logPrefix + dateNow() + stdoutSperator +
                        '[received success] '.yellow + to.green + endl);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(to + ' is received'); //success
                });
            }
        });
    }

    if (req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            if (err) {
                error(err);
            } else {
                var to = fields['to'];

                fs.exists(to, function(exists) {
                    if (exists) {
                        fs.unlink(to, function(err) {
                            next(files.file.path, to);
                        });
                    } else {
                        fs.exists(path.dirname(to), function(exists) {
                            if (exists) {
                                next(files.file.path, to);
                            } else {
                                mkdirp(path.dirname(to), 0777, function(err) {
                                    if (err) {
                                        error(err);
                                        return;
                                    }

                                    next(files.file.path, to);
                                });
                            }
                        });
                    }
                });
            }
        });
    }

});


function dateNow() {
    return Date.now().toString().grey;
}

server.listen(port, hostname, () => {
    console.log('Server running at http://127.0.0.1:' + port);
});
