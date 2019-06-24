<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; Charset=utf-8');
error_reporting(0);

function err($code, $data) {
  res(array(
    'code' => $code,
    'data' => $data,
  ));
}

function res($data) {
  echo json_encode($data);
  exit;
}
