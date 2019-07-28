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
    $path = './cctvIndex.html';

    if (!file_exists($path)) {
      file_put_contents($path, (time() - 24 * 60 * 60)."\n");
    }

    $handle = fopen($path, 'r+');
    $time = trim(fgets($handle));

    if (time() - $time > 20 * 60) {
      $str = file_get_contents('http://tv.cctv.com/');
      file_put_contents($path, time()."\n".$str);
      echo $str;
    } else {
      $str = file_get_contents($path);
      echo substr($str, strpos($str, "\n"));
    }
    exit;
  case 'getStatus':
    /*
      Array
      (
          [a] => getStatus
          [url] => http://www.i-funbox.com/coupons/out/voucher/5070566.html?ca=recommendedcoupons_1_block&pt=merchant&pv=2501&a=1
      )
    */
    $ch = curl_init($_REQUEST['url']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
    $headerRes = curl_getinfo($ch); 
    echo json_encode($headerRes);
    curl_close($ch);
    break;
}