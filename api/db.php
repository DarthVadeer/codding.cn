<?php 

function query($sql) {
  global $mysqli;
  return $mysqli->query($sql);
}

function queryRow($sql) {
  return query($sql)->fetch_assoc();
}

function queryData($sql) {
  $handler = query($sql);
  $result = [];

  while ($row = $handler->fetch_assoc()) {
    $result[] = $row;
  }

  return $result;
}