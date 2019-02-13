<?php 
header('Access-Control-Allow-Origin: *');

switch ($_REQUEST['a']) {
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    break;
}