<?php 

// 删除文件失败原因
function whyFsOperateError($path) {
  if (!file_exists($path)) {
    err(2, '当前目录不存在：'.$path);
  } else if (!is_readable($path)) {
    err(2, '当前目录不可读：'.$path);
  } else if (!is_writeable($path)) {
    err(2, '当前目录不可写：'.$path);
  } else {
    err(2, '未知的文件操作错误类型');
  }
}

// 目录-递归删除
function rm($path) {
  if (is_dir($path)) {
    $handler = opendir($path);
    while ($fileName = readdir($handler)) {
      if ($fileName === '.' || $fileName === '..') continue;
      rm($path.'/'.$fileName);
    }
    closedir($handler);
    rmdir($path);
  } else {
    unlink($path) or die(whyFsOperateError($path));
  }
}

// 目录-递归创建
function mkPath($path) {
  $path = preg_replace('/((\\\)|(\/))+/', '/', $path.'/');
  $path = preg_replace('/\/$/', '', $path);
  $pathArr = split('/', $path);
  $path = '';

  foreach ($pathArr as $key => $value) {
    $path .= $value.'/';
    if (!is_dir($path)) {
      mkdir($path) or die(whyFsOperateError($path));
    }
  }
}

// 递归拷贝
function cp($dirFrom, $dirTo) {
  if (is_dir($dirFrom)) {
    mkdir($dirTo);
    $handler = opendir($dirFrom);
    while ($fileName = readdir($handler)) {
      if ($fileName === '.' || $fileName === '..') continue;
      $from = $dirFrom.'/'.$fileName;
      $to = $dirTo.'/'.$fileName;
      is_dir($from) ? cp($from, $to) : copy($from, $to);
    }
    closedir($handler);
  } else {
    copy($dirFrom, $dirTo);
  }
}

function getFileName($path) {
  $path = end(explode('/', $path));
  return strpos($path, '.') > -1 ? substr($path, 0, strrpos($path, '.')) : 'no getFileName';
}

function getFileType($path) {
  $path = end(explode('/', $path));
  return strpos($path, '.') > -1 ? substr($path, strrpos($path, '.') + 1) : 'no getFileType';
}