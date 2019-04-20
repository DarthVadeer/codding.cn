<?php 
require './safe.php';

switch ($_REQUEST['a']) {
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    break;
  case 'getCCTVBasicInfo':
    echo file_get_contents('../static/data/cctv.json');
    break;
}