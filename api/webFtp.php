<?php 
require 'safe.php';

// 下划线开头的变量，表示GBK编码
$path = $_REQUEST['path'];
$_path = toGBK($path);

$names = json_decode($_REQUEST['names'], true);
foreach ($names as $key => $value) {
  $names[$key] = trim($value);
}
$names = array_filter($names, function($v) {
  return $v;
});

switch ($_REQUEST['a']) {
  case 'openDir':
    if (!is_readable($_path)) err(1, '当前路径不可读  '.$_path);
    if (!is_dir($_path)) err(1, '当前路径不是文件夹 '.$_path);

    $handler = opendir($_path);
    $result = [];

    while ($_fileName = readdir($handler)) {
      if ($_fileName === '.' || $_fileName === '..') continue;

      $_fullPath = $_path.'/'.$_fileName;
      $result[] = [
        'isDir' => is_dir($_fullPath),
        'mtime' => filemtime($_fullPath),
        'name' => toUtf8($_fileName),
      ];
    }

    res($result);
    break;
  case 'makeDir':
    $names = explode('/', $_REQUEST['name']);

    // if (strpos($path, './test') !== 0) err(2, '只能在 ./test 创建文件夹');

    foreach ($names as $key => $value) {
      $value = trim($value);
      if (!$value) continue;

      $arr = explode('|', $value);
      foreach ($arr as $key => $value) {
        $value = trim($value);
        if (!$value) continue;
        $_tmpPath = $_path.'/'.toGBK($value);
        if (!is_dir($_tmpPath)) {
          mkdir($_tmpPath);
        }
      }

      $_path .= '/'.end($arr);
    }

    err(0, '目录创建成功');
    break;
  case 'makeFile':
    $names = explode('|', $_REQUEST['name']);

    // if (strpos($path, './test') !== 0) err(2, '只能在 ./test 创建文件');

    foreach ($names as $key => $value) {
      $value = trim($value);
      if (!$value) continue;
      $_tmpPath = $_path.'/'.toGBK($value);
      if (!file_exists($_tmpPath)) {
        file_put_contents($_tmpPath, '');
      }
    }

    err(0, '文件创建成功');
    break;
  case 'rename':
    $isDir = $_REQUEST['isDir'];
    $newName = trim($_REQUEST['newName']);
    $isFileMove = $_REQUEST['isFileMove'];
    $dirFrom = $_REQUEST['dirFrom'];
    $dirTo = $_REQUEST['dirTo'];
    $isUpdateExtension = $_REQUEST['isUpdateExtension'];
    $fn = $_REQUEST['isCopy'] ? cp : rename;

    // if (
    //   strpos($dirFrom, './test') !== 0 ||
    //   strpos($dirTo, './test') !== 0
    // ) err(2, '只能 rename ./test 目录下的文件');

    if ($isFileMove) {
      // 文件移动
      foreach ($names as $key => $value) {
        $_pathFrom = toGBK($dirFrom.'/'.$value);
        $_pathTo = toGBK($dirTo.'/'.$value);
        $fn($_pathFrom, $_pathTo);
      }
    } else {
      // 重命名
      if (count($names) === 1) {
        $_pathFrom = toGBK($dirFrom.'/'.$names[0]);
        $_pathTo = toGBK($dirTo.'/'.$newName);
        $fn($_pathFrom, $_pathTo);
      } else {
        $pureName = getFilePureName($newName);
        $pureType = getFileType($newName);

        foreach ($names as $key => $value) {
          $fileType = $isUpdateExtension ? $pureType : getFileType($value);
          $_pathFrom = toGBK($dirFrom.'/'.$value);
          $_pathTo = toGBK($dirTo.'/'.$pureName.'('.($key + 1).')'.($fileType ? '.'.$fileType : ''));
          $fn($_pathFrom, $_pathTo);
        }
      }
    }

    err(0, '操作成功');
    break;
  case 'fileDelete':
    $names = json_decode($_REQUEST['names'], true);

    // if (strpos($_path, './test') !== 0) err(2, '只能删除 ./test 目录下的文件');

    foreach ($names as $key => $value) {
      $value = trim($value);
      if (!$value) continue;
      $_tmpPath = $_path.'/'.toGBK($value);
      if (file_exists($_tmpPath)) rm($_tmpPath);
    }

    err(0, '删除成功');
    break;
  case 'upload':
    $pathArr = explode('/', $_REQUEST['path']);
    $fileName = array_pop($pathArr);
    $path = join($pathArr, '/');

    if (strpos($_path, './test') !== 0) err(2, '只能上传到 ./test');

    mkPath(toGBK($path));
    move_uploaded_file($_FILES['file']['tmp_name'], toGBK($_REQUEST['path'])) or die(whyFsOperateError());
    err(0, '上传成功');
    break;
  case 'getIni':
    res(['uploadMaxFilesize' => ini_get('upload_max_filesize')]);
    break;
}