<?php 
error_reporting(1);
session_start();
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');

define('password', 'root');

$mysqli = new mysqli($_SERVER['SERVER_NAME'], 'root', 'root') or die(err(1, '数据库连接失败'));
$mysqli->query("SET NAMES UTF8") or die(err(1, '字符集设置失败'));

function res($data) {
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function err($code, $msg) {
  res([
    'code' => $code,
    'msg' => $msg,
  ]);
}

function queryRow($sql) {
  global $mysqli;
  return $mysqli->query($sql)->fetch_assoc();
}

function queryData($sql) {
  global $mysqli;
  $result = [];
  $handler = $mysqli->query($sql);
  
  while ($row = $handler->fetch_assoc()) {
    $result[] = $row;
  }

  return $result;
}

function sha256($str) {
  return hash('sha256', $str);
}

function createUid() {
  $uid = sha256(uniqid());
  $_SESSION['uid'] = $uid;
  return $uid;
}

function checkUid() {
  $uid = $_SESSION['uid'];
  if (!$uid) {
    session_destroy();
    err(1, 'bye');
  };
  $_SESSION['uid'] = '';
  if (sha256($uid) !== $_REQUEST['pub']) err(1, 'uid err ...');
  return $uid;
}

function fileDownload($path, $filename) {
  $path = str_replace('\\', '/', $path);
  $filename = $filename ? $filename : (preg_match('\\|\/', $path) ? substr($path, strrpos($path, '/') + 1) : $path);

  header('Content-Disposition: attachment; filename='.$filename);
  echo file_get_contents($path);
  exit;
}
