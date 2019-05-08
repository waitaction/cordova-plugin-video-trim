var fs = require('fs');

/**
 * 获取包名
 */
function getPackageName() {
    var androidManifestPath = 'platforms/android/app/src/main/AndroidManifest.xml';
    //正则匹配包名
    var data = fs.readFileSync(androidManifestPath, 'utf8');
    var mStr = data.match(/<manifest[\s\S]*package=[\'\"].*?[\'\"]/ig)[0];
    var packageName = mStr.match(/package=[\'\"].*?[\'\"]/ig)[0].replace("package=", "").replace(/\"/ig, "").replace("'", "");
    return packageName;
}

function replaceJavaPackageName() {
    var packageName = getPackageName();
    console.log("包名:" + packageName);
    var dirPath = 'platforms/android/app/src/main/java/com/iknow/android';
    //读取该插件的java文件列表 platforms/android/app/src/main/java/com/iknow/android
    readDir(dirPath);
    function readDir(path) {
        fs.readdir(path, function (err, files) {
            if (!files.length) {
                return;
            }
            function file(i) {
                var filename = files[i];
                var filePath = path + '/' + filename;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        readDir(filePath);
                    } else {
                        if (filename.search(/^.*?\.java/ig) >= 0) {
                            //读取文件内容
                            var data = fs.readFileSync(filePath, 'utf8');
                            //替换 $PACKAGE_NAME 为 包名
                            var result = data.replace(/\$PACKAGE_NAME/ig, packageName);
                            fs.writeFileSync(filePath, result, 'utf8');
                        }
                    }
                    i++;
                    if (i < files.length) {
                        file(i);
                    }
                });
            }
            file(0);
        });
    }

}

replaceJavaPackageName();