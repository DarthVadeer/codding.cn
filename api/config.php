<?php 
error_reporting(1);
header('Content-Type: text/html; Charset=utf-8');

define('isLocal', strpos($_SERVER['HTTP_REFERER'], '6835') > -1);

if (isLocal) {
  header('Access-Control-Allow-Origin: *');
}

// $mysqli = new mysqli('127.0.0.1', 'root', 'root') or die(err(1, '数据库连接失败'));
// $mysqli->query("SET NAMES UTF8") or die(err(1, '字符集设置失败'));

