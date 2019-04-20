<?php 
require './config.php';
require './db.php';
require './fs.php';

function err($code, $msg) {
  echo json_encode([
    'code' => $code,
    'msg' => $msg,
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

function res($data) {
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function toGBK($str) {
  return iconv('UTF-8', 'GBK', $str);
}

function toUtf8($str) {
  return iconv('GBK', 'UTF-8', $str);
}

function n() {
  echo "\n";
}

function br() {
  echo '<br>';
}