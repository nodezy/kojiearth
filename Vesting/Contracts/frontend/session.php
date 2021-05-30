<?php
// Start the session
session_start();
// Set session variables
$_SESSION["account"] =  $_GET['account'];
//$_SESSION["walletprovider"] =  $_GET['provider'];
//echo "Session variables "+$_SESSION["account"] +" is set.";
?>