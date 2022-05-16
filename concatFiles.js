import fs from 'fs'

const tasks = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt']
const dest = 'dest.txt'

function writeResult(err, contentArray) {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    function iterateWrite(err, data, cb) {
        fs.writeFile(dest, data, {flag: 'a'}, (err) => {
            if (err) {
                return cb(err)
            }

            return cb(null, 'file saved to ' + dest);
        })
    }

    function writeFinish(err) {
        if (err) {
            console.error(err);
            process.exit(1)
        }
        console.log('all done');
    }

    function iterate(index) {
        if (contentArray.length === index) {
            return writeFinish()
        }

        iterateWrite(null, contentArray[index], (err) => {
            if (err) {
                return writeFinish(err)
            }

            iterate(index + 1)
        })
    }

    iterate(0)
}

function readFiles(readFinish) {
    function iterateRead(filePath, readPushCallback) {
        fs.readFile(filePath, 'utf8' , (err, data) => {
            if (err) {
                return readPushCallback(err)
            }

            readPushCallback(null, data)
        })
    }

    let fileContent = []
    function iterate(index) {
        if (tasks.length === index) {
            return readFinish(null, fileContent)
        }

        iterateRead(tasks[index], (err, data) => {
            if (err) {
                return readFinish(err)
            }
            fileContent[index] = data

            iterate(index + 1)
        })
    }

    iterate(0)
}

readFiles(writeResult)
