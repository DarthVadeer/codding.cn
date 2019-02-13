<?php 
require './config.php';

switch ($_REQUEST['a']) {
  case 'get-uid':
    res(['uid' => createUid()]);
    break;
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    break;
}