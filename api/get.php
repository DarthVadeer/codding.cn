<?php 
require './common.php';

switch ($_REQUEST['a']) {
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    exit;
  case 'getImg':
    $url = preg_split('/\?|#/', $_REQUEST['url'])[0];
    $fileName = end(explode('/', $url));
    $fileType = end(explode('.', $fileName));

    if (!$fileName || !$fileName) {
      echo '缺少相关数据： '.$_REQUEST['url'];
      exit;
    }

    $path = './img-cache-goal';
    if (!is_dir($path)) mkdir($path);
    $path.='/'.$fileName;

    if (!file_exists($path)) {
      file_put_contents($path, file_get_contents($_REQUEST['url']));
    }

    header('Content-Type: image/'.$fileType);
    echo file_get_contents($path);
    exit;
  case 'getCCTVIndex':
    echo file_get_contents('http://tv.cctv.com/');
    exit;
}