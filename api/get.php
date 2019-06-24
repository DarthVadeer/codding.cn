<?php 
require './common.php';

switch ($_REQUEST['a']) {
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    exit;
  case 'getCCTVIndex':
    echo file_get_contents('http://tv.cctv.com/');
    exit;
}