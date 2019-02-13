<?php 
require 'config.php';

$dbName = $_REQUEST['dbName'];
$tableName = $_REQUEST['tableName'];
$sql = $_REQUEST['sql'];
$mainKey = $_REQUEST['mainKey'];
$mainVal = $_REQUEST['mainVal'];
$targetKey = $_REQUEST['targetKey'];
$targetVal = $_REQUEST['targetVal'];

switch ($_REQUEST['a']) {
  case 'list-db':
    res(queryData("SHOW DATABASES"));
    break;
  case 'list-character':
    res([
      'listGroup' => queryData("SELECT * FROM information_schema.CHARACTER_SETS"),
      'listSub' => queryData("SELECT * FROM information_schema.COLLATIONS"),
    ]);
    break;
  case 'info-db':
    res(queryRow("SHOW CREATE DATABASE ".$dbName));
    break;
}

if (!$dbName) err(1, 'no dbName');
$mysqli->query("USE ".$dbName);

switch ($_REQUEST['a']) {
  case 'info-table':
    res(queryRow("SHOW CREATE TABLE ".$tableName));
    break;
  case 'list-table':
    res(queryData("SHOW TABLES"));
    break;
  case 'list-column':
    res(queryData("DESCRIBE ".$tableName));
    break;
  case 'list-column-info':
    res(queryData("DESC TABLE ".$tableName));
    break;
  case 'list-data':
    $data = queryData("SELECT * FROM ".$_REQUEST['tableName']);
    foreach ($data as $key => $value) {
      foreach ($value as $key2 => $value2) {
        if (mb_strlen($value2) > 20) {
          $data[$key][$key2] = mb_substr($value2, 0, 20).'...';
        }
      }
    }
    res($data);
    break;
  case 'fetch-row':
    res(queryRow("SELECT * FROM $tableName WHERE {$_REQUEST['mainKey']}='{$_REQUEST['mainVal']}' LIMIT 1"));
    break;
}

// checkUid();

switch ($_REQUEST['a']) {
  case 'run-sql':
    $mysqli->query($sql) or die(err(2, '操作失败'));
    err(0, '操作成功');
    break;
  case 'run-sqls':
    $sqls = json_decode($_REQUEST['sqls']);
    foreach ($sqls as $key => $value) {
      $mysqli->query($value) or die(err(2, 'sql 导入失败：'.$value));
    }
    err(0, 'sql 导入成功');
    break;
  case 'db-rename':
    $dbNameNew = $_REQUEST['dbNameNew'];
    $charMain = $_REQUEST['charMain'];
    $char = $_REQUEST['char'];
    $mysqli->query("CREATE DATABASE $dbNameNew DEFAULT CHARACTER SET $charMain COLLATE $char") or die(err(2, '数据库创建失败'));
    $data = queryData("SHOW TABLES FROM $dbName");
    foreach ($data as $key => $value) {
      $_tableName = $value['Tables_in_'.$dbName];
      $mysqli->query("RENAME TABLE {$dbName}.{$_tableName} TO {$dbNameNew}.{$_tableName}") or die(err(2, '数据表移动失败'));
    }
    $mysqli->query("DROP DATABASE $dbName") or die(err(2, '原始库删除失败'));
    err(0, '操作成功');
    break;
  case 'export-db':
    $filename = $_SERVER['SERVER_NAME'].'.sql';
    $cmd = 'mysqldump -uroot -p'.password.' --databases '.$_REQUEST['dbs'].' > '.$filename;
    exec($cmd);
    fileDownload($filename);
    break;
  case 'export-table':

    break;
  /*default:
    echo eval('?><?php '.$_REQUEST['phpCode'].'?>');
    break;*/
}